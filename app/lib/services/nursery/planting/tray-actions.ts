"use server";

import { prisma } from "@/app/lib/singletone";
import { revalidatePath } from "next/cache";

export async function createTray(data: { NurserySeedID: number, TrayNumber: string, CellNumber: string }) {
    try {
        await prisma.locationInNursaryRoom.create({
            data: {
                NurserySeedID: data.NurserySeedID,
                TrayNumber: data.TrayNumber,
                CellNumber: data.CellNumber
            }
        });
        revalidatePath("/dashboard/nursery/planting");
        return { success: true };
    } catch (error) {
        console.error("Error creating tray:", error);
        return { success: false, error: "Failed to create tray" };
    }
}

export async function deleteTray(id: number) {
    try {
        await prisma.locationInNursaryRoom.delete({
            where: { ID: id }
        });
        revalidatePath("/dashboard/nursery/planting");
        return { success: true };
    } catch (error) {
        console.error("Error deleting tray:", error);
        return { success: false, error: "Failed to delete tray" };
    }
}
