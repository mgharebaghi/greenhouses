import { allGreenHouses } from "@/features/greenhouse/services";
import dayjs from "dayjs";
import jalaliday from "jalaliday";

dayjs.extend(jalaliday);

export type GreenhouseRawArray = Awaited<ReturnType<typeof allGreenHouses>>;

export type GreenhouseFlattened = {
  GreenhouseName: string | null;
  GreenhouseType: string | null;
  AreaSqM: number | null;
  ConstructionDate: string | null;
  Owner: string;
  GreenhouseAddress: string | null;
  IsActive: string;
  Notes: string | null;
};

export async function greenhousesCSVData(source?: GreenhouseRawArray): Promise<GreenhouseFlattened[]> {
  const data = source ?? (await allGreenHouses());
  return data.map((item: any) => ({
    GreenhouseName: item.GreenhouseName,
    GreenhouseType: item.GreenhouseType,
    AreaSqM: item.AreaSqM,
    ConstructionDate: item.ConstructionDate ? dayjs(item.ConstructionDate).calendar("jalali").format("YYYY/MM/DD") : null,
    Owner: item.Tbl_People ? `${item.Tbl_People.FirstName} ${item.Tbl_People.LastName}` : "",
    GreenhouseAddress: item.GreenhouseAddress,
    IsActive: item.IsActive ? "فعال" : "غیرفعال",
    Notes: item.Notes,
  }));
}

export const headers = [
  { displayLabel: "نام گلخانه", key: "GreenhouseName" },
  { displayLabel: "مالک", key: "Owner" },
  { displayLabel: "نوع سازه", key: "GreenhouseType" },
  { displayLabel: "متراژ (متر)", key: "AreaSqM" },
  { displayLabel: "تاریخ احداث", key: "ConstructionDate" },
  { displayLabel: "وضعیت", key: "IsActive" },
  { displayLabel: "آدرس", key: "GreenhouseAddress" },
  { displayLabel: "توضیحات", key: "Notes" },
];
