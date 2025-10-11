"use server";
import { PlantingGrowthDaily } from "@/app/generated/prisma";
import { prisma } from "@/app/lib/singletone";

export async function updateGrowthDaily(id: number, data: PlantingGrowthDaily) {
  const updated = await prisma.plantingGrowthDaily.update({
    where: { PlantGrowthDailyID: id },
    data,
  });

  if (updated) {
    return true;
  } else {
    return false;
  }
}
