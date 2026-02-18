"use server";

import { prisma } from "@/lib/singletone";
import { StartSeedlingCycleFormValues } from "../schema";
import { revalidatePath } from "next/cache";

export async function createStartSeedlingCycle(data: StartSeedlingCycleFormValues) {
    try {
        const record = await prisma.tbl_StartSeedlingCycle.create({
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
            }
        });

        revalidatePath("/dashboard/start-seedling-cycle");
        return { status: "ok", message: "عملیات با موفقیت انجام شد", id: record.ID };
    } catch (error: any) {
        console.error("Error creating start seedling cycle:", error);
        return { status: "error", message: "خطا در ثبت اطلاعات: " + error.message };
    }
}
