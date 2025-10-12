"use server";

import { prisma } from "@/app/lib/singletone";

export async function getGrowthStages() {
  return await prisma.plantGrowthStages.findMany({
    orderBy: { StageID: "desc" },
    include: { PlantVarieties: { select: { VarietyID: true, VarietyName: true } } },
  });
}

export async function getGrowthStagesByVariety(varietyID: number) {
  return await prisma.plantGrowthStages.findMany({
    where: { VarietyID: varietyID },
    orderBy: { StageOrder: "asc" },
    // include: { PlantVarieties: { select: { VarietyID: true, VarietyName: true } } },
  });
}
