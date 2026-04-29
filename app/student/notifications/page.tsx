import { desc, eq } from "drizzle-orm";
import { Bell } from "lucide-react";
import { db } from "@/db";
import { notifications } from "@/db/schema";
import { markNotificationReadAction } from "@/lib/actions";
import { requireUser } from "@/lib/session";
import { formatDate } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function NotificationsPage() {
  const user = await requireUser("student");
  const rows = await db.select().from(notifications).where(eq(notifications.userId, user.id)).orderBy(desc(notifications.createdAt));
  return (
    <main className="container grid gap-6 py-8">
      <h1 className="flex items-center gap-3 text-3xl font-black"><Bell className="text-[#70f0c6]" />Notifications</h1>
      <div className="grid gap-3">
        {rows.map((note) => (
          <article className="card flex flex-wrap items-start justify-between gap-3 p-5" key={note.id}>
            <div><h2 className="font-black">{note.title}</h2><p className="text-sm text-white/72">{note.body}</p><p className="mt-1 text-xs text-white/48">{formatDate(note.createdAt)} · {note.readAt ? "Read" : "Unread"}</p></div>
            {!note.readAt ? <form action={markNotificationReadAction}><input name="id" type="hidden" value={note.id} /><button className="btn secondary">Mark read</button></form> : null}
          </article>
        ))}
      </div>
    </main>
  );
}
