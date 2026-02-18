"use server";
import { Tbl_PlantVariety } from "@/app/generated/prisma";
import { prisma } from "@/lib/singletone";

export async function updatePlantVariety(params: { id: number; data: Tbl_PlantVariety }) {
  try {
    await prisma.tbl_PlantVariety.update({
      where: {
        ID: params.id,
      },
      data: params.data,
    });
    return true;
  } catch (error) {
    console.error("Error updating plant variety:", error);
    return false;
  }
}
