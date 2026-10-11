"use server";
import { actionError } from "@/server/actions/errors";
import { requireSession } from "@/server/auth/require-session";
import { prisma } from "@/server/db/prisma";
import { parseInput } from "@/shared/validation/input";
import { revalidatePath } from "next/cache";
import { varietyInputSchema } from "../schema";

export async function createPlantVariety(input: unknown) {
  try {
    await requireSession();
    const data = parseInput(varietyInputSchema, input);
    await prisma.tbl_PlantVariety.create({ data });
    revalidatePath("/dashboard/varities");
    return { status: "ok" as const, message: "اطلاعات با موفقیت ثبت شد." };
  } catch (error) {
    return actionError(error);
  }
}
