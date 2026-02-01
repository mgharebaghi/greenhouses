"use server";

import { prisma } from "@/app/lib/singletone";

// Helper to serialize Prisma objects
function serializeSeedPackage(pkg: any) {
    const plain = JSON.parse(JSON.stringify(pkg, (key, value) => {
        // Handle Decimal (Prisma usually returns objects with s, e, d or just stringifies to string if not handled)
        if (typeof value === 'object' && value !== null && 's' in value && 'e' in value && 'd' in value) {
            return Number(value);
        }
        return value;
    }));

    // Explicitly handle QRCode (Buffer/Uint8Array)
    if (pkg.QRCode && (Buffer.isBuffer(pkg.QRCode) || pkg.QRCode instanceof Uint8Array || (pkg.QRCode.type === 'Buffer'))) {
        const bufferData = pkg.QRCode.data || pkg.QRCode;
        plain.QRCode = `data:image/png;base64,${Buffer.from(bufferData).toString('base64')}`;
    }

    return plain;
}

export async function getAllSeedPackages() {
    try {
        const seedPackages = await prisma.seedPackage.findMany({
            include: {
                SeedBatch: {
                    include: {
                        PlantVarities: true,
                        Suppliers: true
                    }
                }
            },
            orderBy: {
                SeedPackageID: "desc",
            },
        });

        return seedPackages.map(serializeSeedPackage);
    } catch (error) {
        console.error("Error fetching seed packages:", error);
        return [];
    }
}

export async function getSeedPackageById(id: number) {
    try {
        const pkg = await prisma.seedPackage.findUnique({
            where: { SeedPackageID: id },
            include: {
                SeedBatch: {
                    include: {
                        PlantVarities: true,
                        Suppliers: true
                    }
                }
            }
        });

        if (!pkg) return null;

        return serializeSeedPackage(pkg);
    } catch (error) {
        console.error("Error fetching seed package by id:", error);
        return null;
    }
}
