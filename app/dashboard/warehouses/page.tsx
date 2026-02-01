import type { Metadata } from "next";
import WarehousesClientPage from "./_components/WarehousesClientPage";

export const metadata: Metadata = {
    title: "مدیریت انبارها",
};

export default function WarehousesPage() {
    return <WarehousesClientPage />;
}
