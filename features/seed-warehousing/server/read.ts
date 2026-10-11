"use server";
import { requireSession } from "@/server/auth/require-session";

import { prisma } from "@/server/db/prisma";
import { serializeData } from "@/server/db/serialize";
import type { WarehouseTransactionDetails } from "../types/details";

export async function getAllSeedWarehousing(): Promise<
  WarehouseTransactionDetails[]
> {
  await requireSession();
  try {
    const transactions = await prisma.tbl_WarehousesTransaction.findMany({
      include: {
        Tbl_SeedPackage: true,
        Tbl_Warehouses: true,
      },
      orderBy: {
        ID: "desc",
      },
    });
    return serializeData(transactions);
  } catch (error) {
    console.error("Query failed", error);
    throw new Error("دریافت اطلاعات انجام نشد. لطفاً دوباره تلاش کنید.");
  }
}

export async function getSeedWarehousingById(
  id: number,
): Promise<WarehouseTransactionDetails | null> {
  await requireSession();
  try {
    const trx = await prisma.tbl_WarehousesTransaction.findUnique({
      where: { ID: id },
      include: {
        Tbl_SeedPackage: true,
        Tbl_Warehouses: true,
      },
    });
    return serializeData(trx);
  } catch (error) {
    console.error("Query failed", error);
    throw new Error("دریافت اطلاعات انجام نشد. لطفاً دوباره تلاش کنید.");
  }
}
