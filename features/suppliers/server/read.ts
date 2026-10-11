"use server";
import { requireSession } from "@/server/auth/require-session";
import { prisma } from "@/server/db/prisma";

export async function getSuppliers() {
  await requireSession();
  return await prisma.tbl_Suppliers.findMany({ orderBy: { ID: "desc" } });
}
