"use server";
import { actionError } from "@/server/actions/errors";
import { requireSession } from "@/server/auth/require-session";
import { prisma } from "@/server/db/prisma";
import { parseInput, recordIdSchema } from "@/shared/validation/input";
import { revalidatePath } from "next/cache";

export async function deletePlant(id: number) {
  try {
    await requireSession();
    const recordId = parseInput(recordIdSchema, id);
    await prisma.tbl_Plants.delete({ where: { ID: recordId } });
    revalidatePath("/dashboard/plants");
    return { status: "ok" as const, message: "اطلاعات با موفقیت حذف شد." };
  } catch (error) {
    return actionError(error);
  }
}
