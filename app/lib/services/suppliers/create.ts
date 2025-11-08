"use server";
import { prisma } from "@/app/lib/singletone";
import type { Suppliers } from "@/app/generated/prisma";

export async function createSupplier(data: Suppliers): Promise<boolean> {
  await prisma.suppliers.create({ data });
  return true;
}
