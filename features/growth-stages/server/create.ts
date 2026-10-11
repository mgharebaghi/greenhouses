"use server";
import { actionError } from "@/server/actions/errors";
import { requireSession } from "@/server/auth/require-session";
import { prisma } from "@/server/db/prisma";
import { parseInput } from "@/shared/validation/input";
import { revalidatePath } from "next/cache";
import { growthStageInputSchema } from "../schema";

export async function createGrowthStage(input: unknown) {
  try {
    await requireSession();
    const data = parseInput(growthStageInputSchema, input);
    await prisma.tbl_PlantGrowthStage.create({ data });
    revalidatePath("/dashboard/growthstages");
    return { status: "ok" as const, message: "اطلاعات با موفقیت ثبت شد." };
  } catch (error) {
    return actionError(error);
  }
}
