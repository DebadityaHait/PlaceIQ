import { and, eq } from "drizzle-orm";
import Link from "next/link";
import { ClipboardList } from "lucide-react";
import { notFound } from "next/navigation";
import { db } from "@/db";
import { jobs, profiles } from "@/db/schema";
import { requireUser } from "@/lib/session";
import { formatDate } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function JobDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const user = await requireUser("recruiter");
  const { id } = await params;
  const [profile] = await db.select().from(profiles).where(eq(profiles.userId, user.id)).limit(1);
  const [job] = profile ? await db.select().from(jobs).where(and(eq(jobs.id, id), eq(jobs.recruiterId, profile.id))).limit(1) : [];
  if (!job) notFound();
  return (
    <main className="container grid gap-6 py-8">
      <div className="flex flex-wrap items-center justify-between gap-3"><h1 className="text-3xl font-black">{job.title}</h1><Link className="btn" href={`/recruiter/jobs/${job.id}/applications`}><ClipboardList size={18} /> View applicants</Link></div>
      <section className="card grid gap-3 p-5">
        <p><span className="badge">{job.status}</span></p>
        <p>{job.description}</p>
        <p><b>Required:</b> {(job.requiredSkills || []).join(", ")}</p>
        <p><b>Location:</b> {job.location || "Not set"}</p>
        <p><b>Deadline:</b> {formatDate(job.deadline)}</p>
      </section>
    </main>
  );
}
