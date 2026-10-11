// Plain transport contracts. No ORM or framework dependencies.
export type SeedlingCycleRecord = {
  ID: number;
  OrderID: number | null;
  SeedType: boolean | null;
  GerminationRoomExitDate: Date | string | null;
  NumberOfLostSeedlingFromGermination: number | null;
  GreenhouseEntryDate: Date | string | null;
  NumberOfTrays: number | null;
  GreenhouseID: number | null;
  SalonName: string | null;
  GreenhouseExitDate: Date | string | null;
  NumberOfLostSeedlingFromGreenhouse: number | null;
};
