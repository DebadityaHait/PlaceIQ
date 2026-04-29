import { eq, inArray } from "drizzle-orm";
import Link from "next/link";
import { BriefcaseBusiness, ClipboardList, PlusCircle, UserRoundCheck } from "lucide-react";
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
      <h1 className="text-3xl font-black">Recruiter dashboard</h1>
      <div className="grid gap-4 md:grid-cols-3">
        <div className="card metric p-5"><BriefcaseBusiness className="mb-5 text-[#70f0c6]" /><p className="text-sm text-white/58">Posted jobs</p><p className="mt-2 text-3xl font-black">{posted.length}</p></div>
        <div className="card metric p-5"><ClipboardList className="mb-5 text-[#55c7ff]" /><p className="text-sm text-white/58">Applications</p><p className="mt-2 text-3xl font-black">{apps.length}</p></div>
        <div className="card metric p-5"><UserRoundCheck className="mb-5 text-[#ffd166]" /><p className="text-sm text-white/58">Shortlisted</p><p className="mt-2 text-3xl font-black">{apps.filter((a) => a.status === "shortlisted").length}</p></div>
      </div>
      <Link className="btn" href="/recruiter/jobs/new"><PlusCircle size={18} /> Post a job</Link>
    </main>
  );
}
