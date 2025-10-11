import { getPlantVarieties } from "@/app/lib/services/varities";
import PlantsVaritiesDashboard from "@/app/dashboard/plantvarities/_components/Main";

export type PlantVarietyDTO = {
  VarietyID: number;
  PlantID: number | null;
  VarietyName: string | null;
  SeedCompany: string | null;
  DaysToGermination: number | null;
  DaysToSprout: number | null;
  DaysToSeedling: number | null;
  DaysToMaturity: number | null;
  TypicalYieldKgPerM2: number | null; // ← Decimal → number
  IdealTempMin: number | null; // ← Decimal → number
  IdealTempMax: number | null; // ← Decimal → number
  IdealHumidityMin: number | null; // ← Decimal → number
  IdealHumidityMax: number | null; // ← Decimal → number
  LightRequirement: string | null;
  GrowthCycleDays: number | null;
  Notes: string | null;
  Plants: {
    PlantID: number;
    Notes: string | null;
    CommonName: string | null;
    ScientificName: string | null;
    Family: string | null;
  } | null;
};

export default async function PlantVaritiesPage() {
  const initialData: PlantVarietyDTO[] = await getPlantVarieties();
  return <PlantsVaritiesDashboard initialData={initialData} />;
}
