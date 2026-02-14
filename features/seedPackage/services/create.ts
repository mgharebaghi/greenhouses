"use server";

import { prisma } from "@/lib/singletone";
import { SeedPackageInput } from "../types";
import { revalidatePath } from "next/cache";

export async function createSeedPackage(data: SeedPackageInput) {
    try {
        const seedPackage = await prisma.tbl_SeedPackage.create({
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
        return { status: "ok", message: "بسته بذر با موفقیت ثبت شد", seedPackageId: seedPackage.ID };
    } catch (error: any) {
        console.error("Error creating seed package:", error);
        return { status: "error", message: "خطا در ثبت بسته بذر: " + error.message };
    }
}
