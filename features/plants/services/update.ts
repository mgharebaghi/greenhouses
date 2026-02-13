"use server";
import { Tbl_Plants } from "@/app/generated/prisma";
import { prisma } from "@/lib/singletone";

export async function updatePlant(params: { id: number; data: Tbl_Plants }) {
  const { id, data } = params;
  return prisma.tbl_Plants.update({
    where: { ID: id },
    data,
  });
}
