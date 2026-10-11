"use server";
import { actionError } from "@/server/actions/errors";
import { requireSession } from "@/server/auth/require-session";
import { parseInput, recordIdSchema } from "@/shared/validation/input";

import { prisma } from "@/server/db/prisma";
import { revalidatePath } from "next/cache";

export async function deleteOrder(id: number) {
  try {
    await requireSession();
    parseInput(recordIdSchema, id);
    await prisma.tbl_Orders.delete({
      where: { ID: id },
    });

    revalidatePath("/dashboard/orders");
    return { status: "ok", message: "سفارش حذف شد" };
  } catch (error) {
    return actionError(error);
  }
}
