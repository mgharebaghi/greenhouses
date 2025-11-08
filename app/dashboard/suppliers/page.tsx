// @ts-ignore temporary resolution for module path
import SuppliersDashboard from "./_components/Main";
import { getSuppliers } from "@/app/lib/services/suppliers";
import type { SupplierDTO } from "./types";

export default async function SuppliersPage() {
  const initialData: SupplierDTO[] = await getSuppliers();
  return <SuppliersDashboard initialData={initialData} />;
}
