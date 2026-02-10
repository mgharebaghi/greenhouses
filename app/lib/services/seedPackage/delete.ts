"use server";

import { prisma } from "@/app/lib/singletone";
import { revalidatePath } from "next/cache";

export async function deleteSeedPackage(id: number) {
    try {
        await prisma.tbl_SeedPackage.delete({
            where: { ID: id },
        });

        revalidatePath("/dashboard/seed-package");
        return { status: "ok", message: "بسته بذر با موفقیت حذف شد" };
    } catch (error: any) {
        console.error("Error deleting seed package:", error);
        return { status: "error", message: "خطا در حذف بسته بذر: " + error.message };
    }
}
