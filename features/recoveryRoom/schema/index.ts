import { z } from "zod";

export const recoveryWorkerLossSchema = z.object({
    ID: z.number(), // ID of Tbl_GraftWorkers row to update
    LossPerWorker: z.number().min(0, "تلفات نمی‌تواند منفی باشد"),
});

export const recoveryRoomSchema = z.object({
    ID: z.number().optional(),
    GraftingOperationID: z.number().min(1, "انتخاب سفارش الزامی است"),
    RecoveryEntryDate: z.any().nullable(),
    RecoveryExitDate: z.any().nullable(),
    GraftedLossCount: z.number().min(0).optional(),
    WorkersLoss: z.array(recoveryWorkerLossSchema).optional(),
});

export type RecoveryRoomInput = z.infer<typeof recoveryRoomSchema>;
