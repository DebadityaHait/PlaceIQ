import { desc } from "drizzle-orm";
import { BriefcaseBusiness } from "lucide-react";
import { db } from "@/db";
import { jobs, profiles } from "@/db/schema";
import { requireUser } from "@/lib/session";
import { formatDate } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function OfficerJobsPage() {
  await requireUser("officer");
  const rows = await db.select().from(jobs).orderBy(desc(jobs.createdAt));
  const recruiters = await db.select().from(profiles);
  const recruiterMap = new Map(recruiters.map((p) => [p.id, p.companyName || p.fullName]));
  return (
    <main className="container grid gap-6 py-8">
      <h1 className="flex items-center gap-3 text-3xl font-black"><BriefcaseBusiness className="text-[#70f0c6]" />Jobs</h1>
      <div className="card overflow-x-auto">
        <table><thead><tr><th>Title</th><th>Company</th><th>Skills</th><th>Status</th><th>Deadline</th></tr></thead><tbody>
          {rows.map((j) => <tr key={j.id}><td>{j.title}</td><td>{recruiterMap.get(j.recruiterId)}</td><td>{(j.requiredSkills || []).join(", ")}</td><td><span className="badge">{j.status}</span></td><td>{formatDate(j.deadline)}</td></tr>)}
        </tbody></table>
      </div>
    </main>
  );
}
