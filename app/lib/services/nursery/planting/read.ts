"use server";

import { prisma } from "@/app/lib/singletone";

function serialize(obj: any) {
    return JSON.parse(JSON.stringify(obj, (key, value) => {
        if (typeof value === 'object' && value !== null && 's' in value && 'e' in value && 'd' in value) {
            return Number(value);
        }
        return value;
    }));
}

export async function getAllNurserySeeds() {
    try {
        const data = await prisma.nurserySeed.findMany({
            include: {
                SeedPackage: {
                    select: {
                        SeedPackageID: true,
                        SerialNumber: true,
                        PackageType: true,
                        Status: true,
                        QRCode: true,
                        SeedCount: true,
                        WeightGram: true,
                        PackagingDate: true,
                        IsCertified: true,
                        SeedBatch: {
                            select: {
                                BatchCode: true,
                                GerminationRate: true,
                                PurityPercent: true,
                                ProductionDate: true,
                                ExpirationDate: true,
                                PlantVarities: {
                                    select: {
                                        VarietyName: true,
                                        SeedCompany: true,
                                        DaysToGermination: true,
                                        DaysToMaturity: true,

                                    }
                                },
                                Suppliers: {
                                    select: {
                                        CompanyName: true,
                                        BrandName: true,
                                        SupplierCountry: true
                                    }
                                }
                            }
                        }
                    }
                },
                NurseryRoom: {
                    select: {
                        NurseryRoomID: true,
                        NurseryRoomName: true,
                        NurseryRoomCode: true,
                        LightType: true,
                        LightHoursPerDay: true,
                        TemperatureMin: true,
                        TemperatureMax: true,
                        HumidityMin: true,
                        HumidityMax: true,
                        CO2Range: true
                    }
                },
                LocationInNursaryRoom: {
                    select: {
                        TrayNumber: true,
                        CellNumber: true
                    }
                }
            },
            orderBy: { NurserySeedID: 'desc' }
        });

        // Process QRCode buffer
        const processed = data.map(item => {
            const plain = serialize(item);
            // Explicitly handle QRCode (Buffer/Uint8Array)
            if (item.SeedPackage?.QRCode && (Buffer.isBuffer(item.SeedPackage.QRCode) || item.SeedPackage.QRCode instanceof Uint8Array || ((item.SeedPackage.QRCode as any).type === 'Buffer'))) {
                const bufferData = (item.SeedPackage.QRCode as any).data || item.SeedPackage.QRCode;
                plain.SeedPackage.QRCode = `data:image/png;base64,${Buffer.from(bufferData).toString('base64')}`;
            }
            return plain;
        });

        return processed;
    } catch (error) {
        console.error("Error fetching nursery seeds:", error);
        return [];
    }
}

export async function getSeedPackagesOptions() {
    try {
        console.log("Fetching seed packages options...");
        const data = await prisma.seedPackage.findMany({
            // where: { Status: "Available" },  // Commented out to allow seeing all packages for now, especially in Edit mode
            include: {
                SeedBatch: {
                    include: { PlantVarities: true }
                }
            }
        });
        console.log(`Fetched ${data.length} seed packages.`);
        return data.map(pkg => {
            const plain = serialize(pkg);
            // Explicitly handle QRCode (Buffer/Uint8Array)
            if (pkg.QRCode && (Buffer.isBuffer(pkg.QRCode) || pkg.QRCode instanceof Uint8Array || ((pkg.QRCode as any).type === 'Buffer'))) {
                const bufferData = (pkg.QRCode as any).data || pkg.QRCode;
                plain.QRCode = `data:image/png;base64,${Buffer.from(bufferData).toString('base64')}`;
            }
            return plain;
        });
    } catch (error) {
        console.error("Error fetching seed packages options:", error);
        return [];
    }
}

export async function getNurseryRoomsOptions() {
    try {
        const data = await prisma.nurseryRoom.findMany();
        return data.map(serialize);
    } catch (error) {
        console.error("Error fetching nursery rooms options:", error);
        return [];
    }
}
