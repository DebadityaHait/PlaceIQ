import Link from "next/link";
import { UserPlus } from "lucide-react";
import { ActionForm } from "@/components/action-form";
import { registerAction } from "@/lib/actions";

export default function RegisterPage() {
  return (
    <main className="container grid min-h-screen place-items-center py-10">
      <div className="w-full max-w-2xl">
        <Link href="/" className="mb-6 flex items-center gap-2 text-lg font-black">
          <span className="grid h-10 w-10 place-items-center rounded-xl border border-white/20 bg-white/10 text-[#70f0c6]">IQ</span>
          PlaceIQ
        </Link>
        <div className="mb-5 flex items-center gap-3">
          <span className="grid h-12 w-12 place-items-center rounded-2xl bg-[#70f0c6]/14 text-[#70f0c6]"><UserPlus /></span>
          <div>
            <h1 className="text-4xl font-black">Create account</h1>
            <p className="text-sm text-white/56">Officer self-registration is enabled for demo use only.</p>
          </div>
        </div>
        <ActionForm action={registerAction} className="card grid gap-4 p-6" submitLabel="Create account">
          <div className="grid gap-4 md:grid-cols-2">
            <label className="grid gap-2 text-sm font-bold">Full name<input className="field" name="fullName" required /></label>
            <label className="grid gap-2 text-sm font-bold">Email<input className="field" name="email" type="email" required /></label>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            <label className="grid gap-2 text-sm font-bold">Password<input className="field" name="password" type="password" minLength={8} required /></label>
            <label className="grid gap-2 text-sm font-bold">Role
              <select className="field" name="role" required>
                <option value="student">Student</option>
                <option value="recruiter">Recruiter</option>
                <option value="officer">Placement Officer</option>
              </select>
            </label>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            <label className="grid gap-2 text-sm font-bold">Course/program<input className="field" name="course" /></label>
            <label className="grid gap-2 text-sm font-bold">Company name<input className="field" name="companyName" /></label>
          </div>
        </ActionForm>
      </div>
    </main>
  );
}
