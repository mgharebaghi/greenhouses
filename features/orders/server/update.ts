"use server";
import { actionError } from "@/server/actions/errors";
import { requireSession } from "@/server/auth/require-session";
import { parseInput, recordIdSchema } from "@/shared/validation/input";
import { orderInputSchema } from "../schema";

import { prisma } from "@/server/db/prisma";
import { revalidatePath } from "next/cache";

export async function updateOrder(id: number, input: unknown) {
  try {
    await requireSession();
    const data = parseInput(orderInputSchema, input);
    parseInput(recordIdSchema, id);
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
  } catch (error) {
    return actionError(error);
  }
}
