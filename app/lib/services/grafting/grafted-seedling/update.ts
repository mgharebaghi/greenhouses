"use server";

import { prisma } from "@/app/lib/singletone";
import { revalidatePath } from "next/cache";

export async function updateGraftedSeedling(id: number, data: any) {
    try {
        await prisma.graftedPlant.update({
            where: { GraftedPlantID: id },
            data: {
                GraftingID: Number(data.GraftingID),
                GraftedNumber: data.GraftedNumber ? Number(data.GraftedNumber) : 0,
                ReadyForSaleDate: data.ReadyForSaleDate ? new Date(data.ReadyForSaleDate) : null,
                QualityGrade: data.QualityGrade,
                SurvivalRate: data.SurvivalRate ? Number(data.SurvivalRate) : null,
                GraftedPlantNotes: data.GraftedPlantNotes,
            }
        });

        revalidatePath('/dashboard/grafting/grafted-seedling');
        return { status: 'success', message: 'اطلاعات با موفقیت ویرایش شد' };
    } catch (error) {
        console.error("Error updating grafted seedling:", error);
        return { status: 'error', message: 'خطا در ویرایش اطلاعات' };
    }
}
