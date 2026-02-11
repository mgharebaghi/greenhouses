"use server";

import { prisma } from "@/app/lib/singletone";
import { revalidatePath } from "next/cache";

export async function createSeedWarehousing(data: any) {
    try {
        const customDate = data.TransactionDate
            ? new Date(data.TransactionDate)
            : new Date();

        const newTrx = await prisma.tbl_WarehousesTransaction.create({
            data: {
                SeedPackageID: Number(data.SeedPackageID),
                WarehouseID: Number(data.WarehouseID),
                TransactionType: data.TransactionType === 'true' || data.TransactionType === true, // Boolean handling
                PackageQuantity: Number(data.PackageQuantity),
                TransactionDate: customDate,
                DestinationType: data.DestinationType,
                RecordedBy: data.RecordedBy,
            },
        });

        revalidatePath("/dashboard/seed-warehousing");
        return { success: true, data: newTrx };
    } catch (error) {
        console.error("Error creating seed warehousing transaction:", error);
        return { success: false, error: "Failed to create transaction" };
    }
}
