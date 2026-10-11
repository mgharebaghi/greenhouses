"use server";
import { actionError } from "@/server/actions/errors";
import { requireSession } from "@/server/auth/require-session";
import { parseInput } from "@/shared/validation/input";
import { startSeedlingCycleSchema } from "../schema";

import { prisma } from "@/server/db/prisma";
import { revalidatePath } from "next/cache";

export async function createStartSeedlingCycle(input: unknown) {
  try {
    await requireSession();
    const data = parseInput(startSeedlingCycleSchema, input);
    const record = await prisma.tbl_StartSeedlingCycle.create({
      data: {
        OrderID: data.OrderID,
        SeedType: data.SeedType,
        GerminationRoomExitDate: data.GerminationRoomExitDate,
        NumberOfLostSeedlingFromGermination:
          data.NumberOfLostSeedlingFromGermination,
        GreenhouseEntryDate: data.GreenhouseEntryDate,
        NumberOfTrays: data.NumberOfTrays,
        GreenhouseID: data.GreenhouseID,
        SalonName: data.SalonName,
        GreenhouseExitDate: data.GreenhouseExitDate,
        NumberOfLostSeedlingFromGreenhouse:
          data.NumberOfLostSeedlingFromGreenhouse,
      },
    });

    revalidatePath("/dashboard/start-seedling-cycle");
    return {
      status: "ok",
      message: "عملیات با موفقیت انجام شد",
      id: record.ID,
    };
  } catch (error) {
    return actionError(error);
  }
}
