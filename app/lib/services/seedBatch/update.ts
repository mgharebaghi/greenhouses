"use server";

import { prisma } from "@/app/lib/singletone";
import { SeedBatchCreateRes } from "./types";

export async function updateSeedBatch({ id, data }: { id: number; data: any }): Promise<SeedBatchCreateRes> {
    try {
        await prisma.seedBatch.update({
            where: { SeedBatchID: id },
            data: {
                BatchCode: data.BatchCode ? Number(data.BatchCode) : undefined,
                ProducerID: data.ProducerID,
                CropVariety: data.CropVariety,
                GerminationRate: data.GerminationRate ? Number(data.GerminationRate) : undefined,
                PurityPercent: data.PurityPercent ? Number(data.PurityPercent) : undefined,
                ProductionDate: data.ProductionDate ? new Date(data.ProductionDate) : undefined,
                ExpirationDate: data.ExpirationDate ? new Date(data.ExpirationDate) : undefined,
                QualityGrade: data.QualityGrade,
                BatchNotes: data.BatchNotes,
            },
        });
        return { status: "ok", message: "بذر با موفقیت ویرایش شد" };
    } catch (error) {
        console.error("Error updating seed batch:", error);
        return { status: "error", message: "خطا در ویرایش بذر" };
    }
}
