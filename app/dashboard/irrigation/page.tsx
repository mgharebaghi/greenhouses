import { getIrrigationEvents } from "@/app/lib/services/irrigation";
import IrrigationDashboard from "./_components/Main";

import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "آبیاری",
};

export default async function IrrigationDashboardPage() {
  const initialData = await getIrrigationEvents();
  return <IrrigationDashboard initialData={initialData} />;
}
