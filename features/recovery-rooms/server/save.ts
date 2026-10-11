import { serializableTransaction } from "@/server/db/transaction";
import {
  InputValidationError,
  parseInput,
  recordIdSchema,
} from "@/shared/validation/input";
import "server-only";
import {
  assertWorkersBelongToOperation,
  prepareRecoveryInput,
} from "../domain/input";

export async function saveRecoveryRoom(input: unknown, id?: number) {
  const data = prepareRecoveryInput(input);
  if (id !== undefined) parseInput(recordIdSchema, id);
  const { WorkersLoss, ...roomData } = data;
  return serializableTransaction(async (tx) => {
    const existing = await tx.tbl_RecoveryRoomPerOrder.findFirst({
      where: {
        GraftingOperationID: data.GraftingOperationID,
        ...(id ? { ID: { not: id } } : {}),
      },
      select: { ID: true },
    });
    if (existing)
      throw new InputValidationError({
        GraftingOperationID: ["برای این عملیات، ریکاوری قبلاً ثبت شده است."],
      });
    if (WorkersLoss?.length) {
      const members = await tx.tbl_GraftWorkers.findMany({
        where: { GraftingOperationID: data.GraftingOperationID },
        select: { ID: true },
      });
      assertWorkersBelongToOperation(
        WorkersLoss.map((worker) => worker.ID),
        members.map((worker) => worker.ID),
      );
    }
    const room =
      id === undefined
        ? await tx.tbl_RecoveryRoomPerOrder.create({ data: roomData })
        : await tx.tbl_RecoveryRoomPerOrder.update({
            where: { ID: id },
            data: roomData,
          });
    for (const worker of WorkersLoss ?? []) {
      await tx.tbl_GraftWorkers.update({
        where: { ID: worker.ID },
        data: { LossPerWorker: worker.LossPerWorker },
      });
    }
    return room;
  });
}
