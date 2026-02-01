"use server";

import { prisma } from "@/app/lib/singletone";
import { SeedPackageCreateRes } from "./types";
import QRCode from "qrcode";

export async function createSeedPackage(data: any): Promise<SeedPackageCreateRes> {
    try {
        // 1. Create the package first to get the ID
        const newPackage = await prisma.seedPackage.create({
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

        // 2. Generate QR Code
        // URL format: {APP_URL}/public/scan/seed-package/{ID}
        // Fallback to localhost if NEXT_PUBLIC_APP_URL is not set
        const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
        const qrUrl = `${baseUrl}/public/scan/seed-package/${newPackage.SeedPackageID}`;

        // Generate QR as Buffer (Bytes)
        const qrBuffer = await QRCode.toBuffer(qrUrl);

        // 3. Update the package with the QR code
        await prisma.seedPackage.update({
            where: { SeedPackageID: newPackage.SeedPackageID },
            data: {
                QRCode: qrBuffer as any,
            },
        });

        return { status: "ok", message: "بسته بذر با موفقیت ایجاد شد", seedPackageId: newPackage.SeedPackageID };
    } catch (error) {
        console.error("Error creating seed package:", error);
        return { status: "error", message: "خطا در ایجاد بسته بذر" };
    }
}
