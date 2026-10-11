import { getPlants } from "@/features/plants/actions";
import PlantsDashboard from "@/features/plants/components/PlantsClientPage";

import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "اطلاعات پایه گیاهی",
};

export default async function PlantsPage() {
  const initialData = await getPlants();
  return <PlantsDashboard initialData={initialData} />;
}
