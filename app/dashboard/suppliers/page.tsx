// Removed legacy suppression: temporary resolution for module path
import { getSuppliers } from "@/features/suppliers/actions";
import SuppliersDashboard from "@/features/suppliers/components/SuppliersClientPage";
import type { SupplierDTO } from "@/features/suppliers/types/index";

import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "اطلاعات تامین کنندگان",
};

export default async function SuppliersPage() {
  const initialData: SupplierDTO[] = await getSuppliers();
  return <SuppliersDashboard initialData={initialData} />;
}
