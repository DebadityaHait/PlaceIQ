import { eq } from "drizzle-orm";
import { BadgeCheck, BriefcaseBusiness, Clock3, XCircle } from "lucide-react";
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
      <h1 className="text-3xl font-black">Officer dashboard</h1>
      <div className="grid gap-4 md:grid-cols-4">
        <div className="card metric p-5"><Clock3 className="mb-5 text-[#ffd166]" /><p className="text-sm text-white/58">Pending</p><p className="mt-2 text-3xl font-black">{students.filter((s) => s.verificationStatus === "pending").length}</p></div>
        <div className="card metric p-5"><BadgeCheck className="mb-5 text-[#70f0c6]" /><p className="text-sm text-white/58">Verified</p><p className="mt-2 text-3xl font-black">{students.filter((s) => s.verificationStatus === "verified").length}</p></div>
        <div className="card metric p-5"><XCircle className="mb-5 text-[#ff8a8a]" /><p className="text-sm text-white/58">Rejected</p><p className="mt-2 text-3xl font-black">{students.filter((s) => s.verificationStatus === "rejected").length}</p></div>
        <div className="card metric p-5"><BriefcaseBusiness className="mb-5 text-[#55c7ff]" /><p className="text-sm text-white/58">Published jobs</p><p className="mt-2 text-3xl font-black">{publishedJobs.length}</p></div>
      </div>
    </main>
  );
}
