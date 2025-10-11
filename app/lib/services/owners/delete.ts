"use server";

import { prisma } from "@/app/lib/singletone";

export async function deleteOwner(ownerId: number) {
  return prisma.owner_Observer.delete({
    where: { ID: ownerId },
  });
}
