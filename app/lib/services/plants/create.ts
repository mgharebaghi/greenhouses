"use server";

import { Tbl_Plants } from "@/app/generated/prisma";
import { prisma } from "@/app/lib/singletone";

export async function createPlant(data: Tbl_Plants) {
  return await prisma.tbl_Plants.create({
    data,
  });
}
