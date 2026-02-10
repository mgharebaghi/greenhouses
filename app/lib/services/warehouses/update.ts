"use server";

import { prisma } from "@/app/lib/singletone";
import { WarehouseUpdateInput } from "./types";
import { revalidatePath } from "next/cache";

export async function updateWarehouse(id: number, data: WarehouseUpdateInput) {
    try {
        await prisma.tbl_Warehouses.update({
            where: { ID: id },
            data: {
                WarehouseCode: data.WarehouseCode,
                WarehouseName: data.WarehouseName,
                WarehouseLocation: data.WarehouseLocation,
                TemperatureRange: data.TemperatureRange,
                HumidityRange: data.HumidityRange,
                Capacity: data.Capacity,
                WarehouseManagerName: data.WarehouseManagerName,
                WarehouseCreatedAt: data.WarehouseCreatedAt,
            },
        });

        revalidatePath("/dashboard/warehouses");
        return { status: "ok", message: "اطلاعات انبار با موفقیت ویرایش شد" };
    } catch (error: any) {
        console.error("Error updating warehouse:", error);
        return { status: "error", message: "خطا در ویرایش اطلاعات: " + error.message };
    }
}
