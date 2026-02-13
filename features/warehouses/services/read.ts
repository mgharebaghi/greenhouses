"use server";

import { prisma } from "@/lib/singletone";

export async function getAllWarehouses() {
    try {
        const warehouses = await prisma.tbl_Warehouses.findMany({
            orderBy: {
                ID: "desc",
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
        const warehouse = await prisma.tbl_Warehouses.findUnique({
            where: { ID: id },
        });
        return warehouse;
    } catch (error) {
        console.error("Error fetching warehouse:", error);
        return null;
    }
}
