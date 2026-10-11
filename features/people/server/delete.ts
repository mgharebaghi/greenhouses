"use server";
import { actionError } from "@/server/actions/errors";
import { requireSession } from "@/server/auth/require-session";
import { parseInput, recordIdSchema } from "@/shared/validation/input";

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
    parseInput(recordIdSchema, ownerId);
    const deletation = await prisma.tbl_People.delete({
      where: { ID: ownerId },
    });

    if (!deletation) {
      return {
        status: "error",
        message: "خطایی پیش آمده! لطفا بعدا تلاش کنید.",
      };
    } else {
      return {
        status: "ok",
        message: "",
      };
    }
  } catch (error) {
    return actionError(error);
  }
}
