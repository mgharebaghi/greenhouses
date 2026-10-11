import SeedPackageClientPage from "@/features/seed-packages/components/SeedPackageClientPage";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "مدیریت بسته‌های بذر",
};

export default function SeedPackagePage() {
  return <SeedPackageClientPage />;
}
