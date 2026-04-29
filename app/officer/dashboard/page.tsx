import { eq } from "drizzle-orm";
import { db } from "@/db";
import { jobs, profiles } from "@/db/schema";
import { requireUser } from "@/lib/session";

export const dynamic = "force-dynamic";

export default async function OfficerDashboard() {
  await requireUser("officer");
  const students = await db.select().from(profiles).where(eq(profiles.role, "student"));
  const publishedJobs = await db.select().from(jobs).where(eq(jobs.status, "published"));
  return (
    <main className="container grid gap-6 py-8">
      <h1 className="text-3xl font-bold">Officer dashboard</h1>
      <div className="grid gap-4 md:grid-cols-4">
        <div className="card p-5"><p className="text-sm text-[#66736c]">Pending</p><p className="mt-2 text-2xl font-bold">{students.filter((s) => s.verificationStatus === "pending").length}</p></div>
        <div className="card p-5"><p className="text-sm text-[#66736c]">Verified</p><p className="mt-2 text-2xl font-bold">{students.filter((s) => s.verificationStatus === "verified").length}</p></div>
        <div className="card p-5"><p className="text-sm text-[#66736c]">Rejected</p><p className="mt-2 text-2xl font-bold">{students.filter((s) => s.verificationStatus === "rejected").length}</p></div>
        <div className="card p-5"><p className="text-sm text-[#66736c]">Published jobs</p><p className="mt-2 text-2xl font-bold">{publishedJobs.length}</p></div>
      </div>
    </main>
  );
}
