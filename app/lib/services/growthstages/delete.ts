"use server";
import { prisma } from "@/app/lib/singletone";

export async function deleteGrowthStage(stageId: number) {
  await prisma.plantGrowthStages.delete({
    where: { StageID: stageId },
  });

  return true;
}
