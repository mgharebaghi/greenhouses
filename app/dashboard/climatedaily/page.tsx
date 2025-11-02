import { getClimateData } from "@/app/lib/services/climatedaily";
import ClimateDailyDashboard from "./_components/main";

export default async function ClimateDailyPage() {
  const initialData = await getClimateData();
  return <ClimateDailyDashboard initialData={initialData} />;
}
