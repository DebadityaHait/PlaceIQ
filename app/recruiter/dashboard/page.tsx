import { eq, inArray } from "drizzle-orm";
import Link from "next/link";
import { db } from "@/db";
import { applications, jobs, profiles } from "@/db/schema";
import { requireUser } from "@/lib/session";

export const dynamic = "force-dynamic";

export default async function RecruiterDashboard() {
  const user = await requireUser("recruiter");
  const [profile] = await db.select().from(profiles).where(eq(profiles.userId, user.id)).limit(1);
  const posted = profile ? await db.select().from(jobs).where(eq(jobs.recruiterId, profile.id)) : [];
  const apps = posted.length ? await db.select().from(applications).where(inArray(applications.jobId, posted.map((j) => j.id))) : [];
  return (
    <main className="container grid gap-6 py-8">
      <h1 className="text-3xl font-bold">Recruiter dashboard</h1>
      <div className="grid gap-4 md:grid-cols-3">
        <div className="card p-5"><p className="text-sm text-[#66736c]">Posted jobs</p><p className="mt-2 text-2xl font-bold">{posted.length}</p></div>
        <div className="card p-5"><p className="text-sm text-[#66736c]">Applications</p><p className="mt-2 text-2xl font-bold">{apps.length}</p></div>
        <div className="card p-5"><p className="text-sm text-[#66736c]">Shortlisted</p><p className="mt-2 text-2xl font-bold">{apps.filter((a) => a.status === "shortlisted").length}</p></div>
      </div>
      <Link className="btn" href="/recruiter/jobs/new">Post a job</Link>
    </main>
  );
}
