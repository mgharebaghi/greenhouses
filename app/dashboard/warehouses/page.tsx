import WarehousesClientPage from "@/features/warehouses/components/WarehousesClientPage";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "مدیریت انبارها",
};

export default function WarehousesPage() {
  return <WarehousesClientPage />;
}
