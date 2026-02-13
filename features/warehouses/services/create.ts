"use server";

import { prisma } from "@/lib/singletone";
import { WarehouseInput } from "./types";
import { revalidatePath } from "next/cache";

export async function createWarehouse(data: WarehouseInput) {
    try {
        await prisma.tbl_Warehouses.create({
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
        return { status: "ok", message: "انبار با موفقیت ثبت شد" };
    } catch (error: any) {
        console.error("Error creating warehouse:", error);
        return { status: "error", message: "خطا در ثبت انبار: " + error.message };
    }
}
