"use server";
import { PlantGrowthStages } from "@/app/generated/prisma";
import { prisma } from "@/app/lib/singletone";

export async function createGrowthStage(data: PlantGrowthStages) {
  await prisma.plantGrowthStages.create({
    data: data,
  });

  return true;
}
