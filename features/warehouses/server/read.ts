"use server";
import { requireSession } from "@/server/auth/require-session";

import { prisma } from "@/server/db/prisma";
import type { WarehouseRecord } from "../types/record";

export async function getAllWarehouses(): Promise<WarehouseRecord[]> {
  await requireSession();
  try {
    const warehouses = await prisma.tbl_Warehouses.findMany({
      orderBy: {
        ID: "desc",
      },
    });
    return warehouses;
  } catch (error) {
    console.error("Query failed", error);
    throw new Error("دریافت اطلاعات انجام نشد. لطفاً دوباره تلاش کنید.");
  }
}

export async function getWarehouseById(
  id: number,
): Promise<WarehouseRecord | null> {
  await requireSession();
  try {
    const warehouse = await prisma.tbl_Warehouses.findUnique({
      where: { ID: id },
    });
    return warehouse;
  } catch (error) {
    console.error("Query failed", error);
    throw new Error("دریافت اطلاعات انجام نشد. لطفاً دوباره تلاش کنید.");
  }
}
