import { RoleNav } from "@/components/nav";
import { requireUser } from "@/lib/session";

export default async function StudentLayout({ children }: { children: React.ReactNode }) {
  await requireUser("student");
  return <><RoleNav />{children}</>;
}
