"use server";

import { prisma } from "@/app/lib/singletone";
import { revalidatePath } from "next/cache";

export async function deleteWarehouse(id: number) {
    try {
        // Check for dependencies if needed (e.g., Transactions)
        // For now, assuming simple delete or caught by FK constraint
        await prisma.tbl_Warehouses.delete({
            where: { ID: id },
        });

        revalidatePath("/dashboard/warehouses");
        return { status: "ok", message: "انبار با موفقیت حذف شد" };
    } catch (error: any) {
        console.error("Error deleting warehouse:", error);
        return { status: "error", message: "خطا در حذف انبار: " + error.message };
    }
}
