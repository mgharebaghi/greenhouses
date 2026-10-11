import type {
  GraftingOperationRecord,
  GraftWorkerRecord,
} from "@/features/grafting/types/record";
import type { RecoveryRoomRecord } from "@/features/recovery-rooms/types/record";
import { z } from "zod";
import { recoveryRoomSchema } from "../schema";

export type RecoveryRoomFormData = z.infer<typeof recoveryRoomSchema>;

export type RecoveryWorkerDTO = GraftWorkerRecord & {
  Tbl_People: {
    FirstName: string | null;
    LastName: string | null;
    NationalCode: string | null;
    PersonCode: string | null;
  } | null;
};

export type RecoveryGraftingOpDTO = GraftingOperationRecord & {
  Tbl_Orders: {
    OrderCode: string | null;
    Tbl_People_Tbl_Orders_CustomerIDToTbl_People: {
      FirstName: string | null;
      LastName: string | null;
    } | null;
  } | null;
  Tbl_GraftWorkers: RecoveryWorkerDTO[];
};

export type RecoveryRoomListItem = RecoveryRoomRecord & {
  Tbl_GraftingOperation: RecoveryGraftingOpDTO | null;
};

export type * from "./record";
