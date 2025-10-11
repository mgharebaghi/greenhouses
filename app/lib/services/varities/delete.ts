"use server";
import { prisma } from "@/app/lib/singletone";

export async function deletePlantVariety(varietyID: number) {
  await prisma.plantVarities.delete({
    where: { VarietyID: varietyID },
  });

  return true;
}
