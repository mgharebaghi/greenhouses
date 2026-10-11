// Plain transport contracts. No ORM or framework dependencies.
export type SeedPlantingRecord = {
  ID: number;
  OrderID: number | null;
  GreenhouseID: number | null;
  SeedType: boolean | null;
  PlantingDate: Date | string | null;
  SeedPlantingNumber: number | null;
  TrayNumber: number | null;
  CellPerTrayNumber: number | null;
  CellHeight: number | null;
  TrayMaterial: string | null;
  PlantingBed: string | null;
  PlantingBedRatio: number | null;
  GerminationDate: Date | string | null;
  TechnicianID: number | null;
};
