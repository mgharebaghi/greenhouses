import type { PlantVarietyRecord } from "@/features/plant-varieties/types/record";
import type { PlantRecord } from "@/features/plants/types/record";
import type { SupplierRecord } from "@/features/suppliers/types/record";
import type { SeedPackageRecord } from "./record";

export type SeedPackageDetails = SeedPackageRecord & {
  Tbl_suppliers: Pick<
    SupplierRecord,
    "CompanyName" | "FirstName" | "LastName" | "Legal"
  > | null;
  Tbl_plantVariety:
    | (Pick<PlantVarietyRecord, "VarietyName"> & {
        Tbl_Plants: Pick<PlantRecord, "CommonName"> | null;
      })
    | null;
};
