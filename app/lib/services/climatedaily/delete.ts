"use server";
import { prisma } from "@/app/lib/singletone";

export async function deleteClimateDaily(id: number) {
  await prisma.climateDaily.delete({
    where: {
      ClimateDailyID: id,
    },
  });

  return true;
}
