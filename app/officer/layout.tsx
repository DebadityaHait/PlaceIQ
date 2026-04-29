import { RoleNav } from "@/components/nav";
import { requireUser } from "@/lib/session";

export default async function OfficerLayout({ children }: { children: React.ReactNode }) {
  await requireUser("officer");
  return <><RoleNav />{children}</>;
}
