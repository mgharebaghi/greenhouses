"use server";

import { prisma } from "@/app/lib/singletone";

function serializeSeedPackage(pkg: any) {
    // If the database returns Buffer for QRCode, convert to base64 for frontend
    let qrCodeBase64 = null;
    if (pkg.QRCode && (Buffer.isBuffer(pkg.QRCode) || pkg.QRCode instanceof Uint8Array || (pkg.QRCode.type === 'Buffer'))) {
        const bufferData = pkg.QRCode.data || pkg.QRCode;
        qrCodeBase64 = `data:image/png;base64,${Buffer.from(bufferData).toString('base64')}`;
    }

    return {
        ...pkg,
        WeightGram: pkg.WeightGram ? Number(pkg.WeightGram) : null,
        QRCode: qrCodeBase64,
        // The dates are automatically handled by Next.js SC/CC boundary if they are simple iso strings on JSON.stringify,
        // but prisma returns Date objects. Next.js serialization should handle it fine, or use .toISOString() if needed.
    };
}

export async function getAllSeedPackages() {
    try {
        const seedPackages = await prisma.tbl_SeedPackage.findMany({
            include: {
                Tbl_suppliers: true,
            },
            orderBy: {
                ID: "desc",
            },
        });

        // We probably also want to fetch variety names to augment the data, 
        // since Tbl_SeedPackage only has CropVariety ID.
        // For simplicity, we can fetch all varieties and map them on the client,
        // or fetch them here. To keep it simple and performant, let's fetch varieties separately and map them here.
        const varieties = await prisma.tbl_plantVariety.findMany();
        const varietyMap = new Map(varieties.map(v => [v.ID, v.VarietyName]));

        return seedPackages.map(pkg => {
            const serialized = serializeSeedPackage(pkg);
            return {
                ...serialized,
                VarietyName: pkg.CropVariety ? varietyMap.get(pkg.CropVariety) : "نامشخص",
                ProducerName: pkg.Tbl_suppliers?.CompanyName || (pkg.Tbl_suppliers?.FirstName + " " + pkg.Tbl_suppliers?.LastName) || "نامشخص"
            };
        });
    } catch (error) {
        console.error("Error fetching seed packages:", error);
        return [];
    }
}

export async function getSeedPackageById(id: number) {
    try {
        const pkg = await prisma.tbl_SeedPackage.findUnique({
            where: { ID: id },
            include: {
                Tbl_suppliers: true
            }
        });

        if (!pkg) return null;

        let varietyName = "نامشخص";
        if (pkg.CropVariety) {
            const variety = await prisma.tbl_plantVariety.findUnique({ where: { ID: pkg.CropVariety } });
            if (variety) varietyName = variety.VarietyName || "نامشخص";
        }

        const serialized = serializeSeedPackage(pkg);
        return {
            ...serialized,
            VarietyName: varietyName,
            ProducerName: pkg.Tbl_suppliers?.CompanyName || (pkg.Tbl_suppliers?.FirstName + " " + pkg.Tbl_suppliers?.LastName) || "نامشخص"
        };
    } catch (error) {
        console.error("Error fetching seed package by id:", error);
        return null;
    }
}
