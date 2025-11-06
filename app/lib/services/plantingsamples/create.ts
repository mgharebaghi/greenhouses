"use server";
import { PlantingSamples } from "@/app/generated/prisma";
import { prisma } from "@/app/lib/singletone";

export async function createSample(data: PlantingSamples): Promise<boolean> {
  const newSample = await prisma.plantingSamples.create({
    data,
  });

  if (!newSample) {
    return false;
  }
  return true;
}
