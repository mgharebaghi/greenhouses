"use server";

import { prisma } from "@/lib/singletone";

export async function getStartSeedlingCycles() {
    try {
        const cycles = await prisma.tbl_StartSeedlingCycle.findMany({
            include: {
                Tbl_Orders: {
                    select: {
                        OrderCode: true,
                        Tbl_SeedPackage_Tbl_Orders_RootstockIDToTbl_SeedPackage: {
                            select: {
                                Tbl_plantVariety: { select: { VarietyName: true } }
                            }
                        },
                        Tbl_SeedPackage_Tbl_Orders_ScionIDToTbl_SeedPackage: {
                            select: {
                                Tbl_plantVariety: { select: { VarietyName: true } }
                            }
                        }
                    }
                },
                Tbl_Greenhouses: {
                    select: { GreenhouseName: true }
                }
            },
            orderBy: { ID: "desc" }
        });
        return cycles;
    } catch (error) {
        console.error("Error fetching start seedling cycles:", error);
        return [];
    }
}

export async function getOrdersForSelect() {
    try {
        const orders = await prisma.tbl_Orders.findMany({
            where: {
                // Filter for orders that are relevant? For now get all or maybe non-completed ones
            },
            select: {
                ID: true,
                OrderCode: true,
                Tbl_SeedPackage_Tbl_Orders_RootstockIDToTbl_SeedPackage: {
                    select: {
                        Tbl_plantVariety: { select: { VarietyName: true } }
                    }
                },
                Tbl_SeedPackage_Tbl_Orders_ScionIDToTbl_SeedPackage: {
                    select: {
                        Tbl_plantVariety: { select: { VarietyName: true } }
                    }
                }
            },
            orderBy: { ID: "desc" }
        });

        return orders.map(order => ({
            value: order.ID,
            label: order.OrderCode,
            rootstockVariety: order.Tbl_SeedPackage_Tbl_Orders_RootstockIDToTbl_SeedPackage?.Tbl_plantVariety?.VarietyName,
            scionVariety: order.Tbl_SeedPackage_Tbl_Orders_ScionIDToTbl_SeedPackage?.Tbl_plantVariety?.VarietyName
        }));
    } catch (error) {
        console.error("Error fetching orders for select:", error);
        return [];
    }
}

export async function getGreenhousesForSelect() {
    try {
        const greenhouses = await prisma.tbl_Greenhouses.findMany({
            where: { IsActive: true },
            select: { ID: true, GreenhouseName: true }
        });

        return greenhouses.map(g => ({
            value: g.ID,
            label: g.GreenhouseName
        }));
    } catch (error) {
        console.error("Error fetching greenhouses for select:", error);
        return [];
    }
}
