"use server";

import { prisma } from "@/app/lib/singletone";
import { revalidatePath } from "next/cache";

export async function deleteCareLog(id: number) {
    try {
        await prisma.nurseryCareLog.delete({
            where: { CareLogID: id }
        });
        revalidatePath("/dashboard/nursery/monitoring");
        return { success: true };
    } catch (error) {
        console.error("Error deleting care log:", error);
        return { success: false, error: "Failed to delete care log" };
    }
}
