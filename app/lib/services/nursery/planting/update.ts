"use server";

import { prisma } from "@/app/lib/singletone";
import { UpdateNurserySeedDTO } from "./types";
import { revalidatePath } from "next/cache";

export async function updateNurserySeed(data: UpdateNurserySeedDTO) {
    try {
        const { NurserySeedID, ...rest } = data;
        await prisma.nurserySeed.update({
            where: { NurserySeedID: Number(NurserySeedID) },
            data: {
                ...rest,
                SeedPackageID: rest.SeedPackageID ? Number(rest.SeedPackageID) : undefined,
                NurseryRoomID: rest.NurseryRoomID ? Number(rest.NurseryRoomID) : undefined,
                PlantingDate: rest.PlantingDate ? new Date(rest.PlantingDate) : undefined,
                EmergenceDate: rest.EmergenceDate ? new Date(rest.EmergenceDate) : undefined,
                GrowthRate: rest.GrowthRate !== undefined ? Number(rest.GrowthRate) : undefined,
                ReadyForGraftingDate: rest.ReadyForGraftingDate ? new Date(rest.ReadyForGraftingDate) : undefined,
            }
        });
        revalidatePath("/dashboard/nursery/planting");
        return { success: true };
    } catch (error) {
        console.error("Error updating nursery seed:", error);
        return { success: false, error: "Failed to update nursery seed" };
    }
}
