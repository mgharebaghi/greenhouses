"use server";
import { requireSession } from "@/server/auth/require-session";
import { prisma } from "@/server/db/prisma";

export async function getPlants() {
  await requireSession();
  return await prisma.tbl_Plants.findMany({
    orderBy: { ID: "desc" },
  });
}
