"use server";

import { prisma } from "@/app/lib/singletone";
import { SeedPackageUpdateInput } from "./types";
import { revalidatePath } from "next/cache";

export async function updateSeedPackage(id: number, data: SeedPackageUpdateInput) {
    try {
        let qrBuffer: Buffer | undefined;

        if (data.QRCode && typeof data.QRCode === 'string') {
            // Check if it's a data URL or raw base64
            if (data.QRCode.startsWith('data:')) {
                const base64Data = data.QRCode.split(';base64,').pop();
                if (base64Data) {
                    qrBuffer = Buffer.from(base64Data, 'base64');
                }
            } else {
                // assume base64
                qrBuffer = Buffer.from(data.QRCode, 'base64');
            }
        }

        await prisma.tbl_SeedPackage.update({
            where: { ID: id },
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
                QRCode: qrBuffer as any, // If null or undefined, it might overwrite if not handled, but usually Prisma ignores undefined. If user wants to remove, they pass null. 
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
