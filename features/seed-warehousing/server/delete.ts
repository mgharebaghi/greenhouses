"use server";
import { actionError } from "@/server/actions/errors";
import { requireSession } from "@/server/auth/require-session";
import { parseInput, recordIdSchema } from "@/shared/validation/input";

import { prisma } from "@/server/db/prisma";
import { revalidatePath } from "next/cache";

export async function deleteSeedWarehousing(id: number) {
  try {
    await requireSession();
    parseInput(recordIdSchema, id);
    await prisma.tbl_WarehousesTransaction.delete({
      where: { ID: id },
    });

    revalidatePath("/dashboard/seed-warehousing");
    return { status: "ok" as const, message: "عملیات با موفقیت انجام شد." };
  } catch (error) {
    console.error("Error deleting seed warehousing transaction:", error);
    return actionError(error);
  }
}
