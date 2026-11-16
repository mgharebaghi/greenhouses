"use server";
import { actionError } from "@/server/actions/errors";
import { requireSession } from "@/server/auth/require-session";
import { parseInput, recordIdSchema } from "@/shared/validation/input";
import { revalidatePath } from "next/cache";

import { prisma } from "@/server/db/prisma";

export type PeopleDeleteResponse = {
  status: "ok" | "error";
  message: string;
};

export async function deletePerson(
  ownerId: number,
): Promise<PeopleDeleteResponse> {
  try {
    await requireSession();
    const id = parseInput(recordIdSchema, ownerId);
    await prisma.tbl_People_Companies.delete({
      where: { ID: id },
    });
    revalidatePath("/dashboard/people");
    return { status: "ok", message: "" };
  } catch (error) {
    return actionError(error);
  }
}
