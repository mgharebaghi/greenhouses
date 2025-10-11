"use server";
import { PlantGrowthStages } from "@/app/generated/prisma";
import { prisma } from "@/app/lib/singletone";

export async function updateGrowthStage(stageId: number, data: PlantGrowthStages) {
  await prisma.plantGrowthStages.update({
    where: { StageID: stageId },
    data: data,
  });

  return true;
}
