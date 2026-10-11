import NurseryRoomsClientPage from "@/features/nursery-rooms/components/NurseryRoomsClientPage";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "مدیریت اتاق‌های نشاء",
};

export default function NurseryRoomsPage() {
  return <NurseryRoomsClientPage />;
}
