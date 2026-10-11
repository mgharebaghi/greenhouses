"use server";
import { actionError } from "@/server/actions/errors";
import { requireSession } from "@/server/auth/require-session";
import { prisma } from "@/server/db/prisma";
import { parseInput } from "@/shared/validation/input";
import { revalidatePath } from "next/cache";
import { supplierInputSchema } from "../schema";

export async function createSupplier(input: unknown) {
  try {
    await requireSession();
    const data = parseInput(supplierInputSchema, input);
    await prisma.tbl_Suppliers.create({ data });
    revalidatePath("/dashboard/suppliers");
    return { status: "ok" as const, message: "اطلاعات با موفقیت ثبت شد." };
  } catch (error) {
    return actionError(error);
  }
}
