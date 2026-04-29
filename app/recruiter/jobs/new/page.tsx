import { ActionForm } from "@/components/action-form";
import { createJobAction } from "@/lib/actions";

export default function NewJobPage() {
  return (
    <main className="container grid gap-6 py-8">
      <h1 className="text-3xl font-bold">Post job</h1>
      <ActionForm action={createJobAction} className="card grid gap-4 p-6" submitLabel="Publish job">
        <label className="grid gap-2 text-sm font-semibold">Title<input className="field" name="title" required /></label>
        <label className="grid gap-2 text-sm font-semibold">Description<textarea className="field" name="description" required rows={5} /></label>
        <label className="grid gap-2 text-sm font-semibold">Required skills<input className="field" name="requiredSkills" placeholder="Python, SQL" required /></label>
        <label className="grid gap-2 text-sm font-semibold">Location<input className="field" name="location" /></label>
        <label className="grid gap-2 text-sm font-semibold">Job type<input className="field" name="jobType" placeholder="Internship, Full-time" /></label>
        <label className="grid gap-2 text-sm font-semibold">Salary range<input className="field" name="salaryRange" /></label>
        <label className="grid gap-2 text-sm font-semibold">Deadline<input className="field" name="deadline" type="date" required /></label>
        <label className="grid gap-2 text-sm font-semibold">Status<select className="field" name="status"><option value="published">Published</option><option value="draft">Draft</option><option value="closed">Closed</option></select></label>
      </ActionForm>
    </main>
  );
}
