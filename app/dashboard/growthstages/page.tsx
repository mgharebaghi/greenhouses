import { getGrowthStages } from "@/app/lib/services/growthstages";
import GrowthStagesDashboard from "./_components/Main";

export default async function GrowthStagesPage() {
  const intitialData = await getGrowthStages();
  return <GrowthStagesDashboard initialData={intitialData} />;
}
