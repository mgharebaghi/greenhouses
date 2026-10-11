"use server";
import { actionError } from "@/server/actions/errors";
import { requireSession } from "@/server/auth/require-session";
import { prisma } from "@/server/db/prisma";
import { parseInput, recordIdSchema } from "@/shared/validation/input";
import { revalidatePath } from "next/cache";

export async function deleteGrowthStage(id: number) {
  try {
    await requireSession();
    const recordId = parseInput(recordIdSchema, id);
    await prisma.tbl_PlantGrowthStage.delete({ where: { ID: recordId } });
    revalidatePath("/dashboard/growthstages");
    return { status: "ok" as const, message: "اطلاعات با موفقیت حذف شد." };
  } catch (error) {
    return actionError(error);
  }
}
