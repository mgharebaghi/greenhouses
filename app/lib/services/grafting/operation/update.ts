"use server";

import { prisma } from "@/app/lib/singletone";
import { revalidatePath } from "next/cache";

export async function updateGraftingOperation(id: number, data: any) {
    try {
        if (!id) return { status: 'error', message: 'شناسه نامعتبر است' };

        await prisma.graftingOperation.update({
            where: { GraftingID: id },
            data: {
                NurserySeedID: data.NurserySeedID ? Number(data.NurserySeedID) : undefined,
                RootstockID: data.RootstockID ? Number(data.RootstockID) : undefined,
                GraftingMethod: data.GraftingMethod,
                GraftedNumber: data.GraftedNumber ? Number(data.GraftedNumber) : null,
                SucceedGrafted: data.SucceedGrafted ? Number(data.SucceedGrafted) : null,
                OperatorName: data.OperatorName,
                SuccessRate: data.SuccessRate ? Number(data.SuccessRate) : null,
                InitialResult: data.InitialResult,
                FinalResult: data.FinalResult,
                RecoveryPeriodDays: data.RecoveryPeriodDays ? Number(data.RecoveryPeriodDays) : null,
                GraftNotes: data.GraftNotes,
            }
        });

        revalidatePath('/dashboard/grafting/operation');
        return { status: 'success', message: 'ویرایش با موفقیت انجام شد' };
    } catch (error) {
        console.error("Error updating grafting operation:", error);
        return { status: 'error', message: 'خطا در ویرایش اطلاعات' };
    }
}
