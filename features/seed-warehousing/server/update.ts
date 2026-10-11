"use server";
import { actionError } from "@/server/actions/errors";
import { requireSession } from "@/server/auth/require-session";
import { parseInput, recordIdSchema } from "@/shared/validation/input";
import { seedWarehousingInputSchema } from "../schema";

import { prisma } from "@/server/db/prisma";
import { revalidatePath } from "next/cache";

export async function updateSeedWarehousing(id: number, input: unknown) {
  try {
    await requireSession();
    const data = parseInput(seedWarehousingInputSchema, input);
    parseInput(recordIdSchema, id);
    const customDate = data.TransactionDate
      ? new Date(data.TransactionDate)
      : undefined;

    const updatedTrx = await prisma.tbl_WarehousesTransaction.update({
      where: { ID: id },
      data: {
        SeedPackageID: data.SeedPackageID
          ? Number(data.SeedPackageID)
          : undefined,
        WarehouseID: data.WarehouseID ? Number(data.WarehouseID) : undefined,
        TransactionType:
          data.TransactionType !== undefined ? data.TransactionType : undefined,
        PackageQuantity: data.PackageQuantity,
        TransactionDate: customDate,
        DestinationType: data.DestinationType,
        RecordedBy: data.RecordedBy,
      },
    });

    revalidatePath("/dashboard/seed-warehousing");
    return {
      status: "ok" as const,
      message: "عملیات با موفقیت انجام شد.",
      data: updatedTrx,
    };
  } catch (error) {
    return actionError(error);
  }
}
