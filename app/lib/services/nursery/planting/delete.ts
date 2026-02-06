"use server";

import { prisma } from "@/app/lib/singletone";
import { revalidatePath } from "next/cache";
import { handlePrismaDeleteError } from "@/app/lib/helpers/prismaErrorHelper";

export async function deleteNurserySeed(id: number): Promise<{ success: true } | { success: false; error: string }> {
    try {
        await prisma.$transaction(async (tx) => {
            // 1. Delete associated trays (locations) first (Cascading Delete)
            await tx.locationInNursaryRoom.deleteMany({
                where: { NurserySeedID: id }
            });

            // 2. Delete the nursery seed itself
            await tx.nurserySeed.delete({
                where: { NurserySeedID: id }
            });
        });

        revalidatePath("/dashboard/nursery/planting");
        return { success: true };
    } catch (error) {
        console.error("Error deleting nursery seed:", error);
        return handlePrismaDeleteError(error);
    }
}
