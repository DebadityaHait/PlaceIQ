import { eq } from "drizzle-orm";
import { db } from "@/db";
import { profiles } from "@/db/schema";
import { requireUser } from "@/lib/session";

export const dynamic = "force-dynamic";

export default async function StudentsPage() {
  await requireUser("officer");
  const rows = await db.select().from(profiles).where(eq(profiles.role, "student"));
  return (
    <main className="container grid gap-6 py-8">
      <h1 className="text-3xl font-bold">Students</h1>
      <div className="card overflow-x-auto">
        <table><thead><tr><th>Name</th><th>Email</th><th>Course</th><th>Skills</th><th>Status</th><th>Eligible</th></tr></thead><tbody>
          {rows.map((s) => <tr key={s.id}><td>{s.fullName}</td><td>{s.email}</td><td>{s.course}</td><td>{(s.skills || []).join(", ")}</td><td><span className="badge">{s.verificationStatus}</span></td><td>{s.isJobEligible ? "Yes" : "No"}</td></tr>)}
        </tbody></table>
      </div>
    </main>
  );
}
