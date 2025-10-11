import { getGrowthDaily } from "@/app/lib/services/growthdaily";
import GrowthDailyDashboard from "./_components/Main";

export default async function GrowthDaily() {
  const initialData = await getGrowthDaily();
  return <GrowthDailyDashboard initialData={initialData} />;
}
