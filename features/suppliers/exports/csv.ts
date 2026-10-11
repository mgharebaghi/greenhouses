import type { getSuppliers } from "@/features/suppliers/actions";

export type SupplierRawArray = Awaited<ReturnType<typeof getSuppliers>>;

export type SupplierFlattened = SupplierRawArray[number];

export async function suppliersCSVData(
  source?: SupplierRawArray,
): Promise<SupplierFlattened[]> {
  const data = source ?? [];
  return data.map((item) => ({ ...item }));
}

export const headers = [
  { displayLabel: "شناسه", key: "ID" },
  { displayLabel: "نوع (حقیقی/حقوقی)", key: "Legal" },
  { displayLabel: "نام شرکت", key: "CompanyName" },
  { displayLabel: "نام برند", key: "BrandName" },
  { displayLabel: "کشور", key: "SupplierCountry" },
  { displayLabel: "شهر", key: "SupplierCity" },
  { displayLabel: "نام", key: "FirstName" },
  { displayLabel: "نام خانوادگی", key: "LastName" },
  { displayLabel: "ایمیل", key: "ContactEmail" },
  { displayLabel: "تلفن", key: "ContactTel" },
  { displayLabel: "آدرس", key: "CompanyAddress" },
  { displayLabel: "شماره مجوز", key: "LicenseNumber" },
];
