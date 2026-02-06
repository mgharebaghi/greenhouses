"use server";

import { prisma } from "@/app/lib/singletone";
import { revalidatePath } from "next/cache";

interface CreateRootStockData {
    BatchCode: string;
    PlantVariety: number;
    SupplierID: number;
    ProductionDate: Date;
    StemDiameter: number;
    HealthStatus: string;
    GrowthStage: string;
}

export async function createRootStockPlant(data: CreateRootStockData) {
    try {
        await prisma.rootStockPlant.create({
            data: {
                BatchCode: data.BatchCode,
                PlantVariety: data.PlantVariety,
                SupplierID: data.SupplierID,
                ProductionDate: data.ProductionDate,
                StemDiameter: data.StemDiameter,
                HealthStatus: data.HealthStatus,
                GrowthStage: data.GrowthStage
            }
        });
        revalidatePath("/dashboard/grafting/rootstock");
        return { success: true };
    } catch (error) {
        console.error("Error creating root stock plant:", error);
        return { success: false, error: "Failed to create record" };
    }
}
