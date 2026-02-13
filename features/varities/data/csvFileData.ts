import { getPlantVarieties } from "@/features/varities/services";
import type { PlantVarietyDTO } from "../types/types";

export type PlantVarietyRawArray = Awaited<ReturnType<typeof getPlantVarieties>>;
export type PlantVarietyFlattened = {
  VarietyName: string | null;
  CommonName: string;
  ScientificName: string;
  PlantFamily: string;
  DaysToGermination: number | null;
  DaysToSprout: number | null;
  DaysToSeedling: number | null;
  DaysToMaturity: number | null;
  IdealTempMin: number | null;
  IdealTempMax: number | null;
  IdealHumidityMin: number | null;
  IdealHumidityMax: number | null;
  LightRequirement: string | null;
  Notes: string | null;
};

export async function plantVarietiesCSVData(source?: PlantVarietyRawArray): Promise<PlantVarietyFlattened[]> {
  const data = source ?? (await getPlantVarieties());
  return data.map((item) => ({
    VarietyName: item.VarietyName,
    CommonName: item.Tbl_Plants?.CommonName ?? "",
    ScientificName: item.Tbl_Plants?.ScientificName ?? "",
    PlantFamily: item.Tbl_Plants?.PlantFamily ?? "",
    DaysToGermination: item.DaysToGermination,
    DaysToSprout: item.DaysToSprout,
    DaysToSeedling: item.DaysToSeedling,
    DaysToMaturity: item.DaysToMaturity,
    IdealTempMin: item.IdealTempMin,
    IdealTempMax: item.IdealTempMax,
    IdealHumidityMin: item.IdealHumidityMin,
    IdealHumidityMax: item.IdealHumidityMax,
    LightRequirement: item.LightRequirement,
    Notes: item.Notes,
  }));
}

export const headers = [
  { displayLabel: "نام گونه", key: "VarietyName" },
  { displayLabel: "نام رایج گیاه", key: "CommonName" },
  { displayLabel: "نام علمی گیاه", key: "ScientificName" },
  { displayLabel: "خانواده گیاه", key: "PlantFamily" },
  { displayLabel: "تعداد روز تا جوانه‌زنی", key: "DaysToGermination" },
  { displayLabel: "تعداد روز تا سبز شدن", key: "DaysToSprout" },
  { displayLabel: "تعداد روز تا نهال", key: "DaysToSeedling" },
  { displayLabel: "تعداد روز تا بلوغ", key: "DaysToMaturity" },
  { displayLabel: "حداقل دمای ایده‌آل", key: "IdealTempMin" },
  { displayLabel: "حداکثر دمای ایده‌آل", key: "IdealTempMax" },
  { displayLabel: "حداقل رطوبت ایده‌آل", key: "IdealHumidityMin" },
  { displayLabel: "حداکثر رطوبت ایده‌آل", key: "IdealHumidityMax" },
  { displayLabel: "نیاز نوری", key: "LightRequirement" },
  { displayLabel: "یادداشت‌ها", key: "Notes" },
];
