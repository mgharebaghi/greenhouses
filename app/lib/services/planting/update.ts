"use server";
import { Plantings } from "@/app/generated/prisma";
import { prisma } from "@/app/lib/singletone";

export async function updatePlanting(plantingId: number, data: Plantings) {
  const updatedPlanting = await prisma.plantings.update({
    where: { PlantingID: plantingId },
    data,
  });

  if (!updatedPlanting) {
    return false;
  }

  return true;
}
