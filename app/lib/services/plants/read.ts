"use server";
import { prisma } from "@/app/lib/singletone";

export async function getPlants() {
  return await prisma.plants.findMany({
    orderBy: { PlantID: "desc" },
  });
}
