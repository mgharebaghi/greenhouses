"use server";

import { prisma } from "@/app/lib/singletone";
import { CreateNurserySeedDTO } from "./types";
import { revalidatePath } from "next/cache";

export async function createNurserySeed(data: CreateNurserySeedDTO) {
    try {
        await prisma.nurserySeed.create({
            data: {
                SeedPackageID: Number(data.SeedPackageID),
                NurseryRoomID: Number(data.NurseryRoomID),
                PlantingDate: new Date(data.PlantingDate),
                EmergenceDate: data.EmergenceDate ? new Date(data.EmergenceDate) : null,
                GrowthRate: data.GrowthRate ? Number(data.GrowthRate) : null,
                CurrentStage: data.CurrentStage,
                HealthStatus: data.HealthStatus,
                DiseaseObserved: data.DiseaseObserved,
                ReadyForGraftingDate: data.ReadyForGraftingDate ? new Date(data.ReadyForGraftingDate) : null
            }
        });
        revalidatePath("/dashboard/nursery/planting");
        return { success: true };
    } catch (error) {
        console.error("Error creating nursery seed:", error);
        return { success: false, error: "Failed to create nursery seed" };
    }
}
