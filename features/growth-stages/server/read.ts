"use server";
import { readError } from "@/server/actions/errors";
import { requireSession } from "@/server/auth/require-session";

import { prisma } from "@/server/db/prisma";

export async function getGrowthStages() {
  try {
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
  } catch (error) {
    throw readError(error);
  }
}

export async function getGrowthStagesByVariety(varietyID: number) {
  try {
    await requireSession();
    return await prisma.tbl_PlantGrowthStage.findMany({
      where: { VarietyID: varietyID },
      orderBy: { StageOrder: "asc" },
    });
  } catch (error) {
    throw readError(error);
  }
}
