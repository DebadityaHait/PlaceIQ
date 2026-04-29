import { eq, desc } from "drizzle-orm";
import Link from "next/link";
import { Bell, CheckCircle2, ClipboardList, Sparkles, UserRound } from "lucide-react";
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
      <h1 className="text-3xl font-black">Student dashboard</h1>
      <div className="grid gap-4 md:grid-cols-3">
        <div className="card metric p-5"><CheckCircle2 className="mb-5 text-[#70f0c6]" /><p className="text-sm text-white/58">Verification</p><p className="mt-2 text-3xl font-black capitalize">{profile?.verificationStatus}</p></div>
        <div className="card metric p-5"><UserRound className="mb-5 text-[#55c7ff]" /><p className="text-sm text-white/58">Profile completion</p><p className="mt-2 text-3xl font-black">{completion}%</p></div>
        <div className="card metric p-5"><ClipboardList className="mb-5 text-[#ffd166]" /><p className="text-sm text-white/58">Applications</p><p className="mt-2 text-3xl font-black">{apps.length}</p></div>
      </div>
      <div className="card p-5">
        <div className="mb-3 flex items-center justify-between"><h2 className="flex items-center gap-2 text-xl font-black"><Bell size={20} /> Latest notifications</h2><Link className="text-sm font-bold text-[#70f0c6]" href="/student/notifications">View all</Link></div>
        <div className="grid gap-3">{notes.map((n) => <p key={n.id} className="text-sm"><b>{n.title}</b><br />{n.body}</p>)}</div>
      </div>
      <div className="flex gap-3"><Link className="btn" href="/student/profile">Complete profile</Link><Link className="btn secondary" href="/student/matches"><Sparkles size={18} /> View matches</Link></div>
    </main>
  );
}
