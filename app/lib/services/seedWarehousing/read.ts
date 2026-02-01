"use server";

import { prisma } from "@/app/lib/singletone";

// Helper to serialize (BigInt/Decimal handling if needed, though int/string mostly here)
function serializeTransaction(trx: any) {
    if (!trx) return null;
    return JSON.parse(JSON.stringify(trx));
}

export async function getAllSeedWarehousing() {
    try {
        const transactions = await prisma.warehousesTransactions.findMany({
            include: {
                SeedPackage: {
                    include: {
                        // Include seed batch details to show crop variety etc if needed
                        SeedBatch: {
                            include: {
                                PlantVarities: true
                            }
                        }
                    }
                },
                Warehouses: true
            },
            orderBy: {
                TransactionID: "desc",
            },
        });
        return transactions.map(serializeTransaction);
    } catch (error) {
        console.error("Error fetching seed warehousing transactions:", error);
        return [];
    }
}

export async function getSeedWarehousingById(id: number) {
    try {
        const trx = await prisma.warehousesTransactions.findUnique({
            where: { TransactionID: id },
            include: {
                SeedPackage: true,
                Warehouses: true
            }
        });
        return serializeTransaction(trx);
    } catch (error) {
        console.error("Error fetching transaction by id:", error);
        return null;
    }
}
