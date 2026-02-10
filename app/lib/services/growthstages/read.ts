"use server";

import { prisma } from "@/app/lib/singletone";

export async function getGrowthStages() {
  return await prisma.tbl_PlantGrowthStage.findMany({
    orderBy: { ID: "desc" },
    include: {
      Tbl_plantVariety: {
        select: {
          VarietyName: true,
        },
      },
    },
  });
}

export async function getGrowthStagesByVariety(varietyID: number) {
  return await prisma.tbl_PlantGrowthStage.findMany({
    where: { VarietyID: varietyID },
    orderBy: { StageOrder: "asc" },
  });
}
