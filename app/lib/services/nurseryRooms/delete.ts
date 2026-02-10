"use server";

import { prisma } from "@/app/lib/singletone";
import { revalidatePath } from "next/cache";

export async function deleteNurseryRoom(id: number) {
    try {
        await prisma.tbl_NurseryRoom.delete({
            where: { ID: id },
        });

        revalidatePath("/dashboard/nursery-rooms");
        return { status: "ok", message: "اتاق نشاء با موفقیت حذف شد" };
    } catch (error: any) {
        console.error("Error deleting nursery room:", error);
        return { status: "error", message: "خطا در حذف اتاق نشاء: " + error.message };
    }
}
