import { getGrowthStages } from "@/app/lib/services/growthstages";
import GrowthStagesDashboard from "./_components/Main";

import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "مراحل رشد گیاه",
};

export default async function GrowthStagesPage() {
  const intitialData = await getGrowthStages();
  return <GrowthStagesDashboard initialData={intitialData} />;
}
