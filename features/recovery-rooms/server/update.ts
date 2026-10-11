"use server";
import { actionError } from "@/server/actions/errors";
import { requireSession } from "@/server/auth/require-session";
import { revalidatePath } from "next/cache";
import { saveRecoveryRoom } from "./save";

export async function updateRecoveryRoom(id: number, input: unknown) {
  try {
    await requireSession();
    const data = await saveRecoveryRoom(input, id);
    revalidatePath("/dashboard/recoveryRoom");
    return {
      status: "ok" as const,
      data,
      message: "اطلاعات با موفقیت بروزرسانی شد",
    };
  } catch (error) {
    return actionError(error);
  }
}
