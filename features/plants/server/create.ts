"use server";
import { actionError } from "@/server/actions/errors";
import { requireSession } from "@/server/auth/require-session";
import { prisma } from "@/server/db/prisma";
import { parseInput } from "@/shared/validation/input";
import { revalidatePath } from "next/cache";
import { plantInputSchema } from "../schema";

export async function createPlant(input: unknown) {
  try {
    await requireSession();
    const data = parseInput(plantInputSchema, input);
    await prisma.tbl_Plants.create({ data });
    revalidatePath("/dashboard/plants");
    return { status: "ok" as const, message: "اطلاعات با موفقیت ثبت شد." };
  } catch (error) {
    return actionError(error);
  }
}
