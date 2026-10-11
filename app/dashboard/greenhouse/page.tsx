import { getGreenhouses } from "@/features/greenhouses/actions";
import GreenHouses from "@/features/greenhouses/components/GreenhousesClientPage";
import type { GreenhouseRecord } from "@/features/greenhouses/types/record";

import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "اطلاعات گلخانه ها",
};

export default async function GreenHousesPage() {
  const initialData: GreenhouseRecord[] = await getGreenhouses();
  return <GreenHouses initialData={initialData} />;
}
