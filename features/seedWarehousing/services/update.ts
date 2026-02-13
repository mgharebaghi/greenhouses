"use server";

import { prisma } from "@/lib/singletone";
import { revalidatePath } from "next/cache";

export async function updateSeedWarehousing(id: number, data: any) {
    try {
        const customDate = data.TransactionDate
            ? new Date(data.TransactionDate)
            : undefined;

        const updatedTrx = await prisma.tbl_WarehousesTransaction.update({
            where: { ID: id },
            data: {
                SeedPackageID: data.SeedPackageID ? Number(data.SeedPackageID) : undefined,
                WarehouseID: data.WarehouseID ? Number(data.WarehouseID) : undefined,
                TransactionType: data.TransactionType !== undefined ? (data.TransactionType === 'true' || data.TransactionType === true) : undefined,
                PackageQuantity: data.PackageQuantity ? Number(data.PackageQuantity) : undefined,
                TransactionDate: customDate,
                DestinationType: data.DestinationType,
                RecordedBy: data.RecordedBy,
            },
        });

        revalidatePath("/dashboard/seed-warehousing");
        return { success: true, data: updatedTrx };
    } catch (error) {
        console.error("Error updating seed warehousing transaction:", error);
        return { success: false, error: "Failed to update transaction" };
    }
}
