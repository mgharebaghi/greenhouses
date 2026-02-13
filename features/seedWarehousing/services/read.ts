"use server";

import { prisma } from "@/lib/singletone";

// Helper to serialize (BigInt/Decimal handling if needed, though int/string mostly here)
function serializeTransaction(trx: any) {
    if (!trx) return null;
    return JSON.parse(JSON.stringify(trx));
}

export async function getAllSeedWarehousing() {
    try {
        const transactions = await prisma.tbl_WarehousesTransaction.findMany({
            include: {
                Tbl_SeedPackage: true,
                Tbl_Warehouses: true
            },
            orderBy: {
                ID: "desc",
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
        const trx = await prisma.tbl_WarehousesTransaction.findUnique({
            where: { ID: id },
            include: {
                Tbl_SeedPackage: true,
                Tbl_Warehouses: true
            }
        });
        return serializeTransaction(trx);
    } catch (error) {
        console.error("Error fetching transaction by id:", error);
        return null;
    }
}
