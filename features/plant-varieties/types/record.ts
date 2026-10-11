// Plain transport contracts. No ORM or framework dependencies.
export type PlantVarietyRecord = {
  ID: number;
  PlantID: number | null;
  VarietyName: string | null;
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
