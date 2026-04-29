import { and, eq } from "drizzle-orm";
import { UserRoundCheck } from "lucide-react";
import { ActionForm } from "@/components/action-form";
import { db } from "@/db";
import { profiles } from "@/db/schema";
import { verifyProfileAction } from "@/lib/actions";
import { requireUser } from "@/lib/session";

export const dynamic = "force-dynamic";

export default async function PendingProfilesPage() {
  await requireUser("officer");
  const rows = await db.select().from(profiles).where(and(eq(profiles.role, "student"), eq(profiles.verificationStatus, "pending")));
  return (
    <main className="container grid gap-6 py-8">
      <h1 className="flex items-center gap-3 text-3xl font-black"><UserRoundCheck className="text-[#70f0c6]" />Pending profiles</h1>
      <div className="grid gap-4">
        {rows.map((student) => {
          const parsed = student.resumeParsed as { fullTextSummary?: string } | null;
          return (
            <article className="card grid gap-3 p-5" key={student.id}>
              <div><h2 className="text-xl font-black">{student.fullName}</h2><p className="text-sm text-white/58">{student.email} · {student.course}</p></div>
              <p className="text-sm"><b>Skills:</b> {(student.skills || []).join(", ") || "None"}</p>
              <p className="text-sm"><b>Parsed summary:</b> {parsed?.fullTextSummary || "No parsed summary"}</p>
              <div className="grid gap-3 md:grid-cols-2">
                <ActionForm action={verifyProfileAction} submitLabel="Mark verified" className="grid gap-3">
                  <input name="profileId" type="hidden" value={student.id} />
                  <input name="action" type="hidden" value="verified" />
                </ActionForm>
                <ActionForm action={verifyProfileAction} submitLabel="Reject profile" className="grid gap-3">
                  <input name="profileId" type="hidden" value={student.id} />
                  <input name="action" type="hidden" value="rejected" />
                  <input className="field" name="rejectionReason" placeholder="Rejection reason" />
                </ActionForm>
              </div>
            </article>
          );
        })}
        {rows.length === 0 ? <div className="card p-5 text-sm">No pending profiles.</div> : null}
      </div>
    </main>
  );
}
