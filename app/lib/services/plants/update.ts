"use server";
import { Plants } from "@/app/generated/prisma";
import { prisma } from "@/app/lib/singletone";

export async function updatePlant(params: { id: number; data: Plants }) {
  const { id, data } = params;
  return prisma.plants.update({
    where: { PlantID: id },
    data,
  });
}
