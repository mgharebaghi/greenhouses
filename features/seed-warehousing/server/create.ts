"use server";
import { actionError } from "@/server/actions/errors";
import { requireSession } from "@/server/auth/require-session";
import { parseInput } from "@/shared/validation/input";
import { seedWarehousingInputSchema } from "../schema";

import { prisma } from "@/server/db/prisma";
import { revalidatePath } from "next/cache";

export async function createSeedWarehousing(input: unknown) {
  try {
    await requireSession();
    const data = parseInput(seedWarehousingInputSchema, input);
    const customDate = data.TransactionDate
      ? new Date(data.TransactionDate)
      : new Date();

    const newTrx = await prisma.tbl_WarehousesTransaction.create({
      data: {
        SeedPackageID: Number(data.SeedPackageID),
        WarehouseID: Number(data.WarehouseID),
        TransactionType: data.TransactionType, // Boolean handling
        PackageQuantity: Number(data.PackageQuantity),
        TransactionDate: customDate,
        DestinationType: data.DestinationType,
        RecordedBy: data.RecordedBy,
      },
    });

    revalidatePath("/dashboard/seed-warehousing");
    return {
      status: "ok" as const,
      message: "عملیات با موفقیت انجام شد.",
      data: newTrx,
    };
  } catch (error) {
    return actionError(error);
  }
}
