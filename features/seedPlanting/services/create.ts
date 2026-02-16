"use server";

import { prisma } from "@/lib/singletone";
import { revalidatePath } from "next/cache";

export async function createSeedPlanting(data: any) {
    try {
        // Basic validation or transformation could happen here
        // Connect relations if they are passed as IDs

        // Ensure numeric fields are numbers
        const payload = {
            OrderID: Number(data.OrderID),
            GreenhouseID: data.GreenhouseID ? Number(data.GreenhouseID) : null,
            SeedType: Boolean(data.SeedType), // 0 or 1
            PlantingDate: data.PlantingDate ? new Date(data.PlantingDate) : null,
            SeedPlantingNumber: Number(data.SeedPlantingNumber),
            TrayNumber: Number(data.TrayNumber),
            CellPerTrayNumber: Number(data.CellPerTrayNumber),
            CellHeight: Number(data.CellHeight),
            TrayMaterial: data.TrayMaterial,
            PlantingBed: data.PlantingBed,
            PlantingBedRatio: data.PlantingBedRatio ? Number(data.PlantingBedRatio) : null,
            GerminationDate: data.GerminationDate ? new Date(data.GerminationDate) : null,
            TechnicianID: data.TechnicianID ? Number(data.TechnicianID) : null,
        };

        await prisma.tbl_SeedPlanting.create({
            data: payload,
        });

        revalidatePath("/dashboard/seed-planting");
        return { status: "ok", message: "کاشت با موفقیت ثبت شد" };
    } catch (error) {
        console.error("Error creating seed planting:", error);
        return { status: "error", message: "خطا در ثبت اطلاعات" };
    }
}
