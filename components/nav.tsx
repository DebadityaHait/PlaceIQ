import Link from "next/link";
import { getCurrentUser } from "@/lib/session";
import { SignOutButton } from "./sign-out";

const links = {
  student: [
    ["Dashboard", "/student/dashboard"],
    ["Profile", "/student/profile"],
    ["Jobs", "/student/jobs"],
    ["Matches", "/student/matches"],
    ["Applications", "/student/applications"],
    ["Notifications", "/student/notifications"]
  ],
  recruiter: [
    ["Dashboard", "/recruiter/dashboard"],
    ["Jobs", "/recruiter/jobs"],
    ["Post Job", "/recruiter/jobs/new"]
  ],
  officer: [
    ["Dashboard", "/officer/dashboard"],
    ["Pending", "/officer/pending-profiles"],
    ["Students", "/officer/students"],
    ["Jobs", "/officer/jobs"]
  ]
};

export async function RoleNav() {
  const user = await getCurrentUser();
  if (!user) return null;
  return (
    <nav className="border-b border-[#deded6] bg-white">
      <div className="container flex flex-wrap items-center gap-3 py-3">
        <Link href={`/${user.role}/dashboard`} className="mr-3 text-lg font-bold">PlaceIQ</Link>
        {links[user.role].map(([label, href]) => <Link key={href} href={href} className="text-sm font-semibold text-[#34514a]">{label}</Link>)}
        <div className="ml-auto"><SignOutButton /></div>
      </div>
    </nav>
  );
}
