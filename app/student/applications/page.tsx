import { eq, desc } from "drizzle-orm";
import { db } from "@/db";
import { applications, jobs, profiles } from "@/db/schema";
import { requireUser } from "@/lib/session";
import { formatDate } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function StudentApplicationsPage() {
  const user = await requireUser("student");
  const [student] = await db.select().from(profiles).where(eq(profiles.userId, user.id)).limit(1);
  const apps = student ? await db.select().from(applications).where(eq(applications.studentId, student.id)).orderBy(desc(applications.createdAt)) : [];
  const jobRows = await db.select().from(jobs);
  const jobMap = new Map(jobRows.map((job) => [job.id, job]));

  return (
    <main className="container grid gap-6 py-8">
      <h1 className="text-3xl font-bold">Applications</h1>
      <div className="card overflow-x-auto">
        <table>
          <thead><tr><th>Job</th><th>Date</th><th>Status</th><th>Match</th></tr></thead>
          <tbody>{apps.map((app) => <tr key={app.id}><td>{jobMap.get(app.jobId)?.title || "Job"}</td><td>{formatDate(app.createdAt)}</td><td><span className="badge">{app.status}</span></td><td>{app.matchScore}%</td></tr>)}</tbody>
        </table>
      </div>
    </main>
  );
}
