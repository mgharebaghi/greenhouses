import { getClimateData } from "@/app/lib/services/climatedaily";
import ClimateDailyDashboard from "./_components/main";

import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "ثبت اطلاعات اقلیمی",
};

export default async function ClimateDailyPage() {
  const initialData = await getClimateData();
  return <ClimateDailyDashboard initialData={initialData} />;
}
