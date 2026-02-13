// @ts-ignore temporary resolution for module path
import SuppliersDashboard from "@/features/suppliers/components/Main";
import { getSuppliers } from "@/features/suppliers/services";
import type { SupplierDTO } from "@/features/suppliers/types/types";

import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "اطلاعات تامین کنندگان",
};

export default async function SuppliersPage() {
  const initialData: SupplierDTO[] = await getSuppliers();
  return <SuppliersDashboard initialData={initialData} />;
}
