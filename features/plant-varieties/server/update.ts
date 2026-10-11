"use server";
import { actionError } from "@/server/actions/errors";
import { requireSession } from "@/server/auth/require-session";
import { prisma } from "@/server/db/prisma";
import { parseInput, recordIdSchema } from "@/shared/validation/input";
import { revalidatePath } from "next/cache";
import { varietyInputSchema } from "../schema";

export async function updatePlantVariety(params: {
  id: number;
  data: unknown;
}) {
  try {
    await requireSession();
    const id = parseInput(recordIdSchema, params?.id);
    const data = parseInput(varietyInputSchema, params.data);
    await prisma.tbl_PlantVariety.update({ where: { ID: id }, data });
    revalidatePath("/dashboard/varities");
    return { status: "ok" as const, message: "اطلاعات با موفقیت ویرایش شد." };
  } catch (error) {
    return actionError(error);
  }
}
