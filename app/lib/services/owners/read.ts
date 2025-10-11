"use server";

import { Owner_Observer } from "@/app/generated/prisma";
import { prisma } from "@/app/lib/singletone";
export async function getAllOwners(): Promise<Owner_Observer[]> {
  return prisma.owner_Observer.findMany({
    orderBy: { ID: "desc" },
  });
}