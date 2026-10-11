"use server";
import { actionError } from "@/server/actions/errors";
import { requireSession } from "@/server/auth/require-session";
import { prisma } from "@/server/db/prisma";
import { parseInput, recordIdSchema } from "@/shared/validation/input";
import { revalidatePath } from "next/cache";
import { plantInputSchema } from "../schema";

export async function updatePlant(params: { id: number; data: unknown }) {
  try {
    await requireSession();
    const id = parseInput(recordIdSchema, params?.id);
    const data = parseInput(plantInputSchema, params.data);
    await prisma.tbl_Plants.update({ where: { ID: id }, data });
    revalidatePath("/dashboard/plants");
    return { status: "ok" as const, message: "اطلاعات با موفقیت ویرایش شد." };
  } catch (error) {
    return actionError(error);
  }
}
