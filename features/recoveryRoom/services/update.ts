"use server";

import { prisma } from "@/lib/singletone";
import { RecoveryRoomInput } from "../schema";

export async function updateRecoveryRoom(id: number, input: RecoveryRoomInput) {
    try {
        const { GraftingOperationID, RecoveryEntryDate, RecoveryExitDate, GraftedLossCount, WorkersLoss } = input;

        const result = await prisma.$transaction(async (tx) => {
            const updatedRoom = await tx.tbl_RecoveryRoomPerOrder.update({
                where: { ID: id },
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

            return updatedRoom;
        });

        return { status: "ok", data: result, message: "اطلاعات با موفقیت بروزرسانی شد" };
    } catch (error) {
        console.error("Error updating recovery room:", error);
        return { status: "error", message: "خطا در بروزرسانی اطلاعات" };
    }
}
