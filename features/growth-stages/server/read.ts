"use server";
import { requireSession } from "@/server/auth/require-session";

import { prisma } from "@/server/db/prisma";

export async function getGrowthStages() {
  await requireSession();
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
  await requireSession();
  return await prisma.tbl_PlantGrowthStage.findMany({
    where: { VarietyID: varietyID },
    orderBy: { StageOrder: "asc" },
  });
}
