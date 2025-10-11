"use server";

import { prisma } from "@/app/lib/singletone";

export async function deletePlanting(plantingId: number) {
  await prisma.plantings.delete({
    where: {
      PlantingID: plantingId,
    },
  });

  return true;
}
