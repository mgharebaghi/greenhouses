"use server";

import { prisma } from "@/app/lib/singletone";

export async function getAllGraftedSeedlings() {
    try {
        const items = await prisma.graftedPlant.findMany({
            include: {
                GraftingOperation: {
                    include: {
                        NurserySeed: {
                            select: {
                                NurserySeedID: true,
                                SeedPackage: {
                                    select: {
                                        SerialNumber: true,
                                        PackageType: true,
                                        Status: true,
                                        QRCode: true, // Needed for display
                                        SeedBatch: {
                                            select: {
                                                PlantVarities: {
                                                    select: { VarietyName: true }
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        },
                        RootStockPlant: {
                            select: {
                                RootstockID: true,
                                BatchCode: true,
                                ProductionDate: true,
                                HealthStatus: true,
                                GrowthStage: true,
                                StemDiameter: true,
                                PlantVarities: {
                                    select: { VarietyName: true }
                                },
                                Suppliers: {
                                    select: {
                                        CompanyName: true,
                                        FirstName: true,
                                        LastName: true
                                    }
                                }
                            }
                        }
                    }
                }
            },
            orderBy: { GraftedPlantID: 'desc' },
            take: 50 // Reduced to 50 to prevent connection timeout
        });

        // Serialization helper to convert Buffers to Base64 strings
        const serializedItems = items.map((item: any) => {
            const seedPackage = item.GraftingOperation?.NurserySeed?.SeedPackage;
            if (seedPackage?.QRCode) {
                // Explicitly handle QRCode (Buffer/Uint8Array)
                if (Buffer.isBuffer(seedPackage.QRCode) || seedPackage.QRCode instanceof Uint8Array || (seedPackage.QRCode.type === 'Buffer')) {
                    const bufferData = seedPackage.QRCode.data || seedPackage.QRCode;
                    seedPackage.QRCode = `data:image/png;base64,${Buffer.from(bufferData).toString('base64')}`;
                }
            }
            return item;
        });

        return JSON.parse(JSON.stringify(serializedItems));
    } catch (error) {
        console.error("Error fetching grafted seedlings:", error);
        return [];
    }
}

export async function getGraftingOperationOptions() {
    try {
        const ops = await prisma.graftingOperation.findMany({
            take: 100, // Reduced from 500 to 100
            select: {
                GraftingID: true,
                NurserySeed: {
                    select: {
                        SeedPackage: {
                            select: {
                                SeedBatch: {
                                    select: { PlantVarities: { select: { VarietyName: true } } }
                                }
                            }
                        }
                    }
                },
                RootStockPlant: {
                    select: {
                        PlantVarities: { select: { VarietyName: true } }
                    }
                }
            },
            orderBy: { GraftingID: 'desc' }
        });

        return ops.map(op => ({
            value: op.GraftingID,
            label: `کد ${op.GraftingID} - ${op.NurserySeed?.SeedPackage?.SeedBatch?.PlantVarities?.VarietyName || '؟'} روی ${op.RootStockPlant?.PlantVarities?.VarietyName || '؟'}`
        }));
    } catch (error) {
        console.error("Error fetching grafting operation options:", error);
        return [];
    }
}
