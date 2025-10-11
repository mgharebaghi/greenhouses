import { getPlants } from "@/app/lib/services/plants";
import PlantsDashboard from "./_components/Main";

export default async function PlantsPage() {
  const initialData = await getPlants();
  return <PlantsDashboard initialData={initialData} />;
}
