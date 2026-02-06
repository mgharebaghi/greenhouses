"use server";

import { prisma } from "@/app/lib/singletone";
import { revalidatePath } from "next/cache";

interface UpdateRootStockData {
    RootstockID: number;
    BatchCode: string;
    PlantVariety: number;
    SupplierID: number;
    ProductionDate: Date;
    StemDiameter: number;
    HealthStatus: string;
    GrowthStage: string;
}

export async function updateRootStockPlant(data: UpdateRootStockData) {
    try {
        const { RootstockID, ...updateData } = data;
        await prisma.rootStockPlant.update({
            where: { RootstockID },
            data: updateData
        });
        revalidatePath("/dashboard/grafting/rootstock");
        return { success: true };
    } catch (error) {
        console.error("Error updating root stock plant:", error);
        return { success: false, error: "Failed to update record" };
    }
}
