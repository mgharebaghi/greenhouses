"use server";

import { prisma } from "@/lib/singletone";
import { OrderInput } from "../schema";
import { revalidatePath } from "next/cache";

export async function updateOrder(id: number, data: OrderInput) {
    try {
        await prisma.tbl_Orders.update({
            where: { ID: id },
            data: {
                OrderCode: data.OrderCode,
                CustomerID: data.CustomerID,
                SupplierID: data.SupplierID,
                ProjectManager: data.ProjectManager,
                OrderDate: data.OrderDate ? new Date(data.OrderDate) : undefined,
                OrderCount: data.OrderCount,
                RootstockID: data.RootstockID,
                ScionID: data.ScionID,
            },
        });

        revalidatePath("/dashboard/orders");
        return { status: "ok", message: "سفارش با موفقیت ویرایش شد" };
    } catch (error: any) {
        console.error("Error updating order:", error);
        return { status: "error", message: "خطا در ویرایش سفارش: " + error.message };
    }
}
