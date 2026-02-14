"use server";

import { prisma } from "@/lib/singletone";
import { revalidatePath } from "next/cache";

export async function deleteOrder(id: number) {
    try {
        await prisma.tbl_Orders.delete({
            where: { ID: id },
        });

        revalidatePath("/dashboard/orders");
        return { status: "ok", message: "سفارش حذف شد" };
    } catch (error: any) {
        console.error("Error deleting order:", error);
        return { status: "error", message: "خطا در حذف سفارش: " + error.message };
    }
}
