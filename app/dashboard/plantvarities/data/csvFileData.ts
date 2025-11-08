import { getPlantVarieties } from "@/app/lib/services/varities";
import type { PlantVarietyDTO } from "../page";

export type PlantVarietyRawArray = Awaited<ReturnType<typeof getPlantVarieties>>;
export type PlantVarietyFlattened = {
  VarietyName: string | null;
  CommonName: string;
  ScientificName: string;
  Family: string;
  SeedCompany: string | null;
  DaysToGermination: number | null;
  DaysToSprout: number | null;
  DaysToSeedling: number | null;
  DaysToMaturity: number | null;
  TypicalYieldKgPerM2: number | null;
  IdealTempMin: number | null;
  IdealTempMax: number | null;
  IdealHumidityMin: number | null;
  IdealHumidityMax: number | null;
  LightRequirement: string | null;
  GrowthCycleDays: number | null;
  Notes: string | null;
};

export async function plantVarietiesCSVData(source?: PlantVarietyRawArray): Promise<PlantVarietyFlattened[]> {
  const data = source ?? (await getPlantVarieties());
  return data.map((item) => ({
    VarietyName: item.VarietyName,
    CommonName: item.Plants?.CommonName ?? "",
    ScientificName: item.Plants?.ScientificName ?? "",
    Family: item.Plants?.Family ?? "",
    SeedCompany: item.SeedCompany,
    DaysToGermination: item.DaysToGermination,
    DaysToSprout: item.DaysToSprout,
    DaysToSeedling: item.DaysToSeedling,
    DaysToMaturity: item.DaysToMaturity,
    TypicalYieldKgPerM2: item.TypicalYieldKgPerM2,
    IdealTempMin: item.IdealTempMin,
    IdealTempMax: item.IdealTempMax,
    IdealHumidityMin: item.IdealHumidityMin,
    IdealHumidityMax: item.IdealHumidityMax,
    LightRequirement: item.LightRequirement,
    GrowthCycleDays: item.GrowthCycleDays,
    Notes: item.Notes,
  }));
}

export const headers = [
  { displayLabel: "نام گونه", key: "VarietyName" },
  { displayLabel: "نام رایج گیاه", key: "CommonName" },
  { displayLabel: "نام علمی گیاه", key: "ScientificName" },
  { displayLabel: "خانواده گیاه", key: "Family" },
  { displayLabel: "شرکت تولید کننده بذر", key: "SeedCompany" },
  { displayLabel: "تعداد روز تا جوانه‌زنی", key: "DaysToGermination" },
  { displayLabel: "تعداد روز تا سبز شدن", key: "DaysToSprout" },
  { displayLabel: "تعداد روز تا نهال", key: "DaysToSeedling" },
  { displayLabel: "تعداد روز تا بلوغ", key: "DaysToMaturity" },
  { displayLabel: "محصول معمولی (کیلوگرم/متر مربع)", key: "TypicalYieldKgPerM2" },
  { displayLabel: "حداقل دمای ایده‌آل", key: "IdealTempMin" },
  { displayLabel: "حداکثر دمای ایده‌آل", key: "IdealTempMax" },
  { displayLabel: "حداقل رطوبت ایده‌آل", key: "IdealHumidityMin" },
  { displayLabel: "حداکثر رطوبت ایده‌آل", key: "IdealHumidityMax" },
  { displayLabel: "نیاز نوری", key: "LightRequirement" },
  { displayLabel: "روزهای چرخه رشد", key: "GrowthCycleDays" },
  { displayLabel: "یادداشت‌ها", key: "Notes" },
];
