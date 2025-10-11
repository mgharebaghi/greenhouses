"use server";

import { prisma } from "@/app/lib/singletone";

export async function deletePlant(id: number) {
  return await prisma.plants.deleteMany({
    where: { PlantID: id },
  });
}
