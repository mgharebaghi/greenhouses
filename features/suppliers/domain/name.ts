import type { SupplierRecord } from "../types/record";

export function supplierName(
  supplier: Pick<
    SupplierRecord,
    "Legal" | "CompanyName" | "FirstName" | "LastName"
  >,
) {
  const personName = [supplier.FirstName, supplier.LastName]
    .filter(Boolean)
    .join(" ");
  return (
    (supplier.Legal === false
      ? personName || supplier.CompanyName
      : supplier.CompanyName || personName) || "—"
  );
}
