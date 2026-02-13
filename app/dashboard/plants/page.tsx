import { getPlants } from "@/features/plants/services";
import PlantsDashboard from "@/features/plants/components/Main";

import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "اطلاعات پایه گیاهی",
};

export default async function PlantsPage() {
  const initialData = await getPlants();
  return <PlantsDashboard initialData={initialData} />;
}
