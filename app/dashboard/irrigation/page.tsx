import { getIrrigationEvents } from "@/app/lib/services/irrigation";
import IrrigationDashboard from "./_components/Main";

export default async function IrrigationDashboardPage() {
  const initialData = await getIrrigationEvents();
  return <IrrigationDashboard initialData={initialData} />;
}
