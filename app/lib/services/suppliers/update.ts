"use server";
import { prisma } from "@/app/lib/singletone";
import type { Tbl_suppliers } from "@/app/generated/prisma";

export async function updateSupplier(params: { id: number; data: Partial<Tbl_suppliers> }) {
  await prisma.tbl_suppliers.update({ where: { ID: params.id }, data: params.data });
  return true;
}
