import type { getPlants } from "@/features/plants/actions";
import type { PlantRecord } from "@/features/plants/types/record";

export type PlantRawArray = Awaited<ReturnType<typeof getPlants>>;
export type PlantFlattened = PlantRecord;

export async function plantsCSVData(
  source?: PlantRawArray,
): Promise<PlantFlattened[]> {
  const data = source ?? [];
  return data.map((item) => ({ ...item }));
}

export const headers = [
  { displayLabel: "نام رایج", key: "CommonName" },
  { displayLabel: "نام علمی", key: "ScientificName" },
  { displayLabel: "خانواده", key: "Family" },
  { displayLabel: "توضیحات", key: "Notes" },
];
