"use server";

import { prisma } from "@/app/lib/singletone";

export async function deletePlant(id: number) {
  return await prisma.tbl_Plants.deleteMany({
    where: { ID: id },
  });
}
