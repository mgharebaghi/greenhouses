"use server";

import { prisma } from "@/app/lib/singletone";
import { UpdateNurseryCareLogDTO } from "./types";
import { revalidatePath } from "next/cache";

export async function updateCareLog(data: UpdateNurseryCareLogDTO) {
    try {
        await prisma.nurseryCareLog.update({
            where: { CareLogID: Number(data.CareLogID) },
            data: {
                NurserySeedID: Number(data.NurserySeedID),
                CareType: data.CareType,
                MaterialUsed: data.MaterialUsed,
                MaterialDose: data.MaterialDose,
                RoomTemperature: data.RoomTemperature ? Number(data.RoomTemperature) : null,
                RoomHumidity: data.RoomHumidity ? Number(data.RoomHumidity) : null,
                SupervisorName: data.SupervisorName,
                CareDate: new Date(data.CareDate),
                CareNote: data.CareNote
            }
        });
        revalidatePath("/dashboard/nursery/monitoring");
        return { success: true };
    } catch (error) {
        console.error("Error updating care log:", error);
        return { success: false, error: "Failed to update care log" };
    }
}
