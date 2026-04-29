import { desc, eq } from "drizzle-orm";
import { BriefcaseBusiness, CalendarClock, MapPin } from "lucide-react";
import { ActionForm } from "@/components/action-form";
import { db } from "@/db";
import { jobs, profiles } from "@/db/schema";
import { applyToJobAction } from "@/lib/actions";
import { requireUser } from "@/lib/session";
import { formatDate } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function StudentJobsPage() {
  const user = await requireUser("student");
  const [student] = await db.select().from(profiles).where(eq(profiles.userId, user.id)).limit(1);
  const rows = await db.select().from(jobs).where(eq(jobs.status, "published")).orderBy(desc(jobs.createdAt));
  const recruiters = await db.select().from(profiles).where(eq(profiles.role, "recruiter"));
  const recruiterMap = new Map(recruiters.map((p) => [p.id, p.companyName || p.fullName]));
  const canApply = student?.verificationStatus === "verified" && student.isJobEligible;

  return (
    <main className="container grid gap-6 py-8">
      <div className="flex items-center gap-3"><BriefcaseBusiness className="text-[#70f0c6]" /><h1 className="text-3xl font-black">Published jobs</h1></div>
      {!canApply ? <div className="card p-4 text-sm font-semibold text-[#ffd166]">Your profile must be verified by a placement officer before you can apply.</div> : null}
      <div className="grid gap-4">
        {rows.map((job) => (
          <article className="card grid gap-3 p-5" key={job.id}>
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div><h2 className="text-xl font-black">{job.title}</h2><p className="mt-1 flex flex-wrap items-center gap-3 text-sm text-white/58"><span>{recruiterMap.get(job.recruiterId)}</span><span className="inline-flex items-center gap-1"><MapPin size={14} />{job.location || "Remote"}</span><span className="inline-flex items-center gap-1"><CalendarClock size={14} />{formatDate(job.deadline)}</span></p></div>
              <span className="badge">{job.jobType || "Role"}</span>
            </div>
            <p className="text-sm">{job.description}</p>
            <p className="text-sm"><b>Required:</b> {(job.requiredSkills || []).join(", ")}</p>
            {canApply ? (
              <ActionForm action={applyToJobAction} submitLabel="Apply" className="grid max-w-sm gap-3">
                <input name="jobId" type="hidden" value={job.id} />
                <textarea className="field" name="coverNote" placeholder="Cover note" />
              </ActionForm>
            ) : null}
          </article>
        ))}
      </div>
    </main>
  );
}
