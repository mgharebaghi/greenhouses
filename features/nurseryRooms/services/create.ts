"use server";

import { prisma } from "@/lib/singletone";
import { NurseryRoomInput } from "./types";
import { revalidatePath } from "next/cache";

export async function createNurseryRoom(data: NurseryRoomInput) {
    try {
        await prisma.tbl_NurseryRoom.create({
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
        return { status: "ok", message: "اتاق نشاء با موفقیت ثبت شد" };
    } catch (error: any) {
        console.error("Error creating nursery room:", error);
        return { status: "error", message: "خطا در ثبت اتاق نشاء: " + error.message };
    }
}
