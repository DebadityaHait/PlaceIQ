import { eq, desc } from "drizzle-orm";
import Link from "next/link";
import { db } from "@/db";
import { applications, notifications, profiles } from "@/db/schema";
import { requireUser } from "@/lib/session";

export const dynamic = "force-dynamic";

export default async function StudentDashboard() {
  const user = await requireUser("student");
  const [profile] = await db.select().from(profiles).where(eq(profiles.userId, user.id)).limit(1);
  const apps = profile ? await db.select().from(applications).where(eq(applications.studentId, profile.id)) : [];
  const notes = await db.select().from(notifications).where(eq(notifications.userId, user.id)).orderBy(desc(notifications.createdAt)).limit(4);
  const completion = profile?.course && profile.skills?.length ? 80 : 35;

  return (
    <main className="container grid gap-6 py-8">
      <h1 className="text-3xl font-bold">Student dashboard</h1>
      <div className="grid gap-4 md:grid-cols-3">
        <div className="card p-5"><p className="text-sm text-[#66736c]">Verification</p><p className="mt-2 text-2xl font-bold capitalize">{profile?.verificationStatus}</p></div>
        <div className="card p-5"><p className="text-sm text-[#66736c]">Profile completion</p><p className="mt-2 text-2xl font-bold">{completion}%</p></div>
        <div className="card p-5"><p className="text-sm text-[#66736c]">Applications</p><p className="mt-2 text-2xl font-bold">{apps.length}</p></div>
      </div>
      <div className="card p-5">
        <div className="mb-3 flex items-center justify-between"><h2 className="text-xl font-bold">Latest notifications</h2><Link className="text-sm font-semibold" href="/student/notifications">View all</Link></div>
        <div className="grid gap-3">{notes.map((n) => <p key={n.id} className="text-sm"><b>{n.title}</b><br />{n.body}</p>)}</div>
      </div>
      <div className="flex gap-3"><Link className="btn" href="/student/profile">Complete profile</Link><Link className="btn secondary" href="/student/matches">View matches</Link></div>
    </main>
  );
}
