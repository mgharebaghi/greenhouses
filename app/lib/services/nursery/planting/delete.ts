"use server";

import { prisma } from "@/app/lib/singletone";
import { revalidatePath } from "next/cache";

export async function deleteNurserySeed(id: number) {
    try {
        await prisma.nurserySeed.delete({
            where: { NurserySeedID: id }
        });
        revalidatePath("/dashboard/nursery/planting");
        return { success: true };
    } catch (error) {
        console.error("Error deleting nursery seed:", error);
        return { success: false, error: "Failed to delete nursery seed" };
    }
}
