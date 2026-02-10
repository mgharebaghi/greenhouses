import { getPlants } from "@/app/lib/services/plants";
import type { Tbl_Plants } from "@/app/generated/prisma";

export type PlantRawArray = Awaited<ReturnType<typeof getPlants>>;
export type PlantFlattened = Tbl_Plants;

export async function plantsCSVData(source?: PlantRawArray): Promise<PlantFlattened[]> {
  const data = source ?? (await getPlants());
  return data.map((item) => ({ ...item }));
}

export const headers = [
  { displayLabel: "نام رایج", key: "CommonName" },
  { displayLabel: "نام علمی", key: "ScientificName" },
  { displayLabel: "خانواده", key: "Family" },
  { displayLabel: "توضیحات", key: "Notes" },
];
