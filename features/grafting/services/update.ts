"use server";

import { prisma } from "@/lib/singletone";
import { GraftingCreateDTO, GraftingActionResponse } from "../types";
import { createGraftingOperationSchema } from "../schema";
import { revalidatePath } from "next/cache";

export async function updateGraftingOperation(
    id: number,
    data: GraftingCreateDTO
): Promise<GraftingActionResponse> {
    try {
        const validated = createGraftingOperationSchema.parse(data);

        // Prepare worker data
        const workerIds = validated.Workers?.map(w => w.PersonID) || [];

        // Transaction to ensure data consistency
        await prisma.$transaction(async (tx) => {
            // 1. Update the main operation record
            await tx.tbl_GraftingOperation.update({
                where: { ID: id },
                data: {
                    OrderID: validated.OrderID,
                    ColdRoomExitDate: validated.ColdRoomExitDate,
                    GraftingDate: validated.GraftingDate,
                    TrayNumber: validated.TrayNumber,
                    CellPerTrayNumber: validated.CellPerTrayNumber,
                    CellHeight: validated.CellHeight,
                    TrayMaterial: validated.TrayMaterial,
                    PlantingBed: validated.PlantingBed,
                    PlantingBedRatio: validated.PlantingBedRatio,
                    GraftingClamp: validated.GraftingClamp,
                    GraftingStick: validated.GraftingStick,
                    GraftingTechnicianID: validated.GraftingTechnicianID,
                },
            });

            // 2. Sync Workers
            // Fetch existing workers for this operation
            const existingWorkers = await tx.tbl_GraftWorkers.findMany({
                where: { GraftingOperationID: id },
                select: { GraftWorkerID: true, ID: true }
            });

            const existingPersonIds = existingWorkers.map(w => w.GraftWorkerID).filter((id): id is number => id !== null);

            // Determine adds and removes
            // Add: In new list but not in existing db list
            // Remove: In existing db list but not in new list
            // Note: We are doing simple replacement logic based on PersonID.
            // If a person is in both, we assume they stay. 
            // If a person is in new list but duplicates, we might need unique constraint handling,
            // but for now assume list is unique per person.

            const personIdsToAdd = workerIds.filter(pid => !existingPersonIds.includes(pid));
            const personIdsToRemove = existingPersonIds.filter(pid => !workerIds.includes(pid));

            // Execute Removes
            if (personIdsToRemove.length > 0) {
                await tx.tbl_GraftWorkers.deleteMany({
                    where: {
                        GraftingOperationID: id,
                        GraftWorkerID: { in: personIdsToRemove }
                    }
                });
            }

            // Execute Adds
            if (personIdsToAdd.length > 0) {
                await tx.tbl_GraftWorkers.createMany({
                    data: personIdsToAdd.map(pid => ({
                        GraftingOperationID: id,
                        GraftWorkerID: pid
                        // OrderID is optional in Tbl_GraftWorkers, typically inferred from GraftingID -> OrderID
                    }))
                });
            }
        });

        revalidatePath("/dashboard/grafting");
        return { status: "ok", message: "عملیات با موفقیت ویرایش شد", id };

    } catch (error) {
        console.error("Error updating grafting operation:", error);
        return { status: "error", message: "خطا در ویرایش عملیات" };
    }
}
