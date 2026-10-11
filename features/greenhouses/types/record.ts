// Plain transport contracts. No ORM or framework dependencies.
export type GreenhouseRecord = {
  ID: number;
  OwnerID: number | null;
  GreenhouseName: string | null;
  GreenhouseType: string | null;
  AreaSqM: number | null;
  ConstructionDate: Date | string | null;
  GreenhouseAddress: string | null;
  IsActive: boolean | null;
  Notes: string | null;
};
