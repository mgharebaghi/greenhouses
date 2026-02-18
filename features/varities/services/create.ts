"use server";
import { Tbl_PlantVariety } from "@/app/generated/prisma";
import { prisma } from "@/lib/singletone";

export async function createPlantVariety(data: Tbl_PlantVariety) {
  try {
    await prisma.tbl_PlantVariety.create({
      data: data,
    });
    return true;
  } catch (error) {
    console.error("Error creating plant variety:", error);
    return false;
  }
}
