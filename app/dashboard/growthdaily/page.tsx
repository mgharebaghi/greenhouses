import { getGrowthDaily } from "@/app/lib/services/growthdaily";
import GrowthDailyDashboard from "./_components/Main";

import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "پایش رشد گیاه",
};

export default async function GrowthDaily() {
  const initialData = await getGrowthDaily();
  return <GrowthDailyDashboard initialData={initialData} />;
}
