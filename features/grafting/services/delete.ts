"use server";

import { prisma } from "@/lib/singletone";
import { GraftingActionResponse } from "../types";

export async function deleteGraftingOperation(id: number): Promise<GraftingActionResponse> {
    try {
        await prisma.$transaction(async (tx) => {
            // 1. Delete associated workers first
            await tx.tbl_GraftWorkers.deleteMany({
                where: { GraftingOperationID: id },
            });

            // 2. Delete the main record
            await tx.tbl_GraftingOperation.delete({
                where: { ID: id },
            });
        });

        return { status: "ok", message: "عملیات با موفقیت حذف شد" };
    } catch (error) {
        console.error("Error deleting grafting operation:", error);
        return { status: "error", message: "خطا در حذف اطلاعات" };
    }
}
