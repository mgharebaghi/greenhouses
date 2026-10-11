"use server";
import { actionError } from "@/server/actions/errors";
import { requireSession } from "@/server/auth/require-session";
import { revalidatePath } from "next/cache";
import { saveRecoveryRoom } from "./save";

export async function createRecoveryRoom(input: unknown) {
  try {
    await requireSession();
    const data = await saveRecoveryRoom(input);
    revalidatePath("/dashboard/recoveryRoom");
    return {
      status: "ok" as const,
      data,
      message: "اتاق ریکاوری با موفقیت ثبت شد",
    };
  } catch (error) {
    return actionError(error);
  }
}
