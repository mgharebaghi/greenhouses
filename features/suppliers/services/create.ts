"use server";
import { prisma } from "@/lib/singletone";
import type { Tbl_Suppliers } from "@/app/generated/prisma";

export async function createSupplier(data: Tbl_Suppliers): Promise<boolean> {
  await prisma.tbl_Suppliers.create({ data });
  return true;
}
