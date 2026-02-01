"use server";

import { prisma } from "@/app/lib/singletone";
import { revalidatePath } from "next/cache";

export async function deleteSeedWarehousing(id: number) {
    try {
        await prisma.warehousesTransactions.delete({
            where: { TransactionID: id },
        });

        revalidatePath("/dashboard/seed-warehousing");
        return { success: true };
    } catch (error) {
        console.error("Error deleting seed warehousing transaction:", error);
        return { success: false, error: "Failed to delete transaction" };
    }
}
