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

export async function getAllCareLogs() {
    try {
        const data = await prisma.nurseryCareLog.findMany({
            include: {
                NurserySeed: {
                    select: {
                        NurserySeedID: true,
                        CurrentStage: true,
                        SeedPackage: {
                            select: {
                                SerialNumber: true,
                                SeedBatch: {
                                    select: {
                                        BatchCode: true,
                                        PlantVarities: {
                                            select: {
                                                VarietyName: true
                                            }
                                        }
                                    }
                                }
                            }
                        },
                        NurseryRoom: {
                            select: {
                                NurseryRoomName: true,
                                NurseryRoomCode: true
                            }
                        }
                    }
                }
            },
            orderBy: { CareLogID: 'desc' }
        });
        return data.map(serialize);
    } catch (error) {
        console.error("Error fetching care logs:", error);
        return [];
    }
}

export async function getNurserySeedsForMonitoring() {
    try {
        // Fetch seeds that are currently active (not typically strictly required but good for UX)
        // For now, fetch all or latest 100 to avoid performance issues if list is huge
        const data = await prisma.nurserySeed.findMany({
            select: {
                NurserySeedID: true,
                CurrentStage: true,
                SeedPackage: {
                    select: {
                        SerialNumber: true,
                        SeedBatch: {
                            select: {
                                BatchCode: true,
                                PlantVarities: {
                                    select: {
                                        VarietyName: true
                                    }
                                }
                            }
                        }
                    }
                },
                NurseryRoom: {
                    select: {
                        NurseryRoomName: true
                    }
                }
            },
            orderBy: { NurserySeedID: 'desc' }
        });
        return data.map(serialize);
    } catch (error) {
        console.error("Error fetching nursery seeds options:", error);
        return [];
    }
}
