"use server";
import { ClimateDaily } from "@/app/generated/prisma";
import { prisma } from "@/app/lib/singletone";

export async function updateClimateDaily(id: number, data: ClimateDaily) {
  const updated = await prisma.climateDaily.update({
    where: { ClimateDailyID: id },
    data,
  });

  if (updated) {
    return true;
  } else {
    return false;
  }
}
