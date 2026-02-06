"use server";

import { prisma } from "@/app/lib/singletone";
import { revalidatePath } from "next/cache";

import { handlePrismaDeleteError } from "@/app/lib/helpers/prismaErrorHelper";

export async function deleteGraftingOperation(id: number): Promise<{ success: true } | { success: false; error: string }> {
    try {
        await prisma.graftingOperation.delete({
            where: { GraftingID: id }
        });

        revalidatePath('/dashboard/grafting/operation');
        return { success: true };
    } catch (error) {
        console.error("Error deleting grafting operation:", error);
        return handlePrismaDeleteError(error);
    }
}
