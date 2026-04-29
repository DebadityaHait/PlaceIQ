import { desc, eq } from "drizzle-orm";
import { ClipboardCheck, FileText, Lightbulb, Rocket, Wand2 } from "lucide-react";
import { db } from "@/db";
import { jobs, profiles } from "@/db/schema";
import { buildResumeDraft, buildSkillImprovementPlan, buildTailoringTips } from "@/lib/services/career-tools";
import { requireUser } from "@/lib/session";

export const dynamic = "force-dynamic";

export default async function StudentToolsPage() {
  const user = await requireUser("student");
  const [student] = await db.select().from(profiles).where(eq(profiles.userId, user.id)).limit(1);
  const publishedJobs = await db.select().from(jobs).where(eq(jobs.status, "published")).orderBy(desc(jobs.createdAt));

  if (!student) {
    return (
      <main className="container py-8">
        <div className="card p-6">Create your student profile first.</div>
      </main>
    );
  }

  const resumeDraft = buildResumeDraft(student);
  const tailoring = publishedJobs.slice(0, 4).map((job) => ({ job, tips: buildTailoringTips(student, job) }));
  const improvementPlan = buildSkillImprovementPlan(student, publishedJobs);

  return (
    <main className="container grid gap-6 py-8">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <div className="mb-2 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-1.5 text-sm font-bold text-[#dffff5]">
            <Wand2 size={16} /> Lightweight career lab
          </div>
          <h1 className="text-3xl font-black">Resume and skill tools</h1>
        </div>
      </div>

      <section className="grid gap-4 lg:grid-cols-[1.1fr_0.9fr]">
        <article className="card grid gap-4 p-5">
          <div className="flex items-center gap-3">
            <span className="grid h-11 w-11 place-items-center rounded-2xl bg-[#70f0c6]/14 text-[#70f0c6]"><FileText /></span>
            <div>
              <h2 className="text-xl font-black">One-page resume maker</h2>
              <p className="text-sm text-white/58">Generated from your profile and parsed resume details.</p>
            </div>
          </div>
          <pre className="max-h-[520px] overflow-auto whitespace-pre-wrap rounded-2xl border border-white/10 bg-black/24 p-4 text-sm leading-6 text-white/82">{resumeDraft}</pre>
        </article>

        <article className="card grid content-start gap-4 p-5">
          <div className="flex items-center gap-3">
            <span className="grid h-11 w-11 place-items-center rounded-2xl bg-[#55c7ff]/14 text-[#55c7ff]"><Lightbulb /></span>
            <div>
              <h2 className="text-xl font-black">Skill improvement planner</h2>
              <p className="text-sm text-white/58">Based on gaps across currently published jobs.</p>
            </div>
          </div>
          <div className="grid gap-3">
            {improvementPlan.length ? improvementPlan.map((item) => (
              <div className="panel p-4" key={item.skill}>
                <div className="flex items-center justify-between gap-3">
                  <h3 className="font-black">{item.skill}</h3>
                  <span className="badge">{item.priority}</span>
                </div>
                <p className="mt-1 text-sm text-white/58">Missing from {item.demand} matching job{item.demand === 1 ? "" : "s"}.</p>
                <p className="mt-2 text-sm text-white/78">{item.action}</p>
              </div>
            )) : <p className="text-sm text-white/64">You already cover the visible job requirements well.</p>}
          </div>
        </article>
      </section>

      <section className="card grid gap-4 p-5">
        <div className="flex items-center gap-3">
          <span className="grid h-11 w-11 place-items-center rounded-2xl bg-[#ffd166]/14 text-[#ffd166]"><Rocket /></span>
          <div>
            <h2 className="text-xl font-black">Resume tailoring shortcuts</h2>
            <p className="text-sm text-white/58">Fast, deterministic suggestions for the newest published jobs.</p>
          </div>
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          {tailoring.map(({ job, tips }) => (
            <article className="panel grid gap-3 p-4" key={job.id}>
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h3 className="font-black">{tips.headline}</h3>
                  <p className="mt-1 text-sm text-white/62">{tips.summaryLine}</p>
                </div>
                <span className="badge">{tips.score}%</span>
              </div>
              <ul className="grid gap-2 text-sm text-white/78">
                {tips.bullets.map((bullet) => (
                  <li className="flex gap-2" key={bullet}><ClipboardCheck className="mt-0.5 shrink-0 text-[#70f0c6]" size={16} />{bullet}</li>
                ))}
              </ul>
              {tips.missingSkills.length ? <p className="text-xs text-white/48">Improve next: {tips.missingSkills.join(", ")}</p> : null}
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}
