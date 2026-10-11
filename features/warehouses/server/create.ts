"use server";
import { actionError } from "@/server/actions/errors";
import { requireSession } from "@/server/auth/require-session";
import { prisma } from "@/server/db/prisma";
import { parseInput } from "@/shared/validation/input";
import { revalidatePath } from "next/cache";
import { warehouseInputSchema } from "../schema";

export async function createWarehouse(input: unknown) {
  try {
    await requireSession();
    const data = parseInput(warehouseInputSchema, input);
    await prisma.tbl_Warehouses.create({ data });
    revalidatePath("/dashboard/warehouses");
    return { status: "ok" as const, message: "اطلاعات با موفقیت ثبت شد." };
  } catch (error) {
    return actionError(error);
  }
}
