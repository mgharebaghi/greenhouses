"use server";

import { prisma } from "@/app/lib/singletone";
import { SeedPackageCreateRes } from "./types";

export async function updateSeedPackage({ id, data }: { id: number; data: any }): Promise<SeedPackageCreateRes> {
    try {
        await prisma.seedPackage.update({
            where: { SeedPackageID: id },
            data: {
                SeedBatchID: data.SeedBatchID ? Number(data.SeedBatchID) : undefined,
                SerialNumber: data.SerialNumber,
                PackageType: data.PackageType,
                SeedCount: data.SeedCount ? Number(data.SeedCount) : undefined,
                WeightGram: data.WeightGram ? Number(data.WeightGram) : undefined,
                PackagingDate: data.PackagingDate ? new Date(data.PackagingDate) : undefined,
                PackagingLine: data.PackagingLine,
                Status: data.Status,
                IsCertified: data.IsCertified,
            },
        });
        return { status: "ok", message: "بسته بذر با موفقیت ویرایش شد" };
    } catch (error) {
        console.error("Error updating seed package:", error);
        return { status: "error", message: "خطا در ویرایش بسته بذر" };
    }
}
