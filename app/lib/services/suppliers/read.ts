"use server";
import { prisma } from "@/app/lib/singletone";

export async function getSuppliers() {
  return await prisma.tbl_suppliers.findMany({ orderBy: { ID: "desc" } });
}
