import { Suspense } from "react";
import Link from "next/link";
import { LogIn, Sparkles } from "lucide-react";
import { LoginForm } from "@/components/login-form";

export default function LoginPage() {
  return (
    <main className="container grid min-h-screen place-items-center py-10">
      <div className="grid w-full max-w-5xl gap-6 md:grid-cols-[0.9fr_1.1fr]">
        <section className="glass grid content-between gap-10 p-8">
          <Link href="/" className="flex items-center gap-2 text-lg font-black">
            <span className="grid h-10 w-10 place-items-center rounded-xl border border-white/20 bg-white/10 text-[#70f0c6]">IQ</span>
            PlaceIQ
          </Link>
          <div>
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-1.5 text-sm font-bold text-[#dffff5]">
              <Sparkles size={15} /> Secure role portal
            </div>
            <h1 className="text-4xl font-black">Welcome back</h1>
            <p className="mt-3 text-white/66">Jump into your student, recruiter, or placement officer workspace.</p>
          </div>
          <div className="grid grid-cols-3 gap-3 text-center text-xs font-bold text-white/62">
            <div className="panel p-3">Student</div>
            <div className="panel p-3">Recruiter</div>
            <div className="panel p-3">Officer</div>
          </div>
        </section>
        <section>
          <div className="mb-4 flex items-center gap-3">
            <span className="grid h-11 w-11 place-items-center rounded-2xl bg-[#70f0c6]/14 text-[#70f0c6]"><LogIn size={22} /></span>
            <div><h2 className="text-3xl font-black">Sign in</h2><p className="text-sm text-white/56">Use the seeded demo accounts or your own registration.</p></div>
          </div>
          <Suspense><LoginForm /></Suspense>
        </section>
      </div>
    </main>
  );
}
