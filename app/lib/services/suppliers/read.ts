"use server";
import { prisma } from "@/app/lib/singletone";

export async function getSuppliers() {
  return await prisma.suppliers.findMany({ orderBy: { ID: "desc" } });
}
