"use server";
import { actionError } from "@/server/actions/errors";
import { requireSession } from "@/server/auth/require-session";
import { prisma } from "@/server/db/prisma";
import { parseInput, recordIdSchema } from "@/shared/validation/input";
import { revalidatePath } from "next/cache";
import { warehouseInputSchema } from "../schema";

export async function updateWarehouse(id: number, input: unknown) {
  try {
    await requireSession();
    const recordId = parseInput(recordIdSchema, id);
    const data = parseInput(warehouseInputSchema, input);
    await prisma.tbl_Warehouses.update({ where: { ID: recordId }, data });
    revalidatePath("/dashboard/warehouses");
    return { status: "ok" as const, message: "اطلاعات با موفقیت ویرایش شد." };
  } catch (error) {
    return actionError(error);
  }
}
