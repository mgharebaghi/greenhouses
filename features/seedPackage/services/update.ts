"use server";

import { prisma } from "@/lib/singletone";
import { SeedPackageUpdateInput } from "../types";
import { revalidatePath } from "next/cache";

export async function updateSeedPackage(id: number, data: SeedPackageUpdateInput) {
    try {
        await prisma.tbl_SeedPackage.update({
            where: { ID: id },
            data: {
                SupplierID: data.SupplierID,
                ProducerCompany: data.ProducerCompany,
                CropVariety: data.CropVariety,
                GerminationRate: data.GerminationRate,
                PurityPercent: data.PurityPercent,
                PackageNumber: data.PackageNumber,
                ProductionDate: data.ProductionDate ? new Date(data.ProductionDate) : undefined,
                ExpirationDate: data.ExpirationDate ? new Date(data.ExpirationDate) : undefined,
                QualityGrade: data.QualityGrade,
                SerialNumber: data.SerialNumber,
                PackageType: data.PackageType,
                SeedCount: data.SeedCount,
                WeightGram: data.WeightGram,
                PackagingDate: data.PackagingDate ? new Date(data.PackagingDate) : undefined,
                IsCertified: data.IsCertified,
            },
        });

        revalidatePath("/dashboard/seed-package");
        return { status: "ok", message: "اطلاعات بسته بذر با موفقیت ویرایش شد" };
    } catch (error: any) {
        console.error("Error updating seed package:", error);
        return { status: "error", message: "خطا در ویرایش اطلاعات: " + error.message };
    }
}
