"use server";

import { prisma } from "@/lib/singletone";
import { GraftingCreateDTO, GraftingActionResponse } from "../types";
import { createGraftingOperationSchema } from "../schema";

export async function createGraftingOperation(data: GraftingCreateDTO): Promise<GraftingActionResponse> {
    const validation = createGraftingOperationSchema.safeParse(data);
    if (!validation.success) {
        return { status: "error", message: validation.error.issues[0].message };
    }

    const { Workers, ...mainData } = data;

    try {
        const result = await prisma.$transaction(async (tx) => {
            // 1. Create the main operation record
            const operation = await tx.tbl_GraftingOperation.create({
                data: {
                    OrderID: mainData.OrderID,
                    ColdRoomExitDate: mainData.ColdRoomExitDate,
                    GraftingDate: mainData.GraftingDate,
                    TrayNumber: mainData.TrayNumber,
                    CellPerTrayNumber: mainData.CellPerTrayNumber,
                    CellHeight: mainData.CellHeight,
                    TrayMaterial: mainData.TrayMaterial,
                    PlantingBed: mainData.PlantingBed,
                    PlantingBedRatio: mainData.PlantingBedRatio || 0,
                    GraftingClamp: mainData.GraftingClamp,
                    GraftingStick: mainData.GraftingStick,
                    GraftingTechnicianID: mainData.GraftingTechnicianID,
                },
            });

            // 2. Create worker records
            if (Workers && Workers.length > 0) {
                await tx.tbl_GraftWorkers.createMany({
                    data: Workers.map((worker) => ({
                        GraftingOperationID: operation.ID,
                        GraftWorkerID: worker.PersonID,
                        LossPerWorker: 0
                    })),
                });
            }

            return operation;
        });

        return { status: "ok", message: "عملیات پیوند با موفقیت ثبت شد", id: result.ID };
    } catch (error) {
        console.error("Error creating grafting operation:", error);
        return { status: "error", message: "خطا در ثبت اطلاعات. لطفاً مجدداً تلاش کنید." };
    }
}
