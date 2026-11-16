"use server";
import { actionError } from "@/server/actions/errors";
import { requireSession } from "@/server/auth/require-session";
import { serializableTransaction } from "@/server/db/transaction";
import { parseInput } from "@/shared/validation/input";
import { revalidatePath } from "next/cache";
import { supplierInputSchema } from "../schema";
import { prepareSupplierWrite } from "./person";

export async function createSupplier(input: unknown) {
  try {
    await requireSession();
    const data = parseInput(supplierInputSchema, input);
    await serializableTransaction(async (tx) =>
      tx.tbl_Suppliers.create({ data: await prepareSupplierWrite(tx, data) }),
    );
    revalidatePath("/dashboard/suppliers");
    return { status: "ok" as const, message: "اطلاعات با موفقیت ثبت شد." };
  } catch (error) {
    return actionError(error);
  }
}
