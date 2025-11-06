"use server";
import { prisma } from "@/app/lib/singletone";

export async function getSamples(plantingID: number) {
  const samples = await prisma.plantingSamples.findMany({
    where: {
      PlantingID: plantingID,
    },
  });

  return samples;
}
