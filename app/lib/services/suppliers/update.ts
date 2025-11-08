"use server";
import { prisma } from "@/app/lib/singletone";
import type { Suppliers } from "@/app/generated/prisma";

export async function updateSupplier(params: { id: number; data: Partial<Suppliers> }) {
  await prisma.suppliers.update({ where: { ID: params.id }, data: params.data });
  return true;
}
