"use server";

import { PlantVarities } from "@/app/generated/prisma";
import { prisma } from "@/app/lib/singletone";

export async function updatePlantVariety(params: { id: number; data: PlantVarities }) {
  await prisma.plantVarities.update({
    where: {
      VarietyID: params.id,
    },
    data: params.data,
  });

  return true;
}
