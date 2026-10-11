import type { PersonRecord } from "@/features/people/types/record";
import type { PlantVarietyRecord } from "@/features/plant-varieties/types/record";
import type { PlantRecord } from "@/features/plants/types/record";
import type { SeedPackageRecord } from "@/features/seed-packages/types/record";
import type { SupplierRecord } from "@/features/suppliers/types/record";
import type { OrderRecord } from "./record";

export type OrderPackageDetails = SeedPackageRecord & {
  Tbl_plantVariety:
    | (PlantVarietyRecord & {
        Tbl_Plants: Pick<PlantRecord, "CommonName"> | null;
      })
    | null;
  Tbl_suppliers: Pick<
    SupplierRecord,
    "CompanyName" | "FirstName" | "LastName" | "Legal"
  > | null;
};
export type OrderDetails = OrderRecord & {
  Tbl_People_Tbl_Orders_CustomerIDToTbl_People: Pick<
    PersonRecord,
    "FirstName" | "LastName" | "NationalCode"
  > | null;
  Tbl_People_Tbl_Orders_ProjectManagerToTbl_People: Pick<
    PersonRecord,
    "FirstName" | "LastName" | "NationalCode"
  > | null;
  Tbl_suppliers: Pick<
    SupplierRecord,
    "CompanyName" | "FirstName" | "LastName" | "Legal" | "LicenseNumber"
  > | null;
  Tbl_SeedPackage_Tbl_Orders_RootstockIDToTbl_SeedPackage: OrderPackageDetails | null;
  Tbl_SeedPackage_Tbl_Orders_ScionIDToTbl_SeedPackage: OrderPackageDetails | null;
};
