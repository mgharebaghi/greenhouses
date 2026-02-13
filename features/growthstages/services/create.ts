"use server";
import { Tbl_PlantGrowthStage } from "@/app/generated/prisma";
import { prisma } from "@/lib/singletone";

export async function createGrowthStage(data: Omit<Tbl_PlantGrowthStage, "ID">) {
  try {
    await prisma.tbl_PlantGrowthStage.create({
      data: data as any,
    });
    return true;
  } catch (error) {
    console.error("Error creating growth stage:", error);
    return false;
  }
}
