import type { Metadata } from "next";
import SeedPackageClientPage from "@/features/seedPackage/components/SeedPackageClientPage";

export const metadata: Metadata = {
    title: "مدیریت بسته‌بندی بذر",
};

export default function SeedPackagePage() {
    return <SeedPackageClientPage />;
}
