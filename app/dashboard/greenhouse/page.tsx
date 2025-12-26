import { allGreenHouses } from "@/app/lib/services/greenhouse";
import GreenHouses from "../greenhouse/_components/Main";
import { Greenhouses as GreenHouse } from "@/app/generated/prisma/client";

export default async function GreenHousesPage() {
  const initialData: GreenHouse[] = await allGreenHouses();
  // Artificial delay to test loading UI
  await new Promise((resolve) => setTimeout(resolve, 3000));
  return <GreenHouses initialData={initialData} />;
}
