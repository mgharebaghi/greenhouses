"use server";

import { prisma } from "@/lib/singletone";
import { RecoveryRoomListItem, RecoveryGraftingOpDTO } from "../types";

export async function getAllRecoveryRooms() {
    try {
        const rooms = await prisma.tbl_RecoveryRoomPerOrder.findMany({
            include: {
                Tbl_GraftingOperation: {
                    include: {
                        Tbl_Orders: {
                            select: {
                                OrderCode: true,
                                Tbl_People_Tbl_Orders_CustomerIDToTbl_People: {
                                    select: { FirstName: true, LastName: true }
                                }
                            }
                        },
                        Tbl_GraftWorkers: {
                            include: {
                                Tbl_People: {
                                    select: { FirstName: true, LastName: true, NationalCode: true, PersonCode: true }
                                }
                            }
                        }
                    }
                }
            },
            orderBy: { ID: "desc" }
        });
        return rooms;
    } catch (error) {
        console.error("Error fetching recovery rooms:", error);
        return [];
    }
}

export async function getGraftingOperationsForDropdown() {
    try {
        // Fetch operations that don't have a recovery room yet, or maybe all of them
        // Depending on requirements, we can fetch all and let user edit/create
        const ops = await prisma.tbl_GraftingOperation.findMany({
            include: {
                Tbl_Orders: {
                    select: {
                        OrderCode: true,
                        Tbl_People_Tbl_Orders_CustomerIDToTbl_People: {
                            select: { FirstName: true, LastName: true }
                        }
                    }
                },
                Tbl_GraftWorkers: {
                    include: {
                        Tbl_People: {
                            select: { FirstName: true, LastName: true, NationalCode: true, PersonCode: true }
                        }
                    }
                },
                Tbl_RecoveryRoomPerOrder: true
            },
            orderBy: { ID: "desc" }
        });

        // Return only those that do NOT have a recovery room entry yet
        // Wait, if we want to allow editing, maybe they should just use the grid's Edit button.
        // For new creation, we show ones without a recovery room entry.
        return ops.filter(op => op.Tbl_RecoveryRoomPerOrder.length === 0);
    } catch (error) {
        console.error("Error fetching grafting operations:", error);
        return [];
    }
}
