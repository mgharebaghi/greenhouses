"use server";
import { actionError } from "@/server/actions/errors";
import { requireSession } from "@/server/auth/require-session";
import { parseInput, recordIdSchema } from "@/shared/validation/input";
import { startSeedlingCycleSchema } from "../schema";

import { prisma } from "@/server/db/prisma";
import { revalidatePath } from "next/cache";
import { StartSeedlingCycleCreateRes } from "../types";

export async function updateStartSeedlingCycle(
  id: number,
  input: unknown,
): Promise<StartSeedlingCycleCreateRes> {
  try {
    await requireSession();
    const data = parseInput(startSeedlingCycleSchema, input);
    parseInput(recordIdSchema, id);
    await prisma.tbl_StartSeedlingCycle.update({
      where: { ID: id },
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
    return { status: "ok", message: "سیکل با موفقیت ویرایش شد" };
  } catch (error) {
    return actionError(error);
  }
}
