"use server";
import { requireSession } from "@/server/auth/require-session";
import type { RecoveryRoomListItem, RecoveryGraftingOpDTO } from "../types";
import { requireRecoveryStorage } from "./availability";

export async function getAllRecoveryRooms(): Promise<RecoveryRoomListItem[]> {
  await requireSession();
  requireRecoveryStorage();
}

export async function getGraftingOperationsForDropdown(): Promise<
  RecoveryGraftingOpDTO[]
> {
  await requireSession();
  requireRecoveryStorage();
}
