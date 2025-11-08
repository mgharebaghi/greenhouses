import { getGrowthDaily } from "@/app/lib/services/growthdaily";
import dayjs from "dayjs";
import jalaliday from "jalaliday";
dayjs.extend(jalaliday);

export type GrowthDailyRawArray = Awaited<ReturnType<typeof getGrowthDaily>>;
export type GrowthDailyFlattened = {
  PlantingID: string;
  VarietyName: string;
  PlantCommonName: string;
  SampleSerialID: string;
  RecordDate: string;
  StageName: string;
  ObserverName: string;
  IsEstimated: string;
  HeightCm: number | null;
  LeafCount: number | null;
  FlowerCount: number | null;
  FruitCount: number | null;
  RootLength: number | null;
  Rootdiameter: number | null;
  HealthScore: number | null;
  PestObserved: string;
  Notes: string | null;
};

export async function growthDailyCSVData(source?: GrowthDailyRawArray): Promise<GrowthDailyFlattened[]> {
  const data = source ?? (await getGrowthDaily());
  return data.map((item: any) => ({
    PlantingID: String(item.PlantingSamples?.Plantings?.PlantingID ?? ""),
    VarietyName: item.PlantingSamples?.Plantings?.PlantVarieties?.VarietyName ?? "",
    PlantCommonName: item.PlantingSamples?.Plantings?.PlantVarieties?.Plants?.CommonName ?? "",
    SampleSerialID: item.PlantingSamples?.SerialID ?? "",
    RecordDate: item.RecordDate ? dayjs(item.RecordDate).calendar("jalali").locale("fa").format("YYYY/MM/DD") : "-",
    StageName: item.PlantGrowthStages?.StageName ?? "",
    ObserverName:
      item.Owner_Observer?.FullName ??
      `${item.Owner_Observer?.FirstName ?? ""} ${item.Owner_Observer?.LastName ?? ""}`.trim(),
    IsEstimated: item.IsEstimated ? "بله" : "خیر",
    HeightCm: item.HeightCm,
    LeafCount: item.LeafCount,
    FlowerCount: item.FlowerCount,
    FruitCount: item.FruitCount,
    RootLength: item.RootLength,
    Rootdiameter: item.Rootdiameter,
    HealthScore: item.HealthScore,
    PestObserved: item.PestObserved ? "بله" : "خیر",
    Notes: item.Notes,
  }));
}

export const headers = [
  { displayLabel: "شناسه کاشت", key: "PlantingID" },
  { displayLabel: "نام گونه", key: "VarietyName" },
  { displayLabel: "نام گیاه", key: "PlantCommonName" },
  { displayLabel: "شناسه نمونه", key: "SampleSerialID" },
  { displayLabel: "تاریخ ثبت", key: "RecordDate" },
  { displayLabel: "مرحله رشد", key: "StageName" },
  { displayLabel: "مشاهده کننده", key: "ObserverName" },
  { displayLabel: "تخمینی", key: "IsEstimated" },
  { displayLabel: "ارتفاع (سانتی‌متر)", key: "HeightCm" },
  { displayLabel: "تعداد برگ‌ها", key: "LeafCount" },
  { displayLabel: "تعداد گل‌ها", key: "FlowerCount" },
  { displayLabel: "تعداد میوه‌ها", key: "FruitCount" },
  { displayLabel: "طول ریشه", key: "RootLength" },
  { displayLabel: "قطر ریشه", key: "Rootdiameter" },
  { displayLabel: "امتیاز سلامت", key: "HealthScore" },
  { displayLabel: "مشاهده آفت", key: "PestObserved" },
  { displayLabel: "یادداشت‌ها", key: "Notes" },
];
