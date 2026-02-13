import { getPlantVarieties } from "@/features/varities/services";
import PlantsVaritiesDashboard from "@/features/varities/components/Main";
import type { PlantVarietyDTO } from "@/features/varities/types/types";

import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "اطلاعات گونه گیاهی",
};

export default async function PlantVaritiesPage() {
  const initialData: PlantVarietyDTO[] = await getPlantVarieties();
  return <PlantsVaritiesDashboard initialData={initialData} />;
}
