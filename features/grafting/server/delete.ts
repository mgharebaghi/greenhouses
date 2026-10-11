"use server";
import { actionError } from "@/server/actions/errors";
import { requireSession } from "@/server/auth/require-session";
import { parseInput, recordIdSchema } from "@/shared/validation/input";

import { prisma } from "@/server/db/prisma";
import { GraftingActionResponse } from "../types";

export async function deleteGraftingOperation(
  id: number,
): Promise<GraftingActionResponse> {
  try {
    await requireSession();
    parseInput(recordIdSchema, id);
    await prisma.$transaction(async (tx) => {
      // 1. Delete associated workers first
      await tx.tbl_GraftWorkers.deleteMany({
        where: { GraftingOperationID: id },
      });

      // 2. Delete the main record
      await tx.tbl_GraftingOperation.delete({
        where: { ID: id },
      });
    });

    return { status: "ok", message: "عملیات با موفقیت حذف شد" };
  } catch (error) {
    return actionError(error);
  }
}
