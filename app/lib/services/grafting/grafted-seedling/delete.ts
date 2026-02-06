"use server";

import { prisma } from "@/app/lib/singletone";
import { revalidatePath } from "next/cache";

export async function deleteGraftedSeedling(id: number) {
    try {
        await prisma.graftedPlant.delete({
            where: { GraftedPlantID: id }
        });

        revalidatePath('/dashboard/grafting/grafted-seedling');
        return { status: 'success', message: 'حذف با موفقیت انجام شد' };
    } catch (error) {
        console.error("Error deleting grafted seedling:", error);
        return { status: 'error', message: 'خطا در حذف اطلاعات' };
    }
}
