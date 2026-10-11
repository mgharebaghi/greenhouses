"use server";
import { actionError } from "@/server/actions/errors";
import { requireSession } from "@/server/auth/require-session";
import { prisma } from "@/server/db/prisma";
import { parseInput } from "@/shared/validation/input";
import { revalidatePath } from "next/cache";
import { greenhouseInputSchema } from "../schema";

export async function createGreenhouse(input: unknown) {
  try {
    await requireSession();

    const data = parseInput(greenhouseInputSchema, input);
    const existing = await prisma.tbl_Greenhouses.findFirst({
      where: { GreenhouseName: data.GreenhouseName },
    });
    if (existing)
      return {
        status: "error" as const,
        message: "گلخانه‌ای با این نام قبلا ثبت شده است!",
      };
    const greenhouse = await prisma.tbl_Greenhouses.create({
      data: { ...data, IsActive: data.IsActive ?? true },
    });
    revalidatePath("/dashboard/greenhouse");
    return {
      status: "ok" as const,
      message: "گلخانه جدید با موفقیت ایجاد شد!",
      greenHouseId: greenhouse.ID,
    };
  } catch (error) {
    return actionError(error);
  }
}
