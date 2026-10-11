import type { SupplierRecord } from "@/features/suppliers/types/record";

export type SupplierDTO = SupplierRecord;
export type SupplierResponse =
  import("@/shared/contracts/action-result").ActionResult;

export type * from "./record";
