"use server";

import { prisma } from "@/lib/singletone";

export async function deleteRecoveryRoom(id: number) {
    try {
        const room = await prisma.tbl_RecoveryRoomPerOrder.findUnique({
            where: { ID: id },
            select: { GraftingOperationID: true }
        });

        if (room && room.GraftingOperationID) {
            await prisma.$transaction(async (tx) => {
                await tx.tbl_GraftWorkers.updateMany({
                    where: { GraftingOperationID: room.GraftingOperationID },
                    data: { LossPerWorker: 0 }
                });

                await tx.tbl_RecoveryRoomPerOrder.delete({
                    where: { ID: id }
                });
            });
        } else {
            await prisma.tbl_RecoveryRoomPerOrder.delete({
                where: { ID: id }
            });
        }

        return { status: "ok", message: "رکورد با موفقیت حذف شد" };
    } catch (error) {
        console.error("Error deleting recovery room:", error);
        return { status: "error", message: "خطا در حذف رکورد" };
    }
}
