"use server";

import { prisma } from "@/app/lib/singletone";

export async function getGrowthStages() {
  return await prisma.plantGrowthStages.findMany({
    orderBy: { StageID: "desc" },
    include: { PlantVarieties: { select: { VarietyID: true, VarietyName: true } } },
  });
}
