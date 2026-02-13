"use server";

import { prisma } from "@/lib/singletone";
import { NurseryRoomUpdateInput } from "./types";
import { revalidatePath } from "next/cache";

export async function updateNurseryRoom(id: number, data: NurseryRoomUpdateInput) {
    try {
        await prisma.tbl_NurseryRoom.update({
            where: { ID: id },
            data: {
                NurseryRoomCode: data.NurseryRoomCode,
                NurseryRoomName: data.NurseryRoomName,
                TemperatureMin: data.TemperatureMin,
                TemperatureMax: data.TemperatureMax,
                HumidityMin: data.HumidityMin,
                HumidityMax: data.HumidityMax,
                LightType: data.LightType,
                LightHoursPerDay: data.LightHoursPerDay,
                CO2Range: data.CO2Range,
                StrelizationMethod: data.StrelizationMethod,
                NurseryRoomCreatedAt: data.NurseryRoomCreatedAt,
            },
        });

        revalidatePath("/dashboard/nursery-rooms");
        return { status: "ok", message: "اطلاعات اتاق نشاء با موفقیت ویرایش شد" };
    } catch (error: any) {
        console.error("Error updating nursery room:", error);
        return { status: "error", message: "خطا در ویرایش اطلاعات: " + error.message };
    }
}
