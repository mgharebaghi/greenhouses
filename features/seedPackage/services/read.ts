"use server";

import { Tbl_SeedPackage } from "@/app/generated/prisma";
import { prisma } from "@/lib/singletone";

function serializeSeedPackage(pkg: any) {
    return {
        ...pkg,
        WeightGram: pkg.WeightGram ? Number(pkg.WeightGram) : null,
        // The dates are automatically handled by Next.js SC/CC boundary if they are simple iso strings on JSON.stringify,
        // but prisma returns Date objects. Next.js serialization should handle it fine, or use .toISOString() if needed.
    };
}

export async function getAllSeedPackages(): Promise<Tbl_SeedPackage[]> {
    try {
        const seedPackages = await prisma.tbl_SeedPackage.findMany({
            include: {
                Tbl_suppliers: {
                    select: {
                        CompanyName: true,
                        FirstName: true,
                        LastName: true,
                        Legal: true
                    },
                },
                Tbl_plantVariety: {
                    select: {
                        VarietyName: true,
                        Tbl_Plants: {
                            select: {
                                CommonName: true
                            }
                        }
                    }
                }
            },
            orderBy: {
                ID: "desc",
            },
        });

        return seedPackages.map(serializeSeedPackage);
    } catch (error) {
        console.error("Error fetching seed packages:", error);
        return [];
    }
}

export async function getSeedPackageById(id: number): Promise<Tbl_SeedPackage | null> {
    try {
        const pkg = await prisma.tbl_SeedPackage.findUnique({
            where: { ID: id },
            include: {
                Tbl_suppliers: {
                    select: {
                        CompanyName: true,
                        FirstName: true,
                        LastName: true,
                        Legal: true
                    }
                },
                Tbl_plantVariety: {
                    select: {
                        VarietyName: true,
                        Tbl_Plants: {
                            select: {
                                CommonName: true
                            }
                        }
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
