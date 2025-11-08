import { getAllPlantings } from "@/app/lib/services/planting";
import dayjs from "dayjs";
import jalaliday from "jalaliday";
dayjs.extend(jalaliday);

export type PlantingRawArray = Awaited<ReturnType<typeof getAllPlantings>>;
export type PlantingFlattened = {
  PlantingID: string;
  GreenhouseName: string;
  ZoneName: string;
  VarietyName: string;
  NumPlants: number | null;
  PlantsPerM2: number | null;
  PlantCountMeasured: number | null;
  PlantDate: string;
  TransplantDate: string;
  ExpectedHarvestDate: string;
  ActualHarvestDate: string;
  Supplier: string;
  SeedingMethod: string | null;
  Notes: string | null;
};

export async function plantingsCSVData(source?: PlantingRawArray): Promise<PlantingFlattened[]> {
  const data = source ?? (await getAllPlantings());
  return data.map((item: any) => ({
    PlantingID: String(item.PlantingID),
    GreenhouseName: item.GreenhouseName ?? "",
    ZoneName: item.Zones?.Name ?? "",
    VarietyName: item.PlantVarieties?.VarietyName ?? "",
    NumPlants: item.NumPlants,
    PlantsPerM2: item.PlantsPerM2 ? Number(item.PlantsPerM2) : null,
    PlantCountMeasured: item.PlantCountMeasured,
    PlantDate: item.PlantDate ? dayjs(item.PlantDate).calendar("jalali").locale("fa").format("YYYY/MM/DD") : "—",
    TransplantDate: item.TransplantDate
      ? dayjs(item.TransplantDate).calendar("jalali").locale("fa").format("YYYY/MM/DD")
      : "—",
    ExpectedHarvestDate: item.ExpectedHarvestDate
      ? dayjs(item.ExpectedHarvestDate).calendar("jalali").locale("fa").format("YYYY/MM/DD")
      : "—",
    ActualHarvestDate: item.ActualHarvestDate
      ? dayjs(item.ActualHarvestDate).calendar("jalali").locale("fa").format("YYYY/MM/DD")
      : "—",
    Supplier: item.Suppliers
      ? item.Suppliers.Legal
        ? item.Suppliers.CompanyName || ""
        : `${item.Suppliers.FirstName || ""} ${item.Suppliers.LastName || ""}`.trim()
      : "—",
    SeedingMethod: item.SeedingMethod,
    Notes: item.Notes,
  }));
}

export const headers = [
  { displayLabel: "شناسه کاشت", key: "PlantingID" },
  { displayLabel: "نام گلخانه", key: "GreenhouseName" },
  { displayLabel: "سالن", key: "ZoneName" },
  { displayLabel: "گونه گیاهی", key: "VarietyName" },
  { displayLabel: "تعداد گیاهان", key: "NumPlants" },
  { displayLabel: "تراکم بوته (گیاه/m²)", key: "PlantsPerM2" },
  { displayLabel: "تعداد شمارش‌شده", key: "PlantCountMeasured" },
  { displayLabel: "تاریخ کاشت", key: "PlantDate" },
  { displayLabel: "تاریخ نشاکاری", key: "TransplantDate" },
  { displayLabel: "برداشت مورد انتظار", key: "ExpectedHarvestDate" },
  { displayLabel: "برداشت واقعی", key: "ActualHarvestDate" },
  { displayLabel: "تامین کننده", key: "Supplier" },
  { displayLabel: "روش کاشت", key: "SeedingMethod" },
  { displayLabel: "یادداشت‌ها", key: "Notes" },
];
