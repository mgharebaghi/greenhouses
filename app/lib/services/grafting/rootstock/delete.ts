"use server";

import { prisma } from "@/app/lib/singletone";
import { revalidatePath } from "next/cache";
import { handlePrismaDeleteError } from "@/app/lib/helpers/prismaErrorHelper";

export async function deleteRootStockPlant(id: number): Promise<{ success: true } | { success: false; error: string }> {
    try {
        await prisma.rootStockPlant.delete({
            where: { RootstockID: id }
        });
        revalidatePath("/dashboard/grafting/rootstock");
        return { success: true };
    } catch (error) {
        console.error("Error deleting root stock plant:", error);
        return handlePrismaDeleteError(error);
    }
}
