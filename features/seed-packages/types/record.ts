// Plain transport contracts. No ORM or framework dependencies.
export type SeedPackageRecord = {
  ID: number;
  SupplierID: number | null;
  ProducerCompany: string | null;
  CropVariety: number | null;
  GerminationRate: number | null;
  PurityPercent: number | null;
  PackageNumber: number | null;
  ProductionDate: Date | string | null;
  ExpirationDate: Date | string | null;
  QualityGrade: string | null;
  SerialNumber: string | null;
  PackageType: string | null;
  SeedCount: number | null;
  WeightGram: number | null;
  PackagingDate: Date | string | null;
  IsCertified: boolean | null;
};
