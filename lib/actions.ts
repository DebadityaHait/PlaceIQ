"use server";

import { hash } from "bcryptjs";
import { and, desc, eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { db } from "@/db";
import { applications, jobs, notifications, profiles, users, type ApplicationStatus } from "@/db/schema";
import { requireUser } from "@/lib/session";
import { calculateMatch } from "@/lib/services/matching";
import { createNotification } from "@/lib/services/notifications";
import { parseResume } from "@/lib/services/resume-parser";
import { sendEmail } from "@/lib/services/email";
import { parseSkillList } from "@/lib/utils";
import { applicationSchema, applicationStatusSchema } from "@/lib/validators/application";
import { registerSchema } from "@/lib/validators/auth";
import { jobSchema } from "@/lib/validators/job";
import { studentProfileSchema, verificationSchema } from "@/lib/validators/profile";
import { MAX_RESUME_BYTES } from "@/lib/validators/resume";

export type ActionState = { ok?: boolean; message?: string };

export async function registerAction(_state: ActionState, formData: FormData): Promise<ActionState> {
  const parsed = registerSchema.safeParse({
    fullName: formData.get("fullName"),
    email: formData.get("email"),
    password: formData.get("password"),
    role: formData.get("role"),
    course: formData.get("course") || undefined,
    companyName: formData.get("companyName") || undefined
  });
  if (!parsed.success) return { message: "Please check the registration fields." };

  const passwordHash = await hash(parsed.data.password, 12);
  try {
    const [user] = await db.insert(users).values({
      email: parsed.data.email,
      passwordHash,
      role: parsed.data.role
    }).returning();

    await db.insert(profiles).values({
      userId: user.id,
      role: parsed.data.role,
      fullName: parsed.data.fullName,
      email: parsed.data.email,
      course: parsed.data.role === "student" ? parsed.data.course : undefined,
      companyName: parsed.data.role === "recruiter" ? parsed.data.companyName : undefined,
      verificationStatus: parsed.data.role === "student" ? "pending" : "verified",
      isJobEligible: parsed.data.role !== "student"
    });

    await createNotification({
      userId: user.id,
      type: "profile_created",
      title: "Profile created",
      body: parsed.data.role === "student" ? "Your placement profile is pending officer verification." : "Your demo account is ready."
    });
  } catch (error) {
    console.error(error);
    return { message: "That email may already be registered." };
  }

  redirect("/login?registered=1");
}

export async function updateStudentProfileAction(_state: ActionState, formData: FormData): Promise<ActionState> {
  const user = await requireUser("student");
  const parsed = studentProfileSchema.safeParse({
    fullName: formData.get("fullName"),
    dob: formData.get("dob") || undefined,
    course: formData.get("course"),
    graduationYear: formData.get("graduationYear"),
    skills: parseSkillList(formData.get("skills"))
  });
  if (!parsed.success) return { message: "Please check the profile fields." };

  const update: Partial<typeof profiles.$inferInsert> = {
    fullName: parsed.data.fullName,
    dob: parsed.data.dob || undefined,
    course: parsed.data.course,
    graduationYear: parsed.data.graduationYear,
    skills: parsed.data.skills
  };

  const file = formData.get("resume");
  let message = "Profile updated.";
  if (file instanceof File && file.size > 0) {
    if (file.type !== "application/pdf") return { message: "Resume must be a PDF." };
    if (file.size > MAX_RESUME_BYTES) return { message: "Resume must be 5 MB or smaller." };
    const bytes = Buffer.from(await file.arrayBuffer());
    update.resumeFileName = file.name;
    update.resumeMimeType = file.type;
    update.resumeSizeBytes = file.size;
    update.resumeData = bytes.toString("base64");

    const result = await parseResume(bytes, file.type);
    if (result.ok) {
      update.resumeParsed = result.parsed;
      update.skills = Array.from(new Set([...parsed.data.skills, ...result.skills]));
      message = "Profile and resume updated. AI extracted skills were added for review.";
      await createNotification({ userId: user.id, type: "resume_parsed", title: "Resume parsed", body: "AI parsing completed. Review your extracted skills." });
    } else {
      message = process.env.GEMINI_API_KEY
        ? "Resume uploaded, but AI parsing failed. Please add or review your skills manually."
        : "Resume uploaded. AI parsing is not configured, so please enter your skills manually.";
      await createNotification({ userId: user.id, type: "resume_parse_failed", title: "Resume uploaded", body: "AI parsing failed or was unavailable, but your resume was saved." });
    }
  }

  await db.update(profiles).set(update).where(eq(profiles.userId, user.id));
  revalidatePath("/student/profile");
  revalidatePath("/student/dashboard");
  return { ok: true, message };
}

export async function createJobAction(_state: ActionState, formData: FormData): Promise<ActionState> {
  const user = await requireUser("recruiter");
  const [profile] = await db.select().from(profiles).where(eq(profiles.userId, user.id)).limit(1);
  if (!profile) return { message: "Recruiter profile not found." };

  const parsed = jobSchema.safeParse({
    title: formData.get("title"),
    description: formData.get("description"),
    requiredSkills: parseSkillList(formData.get("requiredSkills")),
    location: formData.get("location") || undefined,
    jobType: formData.get("jobType") || undefined,
    salaryRange: formData.get("salaryRange") || undefined,
    deadline: formData.get("deadline"),
    status: formData.get("status") || "published"
  });
  if (!parsed.success) return { message: "Please check the job fields. Deadline must be in the future." };

  const [job] = await db.insert(jobs).values({ recruiterId: profile.id, ...parsed.data }).returning();
  revalidatePath("/recruiter/jobs");
  revalidatePath("/student/jobs");
  revalidatePath("/student/matches");
  redirect(`/recruiter/jobs/${job.id}`);
}

export async function applyToJobAction(_state: ActionState, formData: FormData): Promise<ActionState> {
  const user = await requireUser("student");
  const parsed = applicationSchema.safeParse({ jobId: formData.get("jobId"), coverNote: formData.get("coverNote") || undefined });
  if (!parsed.success) return { message: "Invalid application." };

  const [student] = await db.select().from(profiles).where(eq(profiles.userId, user.id)).limit(1);
  if (!student || student.verificationStatus !== "verified" || !student.isJobEligible) {
    return { message: "Your profile must be verified by a placement officer before you can apply." };
  }

  const [job] = await db.select().from(jobs).where(and(eq(jobs.id, parsed.data.jobId), eq(jobs.status, "published"))).limit(1);
  if (!job) return { message: "Job is not available." };

  const match = calculateMatch(student.skills || [], job.requiredSkills || []);
  try {
    await db.insert(applications).values({
      jobId: job.id,
      studentId: student.id,
      coverNote: parsed.data.coverNote,
      matchScore: match.score,
      matchedSkills: match.matchedSkills,
      missingSkills: match.missingSkills
    });
    await createNotification({ userId: user.id, type: "application_submitted", title: "Application submitted", body: `Your application for ${job.title} was submitted.` });
  } catch (error) {
    console.error(error);
    return { message: "You may have already applied to this job." };
  }

  revalidatePath("/student/applications");
  return { ok: true, message: "Application submitted." };
}

export async function verifyProfileAction(_state: ActionState, formData: FormData): Promise<ActionState> {
  await requireUser("officer");
  const parsed = verificationSchema.safeParse({
    profileId: formData.get("profileId"),
    action: formData.get("action"),
    rejectionReason: formData.get("rejectionReason") || undefined
  });
  if (!parsed.success) return { message: "Rejection reason is required when rejecting a profile." };

  const [profile] = await db.select().from(profiles).where(eq(profiles.id, parsed.data.profileId)).limit(1);
  if (!profile || profile.role !== "student") return { message: "Student profile not found." };

  const verified = parsed.data.action === "verified";
  await db.update(profiles).set({
    verificationStatus: parsed.data.action,
    isJobEligible: verified,
    rejectionReason: verified ? null : parsed.data.rejectionReason
  }).where(eq(profiles.id, profile.id));

  await createNotification({
    userId: profile.userId,
    type: verified ? "profile_verified" : "profile_rejected",
    title: verified ? "Profile verified" : "Profile rejected",
    body: verified ? "You are eligible to apply for jobs." : `Reason: ${parsed.data.rejectionReason}`
  });
  await sendEmail({
    to: profile.email,
    subject: verified ? "PlaceIQ profile verified" : "PlaceIQ profile rejected",
    html: verified ? "<p>You are eligible to apply for jobs.</p>" : `<p>${parsed.data.rejectionReason}</p>`
  });

  revalidatePath("/officer/pending-profiles");
  revalidatePath("/officer/students");
  return { ok: true, message: verified ? "Profile verified." : "Profile rejected." };
}

export async function updateApplicationStatusAction(_state: ActionState, formData: FormData): Promise<ActionState> {
  const user = await requireUser("recruiter");
  const parsed = applicationStatusSchema.safeParse({ applicationId: formData.get("applicationId"), status: formData.get("status") });
  if (!parsed.success) return { message: "Invalid status update." };

  const rows = await db
    .select({ app: applications, job: jobs, recruiter: profiles, student: profiles })
    .from(applications)
    .innerJoin(jobs, eq(applications.jobId, jobs.id))
    .innerJoin(profiles, eq(jobs.recruiterId, profiles.id))
    .where(and(eq(applications.id, parsed.data.applicationId), eq(profiles.userId, user.id)))
    .limit(1);

  const row = rows[0];
  if (!row) return { message: "Application not found." };

  await db.update(applications).set({ status: parsed.data.status as ApplicationStatus }).where(eq(applications.id, parsed.data.applicationId));
  const [student] = await db.select().from(profiles).where(eq(profiles.id, row.app.studentId)).limit(1);
  if (student) {
    await createNotification({
      userId: student.userId,
      type: `candidate_${parsed.data.status}`,
      title: "Application status updated",
      body: `Your application for ${row.job.title} is now ${parsed.data.status}.`
    });
    await sendEmail({
      to: student.email,
      subject: `PlaceIQ application ${parsed.data.status}`,
      html: `<p>Your application for ${row.job.title} is now ${parsed.data.status}.</p>`
    });
  }

  revalidatePath(`/recruiter/jobs/${row.job.id}/applications`);
  return { ok: true, message: "Application status updated." };
}

export async function markNotificationReadAction(formData: FormData) {
  const user = await requireUser();
  const id = String(formData.get("id") || "");
  if (!id) return;
  await db.update(notifications).set({ readAt: new Date() }).where(and(eq(notifications.id, id), eq(notifications.userId, user.id)));
  revalidatePath("/student/notifications");
}

export async function getRecentNotifications(userId: string, limit = 5) {
  return db.select().from(notifications).where(eq(notifications.userId, userId)).orderBy(desc(notifications.createdAt)).limit(limit);
}
