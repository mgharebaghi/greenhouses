"use server";

import { prisma } from "@/lib/singletone";
import { RecoveryRoomInput } from "../schema";

export async function createRecoveryRoom(input: RecoveryRoomInput) {
    try {
        const { GraftingOperationID, RecoveryEntryDate, RecoveryExitDate, GraftedLossCount, WorkersLoss } = input;

        const result = await prisma.$transaction(async (tx) => {
            const newRoom = await tx.tbl_RecoveryRoomPerOrder.create({
                data: {
                    GraftingOperationID,
                    RecoveryEntryDate,
                    RecoveryExitDate,
                    GraftedLossCount
                }
            });

            if (WorkersLoss && WorkersLoss.length > 0) {
                for (const worker of WorkersLoss) {
                    await tx.tbl_GraftWorkers.update({
                        where: { ID: worker.ID },
                        data: { LossPerWorker: worker.LossPerWorker }
                    });
                }
            }
            return newRoom;
        });

        return { status: "ok", data: result, message: "اتاق ریکاوری با موفقیت ثبت شد" };
    } catch (error) {
        console.error("Error creating recovery room:", error);
        return { status: "error", message: "خطا در ثبت اطلاعات" };
    }
}
