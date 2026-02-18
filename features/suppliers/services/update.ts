"use server";
import { prisma } from "@/lib/singletone";
import type { Tbl_Suppliers } from "@/app/generated/prisma";

export async function updateSupplier(params: { id: number; data: Partial<Tbl_Suppliers> }) {
  await prisma.tbl_Suppliers.update({ where: { ID: params.id }, data: params.data });
  return true;
}
