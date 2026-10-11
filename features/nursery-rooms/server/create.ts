"use server";
import { actionError } from "@/server/actions/errors";
import { requireSession } from "@/server/auth/require-session";
import { prisma } from "@/server/db/prisma";
import { parseInput } from "@/shared/validation/input";
import { revalidatePath } from "next/cache";
import { nurseryRoomInputSchema } from "../schema";

export async function createNurseryRoom(input: unknown) {
  try {
    await requireSession();
    const data = parseInput(nurseryRoomInputSchema, input);
    await prisma.tbl_NurseryRoom.create({ data });
    revalidatePath("/dashboard/nursery-rooms");
    return { status: "ok" as const, message: "اطلاعات با موفقیت ثبت شد." };
  } catch (error) {
    return actionError(error);
  }
}
