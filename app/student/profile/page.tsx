import { eq } from "drizzle-orm";
import { FileText, GraduationCap } from "lucide-react";
import { ActionForm } from "@/components/action-form";
import { db } from "@/db";
import { profiles } from "@/db/schema";
import { updateStudentProfileAction } from "@/lib/actions";
import { requireUser } from "@/lib/session";

export const dynamic = "force-dynamic";

export default async function StudentProfilePage() {
  const user = await requireUser("student");
  const [profile] = await db.select().from(profiles).where(eq(profiles.userId, user.id)).limit(1);
  const parsed = profile?.resumeParsed as { fullTextSummary?: string } | null;
  return (
    <main className="container grid gap-6 py-8">
      <h1 className="flex items-center gap-3 text-3xl font-black"><GraduationCap className="text-[#70f0c6]" />Placement profile</h1>
      <ActionForm action={updateStudentProfileAction} className="card grid gap-4 p-6" submitLabel="Update profile">
        <label className="grid gap-2 text-sm font-semibold">Full name<input className="field" name="fullName" defaultValue={profile?.fullName} required /></label>
        <label className="grid gap-2 text-sm font-semibold">Date of birth<input className="field" name="dob" type="date" defaultValue={profile?.dob || ""} /></label>
        <label className="grid gap-2 text-sm font-semibold">Course<input className="field" name="course" defaultValue={profile?.course || ""} required /></label>
        <label className="grid gap-2 text-sm font-semibold">Graduation year<input className="field" name="graduationYear" type="number" defaultValue={profile?.graduationYear || new Date().getFullYear() + 1} required /></label>
        <label className="grid gap-2 text-sm font-semibold">Skills, comma-separated<input className="field" name="skills" defaultValue={(profile?.skills || []).join(", ")} /></label>
        <label className="grid gap-2 text-sm font-semibold">Resume PDF<input className="field" name="resume" type="file" accept="application/pdf" /></label>
      </ActionForm>
      <section className="card p-5">
        <h2 className="flex items-center gap-2 text-xl font-black"><FileText className="text-[#55c7ff]" />Resume parsing preview</h2>
        <p className="mt-2 text-sm text-white/62">{parsed?.fullTextSummary || "No parsed resume summary yet."}</p>
        <p className="mt-3 text-sm">Stored resume: {profile?.resumeFileName || "None"}</p>
      </section>
    </main>
  );
}
