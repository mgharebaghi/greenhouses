"use server";
import { actionError } from "@/server/actions/errors";
import { requireSession } from "@/server/auth/require-session";
import { parseInput, recordIdSchema } from "@/shared/validation/input";

import { prisma } from "@/server/db/prisma";
import { revalidatePath } from "next/cache";

export async function deleteSeedPackage(id: number) {
  try {
    await requireSession();
    parseInput(recordIdSchema, id);
    await prisma.tbl_SeedPackage.delete({
      where: { ID: id },
    });

    revalidatePath("/dashboard/seed-package");
    return { status: "ok", message: "بسته بذر با موفقیت حذف شد" };
  } catch (error) {
    return actionError(error);
  }
}
