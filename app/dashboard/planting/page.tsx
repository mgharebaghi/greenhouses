import { getAllPlantings } from "@/app/lib/services/planting";
import PlantingDashboard from "./_components/Main";

export default async function Planting() {
  const initialData = await getAllPlantings();
  return <PlantingDashboard initialData={initialData} />;
}
