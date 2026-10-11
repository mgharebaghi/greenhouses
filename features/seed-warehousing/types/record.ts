// Plain transport contracts. No ORM or framework dependencies.
export type WarehouseTransactionRecord = {
  ID: number;
  SeedPackageID: number | null;
  WarehouseID: number | null;
  TransactionType: boolean | null;
  PackageQuantity: number | null;
  TransactionDate: Date | string | null;
  DestinationType: string | null;
  RecordedBy: string | null;
};
