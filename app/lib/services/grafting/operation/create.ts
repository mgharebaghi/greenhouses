"use server";

import { prisma } from "@/app/lib/singletone";
import { revalidatePath } from "next/cache";

export async function createGraftingOperation(data: any) {
    try {
        // Basic validation
        if (!data.NurserySeedID || !data.RootstockID) {
            return { status: 'error', message: 'انتخاب پیوندک و پایه الزامی است' };
        }

        await prisma.graftingOperation.create({
            data: {
                NurserySeedID: Number(data.NurserySeedID),
                RootstockID: Number(data.RootstockID),
                GraftingMethod: data.GraftingMethod,
                GraftedNumber: data.GraftedNumber ? Number(data.GraftedNumber) : null,
                SucceedGrafted: data.SucceedGrafted ? Number(data.SucceedGrafted) : null,
                OperatorName: data.OperatorName,
                SuccessRate: data.SuccessRate ? Number(data.SuccessRate) : null,
                InitialResult: data.InitialResult,
                GraftNotes: data.GraftNotes,
            }
        });

        revalidatePath('/dashboard/grafting/operation');
        return { status: 'success', message: 'عملیات با موفقیت ثبت شد' };
    } catch (error) {
        console.error("Error creating grafting operation:", error);
        return { status: 'error', message: 'خطا در ثبت اطلاعات' };
    }
}
