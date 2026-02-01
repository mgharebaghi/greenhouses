"use server";

import { prisma } from "@/app/lib/singletone";
import { SeedBatchCreateRes } from "./types";

export async function deleteSeedBatch(id: number): Promise<SeedBatchCreateRes> {
    try {
        await prisma.seedBatch.delete({
            where: { SeedBatchID: id },
        });
        return { status: "ok", message: "بذر با موفقیت حذف شد" };
    } catch (error) {
        console.error("Error deleting seed batch:", error);
        return { status: "error", message: "خطا در حذف بذر. ممکن است داده‌های وابسته وجود داشته باشد." };
    }
}
