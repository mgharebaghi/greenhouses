"use server";

import { prisma } from "@/app/lib/singletone";

export async function getAllWarehouses() {
    try {
        const warehouses = await prisma.warehouses.findMany({
            include: {
                Owner_Observer: true, // Warehouse Manager details
            },
            orderBy: {
                WarehouseID: "desc",
            },
        });
        return warehouses;
    } catch (error) {
        console.error("Error fetching warehouses:", error);
        return [];
    }
}

export async function getWarehouseById(id: number) {
    try {
        const warehouse = await prisma.warehouses.findUnique({
            where: { WarehouseID: id },
            include: {
                Owner_Observer: true,
            },
        });
        return warehouse;
    } catch (error) {
        console.error("Error fetching warehouse:", error);
        return null;
    }
}
