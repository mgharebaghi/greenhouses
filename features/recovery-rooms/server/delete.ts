"use server";
import { actionError } from "@/server/actions/errors";
import { requireSession } from "@/server/auth/require-session";
import { parseInput, recordIdSchema } from "@/shared/validation/input";

import { prisma } from "@/server/db/prisma";

export async function deleteRecoveryRoom(id: number) {
  try {
    await requireSession();
    parseInput(recordIdSchema, id);
    const room = await prisma.tbl_RecoveryRoomPerOrder.findUnique({
      where: { ID: id },
      select: { GraftingOperationID: true },
    });

    if (room && room.GraftingOperationID) {
      await prisma.$transaction(async (tx) => {
        await tx.tbl_GraftWorkers.updateMany({
          where: { GraftingOperationID: room.GraftingOperationID },
          data: { LossPerWorker: 0 },
        });

        await tx.tbl_RecoveryRoomPerOrder.delete({
          where: { ID: id },
        });
      });
    } else {
      await prisma.tbl_RecoveryRoomPerOrder.delete({
        where: { ID: id },
      });
    }

    return { status: "ok", message: "رکورد با موفقیت حذف شد" };
  } catch (error) {
    return actionError(error);
  }
}
