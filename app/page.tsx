import Image from "next/image";
import Link from "next/link";
import { ArrowRight, BadgeCheck, BrainCircuit, BriefcaseBusiness, ShieldCheck, Sparkles } from "lucide-react";

export default function Home() {
  return (
    <main className="min-h-screen overflow-hidden">
      <section className="relative min-h-screen">
        <Image
          src="/images/placeiq-hero.png"
          alt=""
          fill
          priority
          className="object-cover opacity-55"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#06100f] via-[#06100f]/82 to-[#06100f]/20" />
        <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-[#07110f] to-transparent" />

        <div className="container relative grid min-h-screen content-center gap-10 py-14">
          <nav className="absolute top-5 flex w-full items-center justify-between pr-8">
            <Link href="/" className="flex items-center gap-2 text-lg font-black">
              <span className="grid h-10 w-10 place-items-center rounded-xl border border-white/20 bg-white/10 text-[#70f0c6] backdrop-blur-xl">IQ</span>
              PlaceIQ
            </Link>
            <div className="flex gap-2">
              <Link className="btn secondary" href="/login">Sign in</Link>
              <Link className="btn" href="/register">Register</Link>
            </div>
          </nav>

          <div className="max-w-3xl pt-20">
            <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-2 text-sm font-bold text-[#dffff5] backdrop-blur-xl">
              <Sparkles size={16} /> AI-enabled campus recruitment
            </div>
            <h1 className="text-5xl font-black leading-tight text-white md:text-7xl">PlaceIQ</h1>
            <p className="mt-5 max-w-2xl text-xl leading-8 text-white/78">
              A slick operating system for university placements: verified student profiles, recruiter pipelines, resume intelligence, deterministic matches, and lifecycle notifications.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link className="btn" href="/login">Open portal <ArrowRight size={18} /></Link>
              <Link className="btn secondary" href="/register">Create demo account</Link>
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-4">
            {[
              [BrainCircuit, "Resume AI", "Gemini parsing with manual fallback"],
              [BadgeCheck, "Officer verified", "Human-controlled eligibility"],
              [BriefcaseBusiness, "Recruiter flow", "Jobs, applicants, status updates"],
              [ShieldCheck, "Server guarded", "Role-aware app workflows"]
            ].map(([Icon, title, body]) => (
              <div className="glass p-4" key={title as string}>
                <Icon className="mb-4 text-[#70f0c6]" size={24} />
                <h2 className="font-black">{title as string}</h2>
                <p className="mt-1 text-sm text-white/62">{body as string}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
