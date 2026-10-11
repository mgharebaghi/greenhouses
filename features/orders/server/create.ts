"use server";
import { actionError } from "@/server/actions/errors";
import { requireSession } from "@/server/auth/require-session";
import { parseInput } from "@/shared/validation/input";
import { orderInputSchema } from "../schema";

import { prisma } from "@/server/db/prisma";
import { revalidatePath } from "next/cache";
import { OrderCreateRes } from "../types";

export async function createOrder(input: unknown): Promise<OrderCreateRes> {
  try {
    await requireSession();
    const data = parseInput(orderInputSchema, input);
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
    return {
      status: "ok",
      message: "سفارش با موفقیت ثبت شد",
      orderId: order.ID,
    };
  } catch (error) {
    return actionError(error);
  }
}
