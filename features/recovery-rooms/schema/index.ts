import { optionalDate, recordIdSchema } from "@/shared/validation/input";
import { z } from "zod";

export const recoveryWorkerLossSchema = z.object({
  ID: recordIdSchema,
  LossPerWorker: z.number().int().min(0, "تلفات نمی‌تواند منفی باشد"),
});

export const recoveryRoomSchema = z.object({
  ID: z.number().optional(),
  GraftingOperationID: recordIdSchema,
  RecoveryEntryDate: optionalDate,
  RecoveryExitDate: optionalDate,
  GraftedLossCount: z.number().int().min(0).optional(),
  WorkersLoss: z.array(recoveryWorkerLossSchema).optional(),
});

export type RecoveryRoomInput = z.infer<typeof recoveryRoomSchema>;
