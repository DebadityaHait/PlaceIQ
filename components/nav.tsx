import Link from "next/link";
import { Bell, BriefcaseBusiness, Gauge, GraduationCap, ListChecks, PlusCircle, Sparkles, UserRoundCheck, UsersRound, Wand2, type LucideIcon } from "lucide-react";
import { getCurrentUser } from "@/lib/session";
import { SignOutButton } from "./sign-out";

type NavItem = [label: string, href: string, Icon: LucideIcon];

const links: Record<"student" | "recruiter" | "officer", NavItem[]> = {
  student: [
    ["Dashboard", "/student/dashboard", Gauge],
    ["Profile", "/student/profile", GraduationCap],
    ["Jobs", "/student/jobs", BriefcaseBusiness],
    ["Matches", "/student/matches", Sparkles],
    ["Tools", "/student/tools", Wand2],
    ["Applications", "/student/applications", ListChecks],
    ["Notifications", "/student/notifications", Bell]
  ],
  recruiter: [
    ["Dashboard", "/recruiter/dashboard", Gauge],
    ["Jobs", "/recruiter/jobs", BriefcaseBusiness],
    ["Post Job", "/recruiter/jobs/new", PlusCircle]
  ],
  officer: [
    ["Dashboard", "/officer/dashboard", Gauge],
    ["Pending", "/officer/pending-profiles", UserRoundCheck],
    ["Students", "/officer/students", UsersRound],
    ["Jobs", "/officer/jobs", BriefcaseBusiness]
  ]
};

export async function RoleNav() {
  const user = await getCurrentUser();
  if (!user) return null;
  return (
    <nav className="sticky top-0 z-50 border-b border-white/10 bg-[#06100f]/70 backdrop-blur-2xl">
      <div className="container flex flex-wrap items-center gap-3 py-3">
        <Link href={`/${user.role}/dashboard`} className="mr-3 flex items-center gap-2 text-lg font-black">
          <span className="grid h-9 w-9 place-items-center rounded-xl border border-white/15 bg-white/10 text-[#70f0c6]">IQ</span>
          PlaceIQ
        </Link>
        {links[user.role].map(([label, href, Icon]) => (
          <Link key={href} href={href} className="flex items-center gap-1.5 rounded-full px-3 py-2 text-sm font-bold text-white/74 transition hover:bg-white/10 hover:text-white">
            <Icon size={16} />{label}
          </Link>
        ))}
        <div className="ml-auto"><SignOutButton /></div>
      </div>
    </nav>
  );
}
