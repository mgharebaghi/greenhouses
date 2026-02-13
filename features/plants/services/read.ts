"use server";
import { prisma } from "@/lib/singletone";

export async function getPlants() {
  return await prisma.tbl_Plants.findMany({
    orderBy: { ID: "desc" },
  });
}
