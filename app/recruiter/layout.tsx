import { RoleNav } from "@/components/nav";
import { requireUser } from "@/lib/session";

export default async function RecruiterLayout({ children }: { children: React.ReactNode }) {
  await requireUser("recruiter");
  return <><RoleNav />{children}</>;
}
