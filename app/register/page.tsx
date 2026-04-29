import Link from "next/link";
import { ActionForm } from "@/components/action-form";
import { registerAction } from "@/lib/actions";

export default function RegisterPage() {
  return (
    <main className="container grid min-h-screen place-items-center py-10">
      <div className="w-full max-w-xl">
        <Link href="/" className="mb-6 block text-lg font-bold">PlaceIQ</Link>
        <h1 className="mb-2 text-3xl font-bold">Create account</h1>
        <p className="mb-4 text-sm text-[#56615b]">Officer self-registration is enabled for demo use only.</p>
        <ActionForm action={registerAction} className="card grid gap-4 p-6" submitLabel="Create account">
          <label className="grid gap-2 text-sm font-semibold">Full name<input className="field" name="fullName" required /></label>
          <label className="grid gap-2 text-sm font-semibold">Email<input className="field" name="email" type="email" required /></label>
          <label className="grid gap-2 text-sm font-semibold">Password<input className="field" name="password" type="password" minLength={8} required /></label>
          <label className="grid gap-2 text-sm font-semibold">Role
            <select className="field" name="role" required>
              <option value="student">Student</option>
              <option value="recruiter">Recruiter</option>
              <option value="officer">Placement Officer</option>
            </select>
          </label>
          <label className="grid gap-2 text-sm font-semibold">Course/program<input className="field" name="course" /></label>
          <label className="grid gap-2 text-sm font-semibold">Company name<input className="field" name="companyName" /></label>
        </ActionForm>
      </div>
    </main>
  );
}
