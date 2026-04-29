import { desc, eq } from "drizzle-orm";
import Link from "next/link";
import { BriefcaseBusiness, PlusCircle } from "lucide-react";
import { db } from "@/db";
import { jobs, profiles } from "@/db/schema";
import { requireUser } from "@/lib/session";
import { formatDate } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function RecruiterJobsPage() {
  const user = await requireUser("recruiter");
  const [profile] = await db.select().from(profiles).where(eq(profiles.userId, user.id)).limit(1);
  const rows = profile ? await db.select().from(jobs).where(eq(jobs.recruiterId, profile.id)).orderBy(desc(jobs.createdAt)) : [];
  return (
    <main className="container grid gap-6 py-8">
      <div className="flex items-center justify-between"><h1 className="flex items-center gap-3 text-3xl font-black"><BriefcaseBusiness className="text-[#70f0c6]" />Your jobs</h1><Link className="btn" href="/recruiter/jobs/new"><PlusCircle size={18} /> Post job</Link></div>
      <div className="card overflow-x-auto">
        <table><thead><tr><th>Title</th><th>Status</th><th>Deadline</th><th></th></tr></thead><tbody>
          {rows.map((job) => <tr key={job.id}><td>{job.title}</td><td><span className="badge">{job.status}</span></td><td>{formatDate(job.deadline)}</td><td><Link className="text-sm font-bold" href={`/recruiter/jobs/${job.id}`}>Open</Link></td></tr>)}
        </tbody></table>
      </div>
    </main>
  );
}
