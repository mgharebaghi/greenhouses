import { getGrowthStages } from "@/features/growthstages/services";
import GrowthStagesDashboard from "@/features/growthstages/components/Main";

import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "مراحل رشد گیاه",
};

export default async function GrowthStagesPage() {
  const intitialData = await getGrowthStages();
  return <GrowthStagesDashboard initialData={intitialData} />;
}
