import "server-only";
import type { RecoveryRoomRecord } from "../types/record";
import { prepareRecoveryInput } from "../domain/input";
import { parseInput, recordIdSchema } from "@/shared/validation/input";
import { requireRecoveryStorage } from "./availability";

export async function saveRecoveryRoom(
  input: unknown,
  id?: number,
): Promise<RecoveryRoomRecord> {
  prepareRecoveryInput(input);
  if (id !== undefined) parseInput(recordIdSchema, id);
  requireRecoveryStorage();
}
