import type { SeedPackageRecord } from "@/features/seed-packages/types/record";
import type { WarehouseRecord } from "@/features/warehouses/types/record";
export interface SeedWarehousing {
  TransactionID: number;
  SeedPackageID: number | null;
  WarehouseID: number | null;
  TransactionType: boolean | null; // true for In, false for Out logic usually, or just distinguishing types. User might clarify.
  PackageQuantity: number | null;
  TransactionDate: Date | null;
  DestinationType: string | null;
  RecordedBy: string | null;

  // Relations
  SeedPackage?: SeedPackageRecord | null;
  Warehouses?: WarehouseRecord | null;
}

export type * from "./record";
