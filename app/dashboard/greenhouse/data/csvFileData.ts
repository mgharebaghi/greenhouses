import { allGreenHouses } from "@/app/lib/services/greenhouse";

export type GreenhouseRawArray = Awaited<ReturnType<typeof allGreenHouses>>;
export type GreenhouseFlattened = {
  GreenhouseName: string | null;
  Address: string | null;
  Owner: string;
  ZonesCount: number;
  Notes: string | null;
};

export async function greenhousesCSVData(source?: GreenhouseRawArray): Promise<GreenhouseFlattened[]> {
  const data = source ?? (await allGreenHouses());
  return data.map((item: any) => ({
    GreenhouseName: item.GreenhouseName,
    Address: item.Address,
    Owner: `${item.Owner_Observer?.FirstName ?? ""} ${item.Owner_Observer?.LastName ?? ""}`.trim(),
    ZonesCount: item.Zones?.length ?? 0,
    Notes: item.Notes,
  }));
}

export const headers = [
  { displayLabel: "نام گلخانه", key: "GreenhouseName" },
  { displayLabel: "آدرس", key: "Address" },
  { displayLabel: "مالک گلخانه", key: "Owner" },
  { displayLabel: "تعداد سالن ها", key: "ZonesCount" },
  { displayLabel: "یادداشت", key: "Notes" },
];
