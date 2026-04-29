import { desc, eq } from "drizzle-orm";
import { Sparkles, Target } from "lucide-react";
import { ActionForm } from "@/components/action-form";
import { db } from "@/db";
import { jobs, profiles } from "@/db/schema";
import { applyToJobAction } from "@/lib/actions";
import { calculateMatch } from "@/lib/services/matching";
import { requireUser } from "@/lib/session";

export const dynamic = "force-dynamic";

export default async function StudentMatchesPage() {
  const user = await requireUser("student");
  const [student] = await db.select().from(profiles).where(eq(profiles.userId, user.id)).limit(1);
  const rows = await db.select().from(jobs).where(eq(jobs.status, "published")).orderBy(desc(jobs.createdAt));
  const matches = rows.map((job) => ({ job, match: calculateMatch(student?.skills || [], job.requiredSkills || []) }))
    .sort((a, b) => b.match.score - a.match.score || Number(b.job.createdAt) - Number(a.job.createdAt));
  const canApply = student?.verificationStatus === "verified" && student.isJobEligible;

  return (
    <main className="container grid gap-6 py-8">
      <div className="flex items-center gap-3"><Sparkles className="text-[#70f0c6]" /><h1 className="text-3xl font-black">AI-assisted matches</h1></div>
      <div className="grid gap-4">
        {matches.map(({ job, match }) => (
          <article className="card grid gap-3 p-5" key={job.id}>
            <div className="flex items-center justify-between gap-3"><h2 className="flex items-center gap-2 text-xl font-black"><Target size={20} className="text-[#55c7ff]" />{job.title}</h2><span className="badge">{match.score}% match</span></div>
            <div className="h-2 rounded-full bg-white/10"><div className="h-2 rounded-full bg-gradient-to-r from-[#70f0c6] to-[#55c7ff]" style={{ width: `${match.score}%` }} /></div>
            <p className="text-sm"><b>Matched:</b> {match.matchedSkills.join(", ") || "None"}</p>
            <p className="text-sm"><b>Missing:</b> {match.missingSkills.join(", ") || "None"}</p>
            {canApply ? (
              <ActionForm action={applyToJobAction} submitLabel="Apply" className="grid max-w-sm gap-3">
                <input name="jobId" type="hidden" value={job.id} />
              </ActionForm>
            ) : <p className="text-sm font-semibold text-[#ffd166]">Your profile must be verified by a placement officer before you can apply.</p>}
          </article>
        ))}
      </div>
    </main>
  );
}
