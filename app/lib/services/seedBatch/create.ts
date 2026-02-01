"use server";

import { prisma } from "@/app/lib/singletone";
import { SeedBatchCreateRes } from "./types";

export async function createSeedBatch(data: any): Promise<SeedBatchCreateRes> {
    try {
        const newSeedBatch = await prisma.seedBatch.create({
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
        return { status: "ok", message: "بذر با موفقیت ایجاد شد", seedBatchId: newSeedBatch.SeedBatchID };
    } catch (error) {
        console.error("Error creating seed batch:", error);
        return { status: "error", message: "خطا در ایجاد بذر" };
    }
}
