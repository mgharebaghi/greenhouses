"use server";
import { actionError } from "@/server/actions/errors";
import { requireSession } from "@/server/auth/require-session";
import { parseInput, recordIdSchema } from "@/shared/validation/input";

import { prisma } from "@/server/db/prisma";

export type GreenHouseDeleteResponse = {
  status: "ok" | "error";
  message: string;
};

export async function deleteGreenhouse(id: number) {
  try {
    await requireSession();
    parseInput(recordIdSchema, id);
    // await deleteZones(id); // Module deleted

    await prisma.tbl_Greenhouses.delete({
      where: { ID: id },
    });
    return { status: "ok", message: "عملیات با موفقیت انجام شد." };
  } catch (error) {
    return actionError(error);
  }
}
