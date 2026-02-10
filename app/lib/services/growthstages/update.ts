"use server";
import { Tbl_PlantGrowthStage } from "@/app/generated/prisma";
import { prisma } from "@/app/lib/singletone";

export async function updateGrowthStage(id: number, data: any) {
  try {
    await prisma.tbl_PlantGrowthStage.update({
      where: { ID: id },
      data: data,
    });
    return true;
  } catch (error) {
    console.error("Error updating growth stage:", error);
    return false;
  }
}
