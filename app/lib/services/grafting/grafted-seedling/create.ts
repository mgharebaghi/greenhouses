"use server";

import { prisma } from "@/app/lib/singletone";
import { revalidatePath } from "next/cache";

export async function createGraftedSeedling(data: any) {
    try {
        // Validation could go here

        await prisma.graftedPlant.create({
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
        return { status: 'success', message: 'نشاء پیوندی با موفقیت ثبت شد' };
    } catch (error) {
        console.error("Error creating grafted seedling:", error);
        return { status: 'error', message: 'خطا در ثبت اطلاعات' };
    }
}
