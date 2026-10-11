"use server";
import { actionError } from "@/server/actions/errors";
import { requireSession } from "@/server/auth/require-session";
import { parseInput, recordIdSchema } from "@/shared/validation/input";
import { requireRecoveryStorage } from "./availability";
import type { ActionResult } from "@/shared/contracts/action-result";

export async function deleteRecoveryRoom(id: number): Promise<ActionResult> {
  try {
    await requireSession();
    parseInput(recordIdSchema, id);
    requireRecoveryStorage();
  } catch (error) {
    return actionError(error);
  }
}
