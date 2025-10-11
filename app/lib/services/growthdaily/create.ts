"use server";
import { PlantingGrowthDaily } from "@/app/generated/prisma";
import { prisma } from "@/app/lib/singletone";

export async function createGrowthDaily(data: PlantingGrowthDaily) {
  const inserting = await prisma.plantingGrowthDaily.create({
    data: data,
  });

  if (inserting) {
    return true;
  } else {
    return false;
  }
}
