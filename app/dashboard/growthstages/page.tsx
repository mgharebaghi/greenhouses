import { getGrowthStages } from "@/features/growth-stages/actions";
import GrowthStagesDashboard from "@/features/growth-stages/components/GrowthStagesClientPage";

import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "مراحل رشد گیاه",
};

export default async function GrowthStagesPage() {
  const intitialData = await getGrowthStages();
  return <GrowthStagesDashboard initialData={intitialData} />;
}
