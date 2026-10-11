"use server";
import { actionError } from "@/server/actions/errors";
import { requireSession } from "@/server/auth/require-session";
import { prisma } from "@/server/db/prisma";
import { parseInput, recordIdSchema } from "@/shared/validation/input";
import { revalidatePath } from "next/cache";
import { greenhouseInputSchema } from "../schema";

export async function updateGreenhouse(params: { id: number; data: unknown }) {
  try {
    await requireSession();
    const id = parseInput(recordIdSchema, params?.id);
    const data = parseInput(greenhouseInputSchema, params.data);

    const greenhouse = await prisma.tbl_Greenhouses.update({
      where: { ID: id },
      data: data,
    });
    revalidatePath("/dashboard/greenhouse");
    return {
      status: "ok" as const,
      message: "ویرایش با موفقیت انجام شد",
      greenHouseId: greenhouse.ID,
    };
  } catch (error) {
    return actionError(error);
  }
}
