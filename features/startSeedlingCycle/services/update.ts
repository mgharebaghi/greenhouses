"use server";

import { prisma } from "@/lib/singletone";
import { revalidatePath } from "next/cache";
import { StartSeedlingCycleFormValues } from "../schema";
import { StartSeedlingCycleCreateRes } from "../types";

export async function updateStartSeedlingCycle(
    id: number,
    data: StartSeedlingCycleFormValues
): Promise<StartSeedlingCycleCreateRes> {
    try {
        await prisma.tbl_StartSeedlingCycle.update({
            where: { ID: id },
            data: {
                OrderID: data.OrderID,
                SeedType: data.SeedType,
                GerminationRoomExitDate: data.GerminationRoomExitDate,
                NumberOfLostSeedlingFromGermination: data.NumberOfLostSeedlingFromGermination,
                GreenhouseEntryDate: data.GreenhouseEntryDate,
                NumberOfTrays: data.NumberOfTrays,
                GreenhouseID: data.GreenhouseID,
                SalonName: data.SalonName,
                GreenhouseExitDate: data.GreenhouseExitDate,
                NumberOfLostSeedlingFromGreenhouse: data.NumberOfLostSeedlingFromGreenhouse,
            },
        });

        revalidatePath("/dashboard/start-seedling-cycle");
        return { status: "ok", message: "سیکل با موفقیت ویرایش شد" };
    } catch (error) {
        console.error("Error updating StartSeedlingCycle:", error);
        return { status: "error", message: "خطا در ویرایش اطلاعات" };
    }
}
