import { getAllPlantings } from "@/app/lib/services/planting";
import PlantingDashboard from "./_components/Main";

import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "اطلاعات کاشت",
};

export default async function Planting() {
  const initialData = await getAllPlantings();
  return <PlantingDashboard initialData={initialData} />;
}
