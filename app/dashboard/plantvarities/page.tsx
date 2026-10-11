import { getPlantVarieties } from "@/features/plant-varieties/actions";
import PlantVarietiesClientPage from "@/features/plant-varieties/components/PlantVarietiesClientPage";
import type { PlantVarietyDTO } from "@/features/plant-varieties/types/index";

import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "اطلاعات واریته گیاهی",
};

export default async function PlantVaritiesPage() {
  const initialData: PlantVarietyDTO[] = await getPlantVarieties();
  return <PlantVarietiesClientPage initialData={initialData} />;
}
