"use server";

import { prisma } from "@/lib/singletone";
import { OrderInput, OrderCreateRes } from "../types";
import { revalidatePath } from "next/cache";

export async function createOrder(data: OrderInput): Promise<OrderCreateRes> {
    try {
        const order = await prisma.tbl_Orders.create({
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
        return { status: "ok", message: "سفارش با موفقیت ثبت شد", orderId: order.ID };
    } catch (error: any) {
        console.error("Error creating order:", error);
        return { status: "error", message: "خطا در ثبت سفارش: " + error.message };
    }
}
