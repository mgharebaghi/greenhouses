"use server";

import { prisma } from "@/lib/singletone";
import { revalidatePath } from "next/cache";

export async function updateSeedPlanting(id: number, data: any) {
    try {
        const payload = {
            OrderID: Number(data.OrderID),
            GreenhouseID: data.GreenhouseID ? Number(data.GreenhouseID) : null,
            SeedType: Boolean(data.SeedType),
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

        await prisma.tbl_SeedPlanting.update({
            where: { ID: id },
            data: payload,
        });

        revalidatePath("/dashboard/seed-planting");
        return { status: "ok", message: "ویرایش با موفقیت انجام شد" };
    } catch (error) {
        console.error("Error updating seed planting:", error);
        return { status: "error", message: "خطا در ویرایش اطلاعات" };
    }
}
