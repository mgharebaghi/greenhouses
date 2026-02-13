import type { Metadata } from "next";
import NurseryRoomsClientPage from "@/features/nurseryRooms/components/NurseryRoomsClientPage";

export const metadata: Metadata = {
    title: "مدیریت اتاق‌های نشاء",
};

export default function NurseryRoomsPage() {
    return <NurseryRoomsClientPage />;
}
