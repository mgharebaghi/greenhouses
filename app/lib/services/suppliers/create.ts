"use server";
import { prisma } from "@/app/lib/singletone";
import type { Tbl_suppliers } from "@/app/generated/prisma";

export async function createSupplier(data: Tbl_suppliers): Promise<boolean> {
  await prisma.tbl_suppliers.create({ data });
  return true;
}
