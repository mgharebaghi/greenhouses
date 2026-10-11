"use server";
import { actionError } from "@/server/actions/errors";
import { requireSession } from "@/server/auth/require-session";
import { parseInput } from "@/shared/validation/input";

import { prisma } from "@/server/db/prisma";
import { revalidatePath } from "next/cache";
import { createGraftingOperationSchema } from "../schema";
import { GraftingActionResponse } from "../types";

export async function createGraftingOperation(
  input: unknown,
): Promise<GraftingActionResponse> {
  try {
    await requireSession();
    const { Workers, ...mainData } = parseInput(
      createGraftingOperationSchema,
      input,
    );
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
            LossPerWorker: 0,
          })),
        });
      }

      return operation;
    });

    revalidatePath("/dashboard/grafting");
    return {
      status: "ok",
      message: "عملیات پیوند با موفقیت ثبت شد",
      id: result.ID,
    };
  } catch (error) {
    return actionError(error);
  }
}
