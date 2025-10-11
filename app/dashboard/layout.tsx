import { requireAuth } from "../lib/auth";
import DashboardShell from "./Shell";

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  await requireAuth("/dashboard");
  return <DashboardShell>{children}</DashboardShell>;
}
