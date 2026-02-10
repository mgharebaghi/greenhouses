"use server";
import { Tbl_plantVariety } from "@/app/generated/prisma";
import { prisma } from "@/app/lib/singletone";

export async function updatePlantVariety(params: { id: number; data: Tbl_plantVariety }) {
  try {
    await prisma.tbl_plantVariety.update({
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
