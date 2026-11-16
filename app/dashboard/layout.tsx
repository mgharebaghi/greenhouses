import { requireAuth } from "@/server/auth/actions";
import { readServerTime } from "@/server/time/actions";
import { ServerClockProvider } from "@/shared/dates/ServerClock";
import DashboardShell from "./Shell";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  await requireAuth("/dashboard");
  return (
    <ServerClockProvider
      initialTime={Date.now()}
      readServerTime={readServerTime}
    >
      <DashboardShell>{children}</DashboardShell>
    </ServerClockProvider>
  );
}
