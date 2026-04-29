import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen bg-[#f7f7f4]">
      <section className="container grid min-h-screen content-center gap-8 py-12">
        <div className="max-w-3xl">
          <p className="mb-3 text-sm font-bold uppercase tracking-wide text-[#5d6f45]">University placement portal</p>
          <h1 className="text-5xl font-bold leading-tight text-[#17251f]">PlaceIQ</h1>
          <p className="mt-4 text-xl leading-8 text-[#44524c]">A full-stack recruitment workflow for students, recruiters, and placement officers with resume parsing, deterministic job matching, verification, applications, and notifications.</p>
        </div>
        <div className="flex flex-wrap gap-3">
          <Link className="btn" href="/login">Student Login</Link>
          <Link className="btn secondary" href="/login">Recruiter Login</Link>
          <Link className="btn secondary" href="/login">Officer Login</Link>
          <Link className="btn" href="/register">Register</Link>
        </div>
      </section>
    </main>
  );
}
