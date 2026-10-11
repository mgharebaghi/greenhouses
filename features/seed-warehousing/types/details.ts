import type { SeedPackageRecord } from "@/features/seed-packages/types/record";
import type { WarehouseRecord } from "@/features/warehouses/types/record";
import type { WarehouseTransactionRecord } from "./record";
export type WarehouseTransactionDetails = WarehouseTransactionRecord & {
  Tbl_SeedPackage: SeedPackageRecord | null;
  Tbl_Warehouses: WarehouseRecord | null;
};
