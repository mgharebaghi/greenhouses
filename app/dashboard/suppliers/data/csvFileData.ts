import { getSuppliers } from "@/app/lib/services/suppliers";

export type SupplierRawArray = Awaited<ReturnType<typeof getSuppliers>>;

export type SupplierFlattened = SupplierRawArray[number];

export async function suppliersCSVData(source?: SupplierRawArray): Promise<SupplierFlattened[]> {
  const data = source ?? (await getSuppliers());
  return data.map((item) => ({ ...item }));
}

export const headers = [
  { displayLabel: "نام شرکت", key: "CompanyName" },
  { displayLabel: "آدرس", key: "CompanyAddress" },
  { displayLabel: "نام", key: "FirstName" },
  { displayLabel: "نام خانوادگی", key: "LastName" },
  { displayLabel: "تلفن", key: "ContactTel" },
  { displayLabel: "ایمیل", key: "ContactEmail" },
];
