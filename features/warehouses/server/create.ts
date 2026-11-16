"use server";
import { actionError } from "@/server/actions/errors";
import { requireSession } from "@/server/auth/require-session";
import { prisma } from "@/server/db/prisma";
import { parseInput } from "@/shared/validation/input";
import { revalidatePath } from "next/cache";
import { warehouseInputSchema } from "../schema";
import { resolveManagerName } from "./manager";

export async function createWarehouse(input: unknown) {
  try {
    await requireSession();
    const { WarehouseManagerID, ...data } = parseInput(
      warehouseInputSchema,
      input,
    );
    await prisma.tbl_Warehouses.create({
      data: {
        ...data,
        WarehouseManagerName: await resolveManagerName(WarehouseManagerID),
      },
    });
    revalidatePath("/dashboard/warehouses");
    return { status: "ok" as const, message: "اطلاعات با موفقیت ثبت شد." };
  } catch (error) {
    return actionError(error);
  }
}
