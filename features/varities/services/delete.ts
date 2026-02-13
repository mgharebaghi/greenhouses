"use server";
import { prisma } from "@/lib/singletone";

export async function deletePlantVariety(id: number) {
  try {
    await prisma.tbl_plantVariety.delete({
      where: { ID: id },
    });
    return true;
  } catch (error) {
    console.error("Error deleting plant variety:", error);
    return false;
  }
}
