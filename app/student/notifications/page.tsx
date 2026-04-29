import { desc, eq } from "drizzle-orm";
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
      <h1 className="text-3xl font-bold">Notifications</h1>
      <div className="grid gap-3">
        {rows.map((note) => (
          <article className="card flex flex-wrap items-start justify-between gap-3 p-5" key={note.id}>
            <div><h2 className="font-bold">{note.title}</h2><p className="text-sm">{note.body}</p><p className="mt-1 text-xs text-[#66736c]">{formatDate(note.createdAt)} · {note.readAt ? "Read" : "Unread"}</p></div>
            {!note.readAt ? <form action={markNotificationReadAction}><input name="id" type="hidden" value={note.id} /><button className="btn secondary">Mark read</button></form> : null}
          </article>
        ))}
      </div>
    </main>
  );
}
