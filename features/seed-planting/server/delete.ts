"use server";
import { actionError } from "@/server/actions/errors";
import { requireSession } from "@/server/auth/require-session";
import { parseInput, recordIdSchema } from "@/shared/validation/input";

import { prisma } from "@/server/db/prisma";
import { revalidatePath } from "next/cache";

export async function deleteSeedPlanting(id: number) {
  try {
    await requireSession();
    parseInput(recordIdSchema, id);
    await prisma.tbl_SeedPlanting.delete({
      where: { ID: id },
    });

    revalidatePath("/dashboard/seed-planting");
    return { status: "ok", message: "حذف با موفقیت انجام شد" };
  } catch (error) {
    return actionError(error);
  }
}
