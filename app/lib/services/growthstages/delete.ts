"use server";
import { prisma } from "@/app/lib/singletone";

export async function deleteGrowthStage(id: number) {
  try {
    await prisma.tbl_PlantGrowthStage.delete({
      where: { ID: id },
    });
    return true;
  } catch (error) {
    console.error("Error deleting growth stage:", error);
    return false;
  }
}
