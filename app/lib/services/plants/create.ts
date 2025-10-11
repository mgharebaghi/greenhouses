"use server";

import { Plants } from "@/app/generated/prisma";
import { prisma } from "@/app/lib/singletone";

export async function createPlant(data: Plants) {
  return await prisma.plants.create({
    data,
  });
}
