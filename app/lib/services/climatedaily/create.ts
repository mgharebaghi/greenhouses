"use server";
import { ClimateDaily } from "@/app/generated/prisma";
import { prisma } from "@/app/lib/singletone";

export async function createClimateDaily(data: ClimateDaily) {
  const inserting = await prisma.climateDaily.create({
    data: data,
  });

  if (inserting) {
    return true;
  } else {
    return false;
  }
}
