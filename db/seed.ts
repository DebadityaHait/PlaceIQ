import { hash } from "bcryptjs";
import { loadEnvConfig } from "@next/env";
import { eq } from "drizzle-orm";

loadEnvConfig(process.cwd());
import { db } from "@/db";
import { jobs, profiles, users, type UserRole } from "@/db/schema";

async function upsertUser(email: string, role: UserRole, fullName: string, extra: Partial<typeof profiles.$inferInsert>) {
  const passwordHash = await hash("Password123!", 12);
  const existing = await db.select().from(users).where(eq(users.email, email)).limit(1);
  const [user] = existing.length
    ? await db.update(users).set({ passwordHash, role }).where(eq(users.email, email)).returning()
    : await db.insert(users).values({ email, passwordHash, role }).returning();

  const profileRows = await db.select().from(profiles).where(eq(profiles.userId, user.id)).limit(1);
  const values = { userId: user.id, role, fullName, email, ...extra };
  const [profile] = profileRows.length
    ? await db.update(profiles).set(values).where(eq(profiles.userId, user.id)).returning()
    : await db.insert(profiles).values(values).returning();
  return { user, profile };
}

async function main() {
  const student = await upsertUser("student@example.com", "student", "John Doe", {
    course: "B.Tech Computer Science",
    skills: ["Python", "Machine Learning", "SQL"],
    verificationStatus: "verified",
    isJobEligible: true
  });

  const recruiter = await upsertUser("recruiter@example.com", "recruiter", "Jane Recruiter", {
    companyName: "Acme Tech",
    verificationStatus: "verified",
    isJobEligible: true
  });

  await upsertUser("officer@example.com", "officer", "Pat Officer", {
    verificationStatus: "verified",
    isJobEligible: true
  });

  const demoJobs = [
    ["Python Developer", "Build backend services and data tooling.", ["Python", "Django", "SQL"]],
    ["Machine Learning Intern", "Work on model evaluation and data preparation.", ["Python", "Machine Learning", "Pandas"]],
    ["Frontend Developer", "Create responsive web interfaces.", ["React", "TypeScript", "Tailwind"]],
    ["Full Stack Developer", "Own product features across web and database layers.", ["Next.js", "PostgreSQL", "Node.js"]]
  ] as const;

  const deadline = new Date(Date.now() + 30 * 86400000).toISOString().slice(0, 10);
  for (const [title, description, requiredSkills] of demoJobs) {
    const existing = await db.select().from(jobs).where(eq(jobs.title, title)).limit(1);
    const values = {
      recruiterId: recruiter.profile.id,
      title,
      description,
      requiredSkills: [...requiredSkills],
      location: "Bengaluru",
      jobType: title.includes("Intern") ? "Internship" : "Full-time",
      salaryRange: "Demo range",
      deadline,
      status: "published" as const
    };
    if (existing.length) await db.update(jobs).set(values).where(eq(jobs.id, existing[0].id));
    else await db.insert(jobs).values(values);
  }

  console.log(`Seeded demo accounts and jobs. Verified student: ${student.user.email}`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
