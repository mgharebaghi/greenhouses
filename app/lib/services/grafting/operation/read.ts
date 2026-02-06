"use server";

import { prisma } from "@/app/lib/singletone";

export async function getAllGraftingOperations() {
    try {
        const operations = await prisma.graftingOperation.findMany({
            include: {
                NurserySeed: {
                    select: {
                        NurserySeedID: true,
                        SeedPackage: {
                            select: {
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
                        PlantVarities: {
                            select: { VarietyName: true }
                        }
                    }
                }
            },
            orderBy: { GraftingID: 'desc' }
        });

        // Serialize Decimals and Dates (simple JSON pass is okay for this demo content)
        return JSON.parse(JSON.stringify(operations));
    } catch (error) {
        console.error("Error fetching grafting operations:", error);
        return [];
    }
}

export async function getGraftingOptions() {
    // console.log("Starting getGraftingOptions...");

    try {
        // Executing sequentially to avoid connection pool exhaustion
        const seeds = await prisma.nurserySeed.findMany({
            take: 500, // Safe limit for dropdowns
            select: {
                NurserySeedID: true,
                SeedPackage: {
                    select: {
                        SeedBatch: {
                            select: {
                                PlantVarities: { select: { VarietyName: true } }
                            }
                        }
                    }
                }
            },
            orderBy: { NurserySeedID: 'desc' }
        });

        const rootstocks = await prisma.rootStockPlant.findMany({
            take: 500, // Safe limit for dropdowns
            select: {
                RootstockID: true,
                PlantVarities: { select: { VarietyName: true } }
            },
            orderBy: { RootstockID: 'desc' }
        });

        return {
            seeds: seeds.map(s => ({
                label: `کد ${s.NurserySeedID} - ${s.SeedPackage?.SeedBatch?.PlantVarities?.VarietyName || 'ناشناس'}`,
                value: s.NurserySeedID
            })),
            rootstocks: rootstocks.map(r => ({
                label: `کد ${r.RootstockID} - ${r.PlantVarities?.VarietyName || 'ناشناس'}`,
                value: r.RootstockID
            }))
        };

    } catch (error) {
        console.error("Error fetching grafting options:", error);
        return { seeds: [], rootstocks: [] };
    }
}
