import {
  assertDateOrder,
  InputValidationError,
  parseInput,
} from "@/shared/validation/input";
import { recoveryRoomSchema } from "../schema";

export function prepareRecoveryInput(input: unknown) {
  const data = parseInput(recoveryRoomSchema.omit({ ID: true }), input);
  assertDateOrder(
    data.RecoveryEntryDate,
    data.RecoveryExitDate,
    "RecoveryExitDate",
  );
  const workers = data.WorkersLoss;
  if (
    workers &&
    new Set(workers.map((worker) => worker.ID)).size !== workers.length
  ) {
    throw new InputValidationError({
      WorkersLoss: ["هر کارگر فقط یک بار قابل ثبت است."],
    });
  }
  return {
    ...data,
    GraftedLossCount: workers
      ? workers.reduce((total, worker) => total + worker.LossPerWorker, 0)
      : data.GraftedLossCount,
  };
}

export function assertWorkersBelongToOperation(
  requestedIds: number[],
  actualIds: number[],
) {
  const members = new Set(actualIds);
  if (requestedIds.some((id) => !members.has(id))) {
    throw new InputValidationError({
      WorkersLoss: ["کارگر انتخاب‌شده به این عملیات پیوند تعلق ندارد."],
    });
  }
}
