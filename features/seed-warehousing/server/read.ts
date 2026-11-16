"use server";
import { readError } from "@/server/actions/errors";
import { requireSession } from "@/server/auth/require-session";

import { prisma } from "@/server/db/prisma";
import { serializeData } from "@/server/db/serialize";
import type { WarehouseTransactionDetails } from "../types/details";

export async function getAllSeedWarehousing(): Promise<
  WarehouseTransactionDetails[]
> {
  try {
    await requireSession();
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
    throw readError(error);
  }
}

export async function getSeedWarehousingById(
  id: number,
): Promise<WarehouseTransactionDetails | null> {
  try {
    await requireSession();
    const trx = await prisma.tbl_WarehousesTransaction.findUnique({
      where: { ID: id },
      include: {
        Tbl_SeedPackage: true,
        Tbl_Warehouses: true,
      },
    });
    return serializeData(trx);
  } catch (error) {
    throw readError(error);
  }
}
