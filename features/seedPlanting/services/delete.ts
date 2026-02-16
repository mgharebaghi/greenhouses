"use server";

import { prisma } from "@/lib/singletone";
import { revalidatePath } from "next/cache";

export async function deleteSeedPlanting(id: number) {
    try {
        await prisma.tbl_SeedPlanting.delete({
            where: { ID: id },
        });

        revalidatePath("/dashboard/seed-planting");
        return { status: "ok", message: "حذف با موفقیت انجام شد" };
    } catch (error) {
        console.error("Error deleting seed planting:", error);
        return { status: "error", message: "خطا در حذف اطلاعات" };
    }
}
