"use server";
import { Plantings } from "@/app/generated/prisma";
import { prisma } from "@/app/lib/singletone";

export async function createPlanting(data: Plantings) {
  const newPlanting = await prisma.plantings.create({
    data: data,
  });

  if (!newPlanting) {
    return false;
  }

  return true;
}
