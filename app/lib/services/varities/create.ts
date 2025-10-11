"use server";
import { PlantVarietyDTO } from "@/app/dashboard/plantvarities/page";
import { PlantVarities } from "@/app/generated/prisma";
import { prisma } from "@/app/lib/singletone";

export async function createPlantVariety(data: PlantVarities) {
  await prisma.plantVarities.create({
    data: data,
  });

  return true;
}
