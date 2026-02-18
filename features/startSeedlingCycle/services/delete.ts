"use server";

import { prisma } from "@/lib/singletone";
import { revalidatePath } from "next/cache";

export async function deleteStartSeedlingCycle(id: number) {
    try {
        await prisma.tbl_StartSeedlingCycle.delete({
            where: { ID: id }
        });
        revalidatePath("/dashboard/start-seedling-cycle");
        return { status: "ok", message: "رکورد با موفقیت حذف شد" };
    } catch (error: any) {
        console.error("Error deleting start seedling cycle:", error);
        return { status: "error", message: "خطا در حذف رکورد: " + error.message };
    }
}
