"use server";

import { prisma } from "@/app/lib/singletone";
import { SeedPackageInput } from "./types";
import { revalidatePath } from "next/cache";

export async function createSeedPackage(data: SeedPackageInput) {
    try {
        let qrBuffer: Buffer | undefined;

        if (data.QRCode && typeof data.QRCode === 'string') {
            // Remove data:image/...;base64, prefix if present
            const base64Data = data.QRCode.split(';base64,').pop();
            if (base64Data) {
                qrBuffer = Buffer.from(base64Data, 'base64');
            }
        }

        const seedPackage = await prisma.tbl_SeedPackage.create({
            data: {
                ProducerID: data.ProducerID,
                CropVariety: data.CropVariety,
                GerminationRate: data.GerminationRate,
                PurityPercent: data.PurityPercent,
                ProductionDate: data.ProductionDate ? new Date(data.ProductionDate) : undefined,
                ExpirationDate: data.ExpirationDate ? new Date(data.ExpirationDate) : undefined,
                QualityGrade: data.QualityGrade,
                SerialNumber: data.SerialNumber,
                PackageType: data.PackageType,
                SeedCount: data.SeedCount,
                WeightGram: data.WeightGram,
                PackagingDate: data.PackagingDate ? new Date(data.PackagingDate) : undefined,
                PackagingLine: data.PackagingLine,
                QRCode: qrBuffer as any,
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
