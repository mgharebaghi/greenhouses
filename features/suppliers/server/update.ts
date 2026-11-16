"use server";
import { actionError } from "@/server/actions/errors";
import { requireSession } from "@/server/auth/require-session";
import { serializableTransaction } from "@/server/db/transaction";
import { parseInput, recordIdSchema } from "@/shared/validation/input";
import { revalidatePath } from "next/cache";
import { supplierInputSchema } from "../schema";
import { prepareSupplierWrite } from "./person";

export async function updateSupplier(params: { id: number; data: unknown }) {
  try {
    await requireSession();
    const id = parseInput(recordIdSchema, params?.id);
    const data = parseInput(supplierInputSchema, params.data);
    await serializableTransaction(async (tx) =>
      tx.tbl_Suppliers.update({
        where: { ID: id },
        data: await prepareSupplierWrite(tx, data),
      }),
    );
    revalidatePath("/dashboard/suppliers");
    return { status: "ok" as const, message: "اطلاعات با موفقیت ویرایش شد." };
  } catch (error) {
    return actionError(error);
  }
}
