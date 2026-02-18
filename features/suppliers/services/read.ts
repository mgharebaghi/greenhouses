"use server";
import { prisma } from "@/lib/singletone";

export async function getSuppliers() {
  return await prisma.tbl_Suppliers.findMany({ orderBy: { ID: "desc" } });
}
