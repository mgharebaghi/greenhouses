import { requireAuth } from "@/server/auth/actions";
import DashboardShell from "./Shell";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  await requireAuth("/dashboard");
  return <DashboardShell>{children}</DashboardShell>;
}
