import { and, eq } from "drizzle-orm";
import { UsersRound } from "lucide-react";
import { ActionForm } from "@/components/action-form";
import { db } from "@/db";
import { applications, jobs, profiles } from "@/db/schema";
import { updateApplicationStatusAction } from "@/lib/actions";
import { requireUser } from "@/lib/session";

export const dynamic = "force-dynamic";

export default async function JobApplicationsPage({ params }: { params: Promise<{ id: string }> }) {
  const user = await requireUser("recruiter");
  const { id } = await params;
  const [recruiter] = await db.select().from(profiles).where(eq(profiles.userId, user.id)).limit(1);
  const [job] = recruiter ? await db.select().from(jobs).where(and(eq(jobs.id, id), eq(jobs.recruiterId, recruiter.id))).limit(1) : [];
  const apps = job ? await db.select().from(applications).where(eq(applications.jobId, job.id)) : [];
  const students = await db.select().from(profiles).where(eq(profiles.role, "student"));
  const studentMap = new Map(students.map((s) => [s.id, s]));
  return (
    <main className="container grid gap-6 py-8">
      <h1 className="flex items-center gap-3 text-3xl font-black"><UsersRound className="text-[#70f0c6]" />Applicants for {job?.title || "job"}</h1>
      <div className="grid gap-4">
        {apps.map((app) => {
          const student = studentMap.get(app.studentId);
          const parsed = student?.resumeParsed as { fullTextSummary?: string } | null;
          return (
            <article className="card grid gap-3 p-5" key={app.id}>
              <div className="flex flex-wrap items-start justify-between gap-3"><div><h2 className="text-xl font-black">{student?.fullName}</h2><p className="text-sm text-white/58">{student?.course}</p></div><span className="badge">{app.matchScore}% match</span></div>
              <p className="text-sm"><b>Skills:</b> {(student?.skills || []).join(", ")}</p>
              <p className="text-sm"><b>Resume:</b> {parsed?.fullTextSummary || "No summary available"}</p>
              <p className="text-sm"><b>Matched:</b> {(app.matchedSkills || []).join(", ") || "None"} · <b>Missing:</b> {(app.missingSkills || []).join(", ") || "None"}</p>
              <ActionForm action={updateApplicationStatusAction} submitLabel="Update status" className="flex flex-wrap items-end gap-3">
                <input name="applicationId" type="hidden" value={app.id} />
                <label className="grid gap-2 text-sm font-semibold">Status<select className="field" name="status" defaultValue={app.status || "applied"}><option value="applied">Applied</option><option value="shortlisted">Shortlisted</option><option value="rejected">Rejected</option><option value="selected">Selected</option></select></label>
              </ActionForm>
            </article>
          );
        })}
      </div>
    </main>
  );
}
