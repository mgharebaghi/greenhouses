import { z } from "zod";
import { recoveryRoomSchema } from "../schema";
import { Tbl_RecoveryRoomPerOrder, Tbl_GraftingOperation, Tbl_Orders, Tbl_People, Tbl_GraftWorkers } from "@/app/generated/prisma";

export type RecoveryRoomFormData = z.infer<typeof recoveryRoomSchema>;

export type RecoveryWorkerDTO = Tbl_GraftWorkers & {
    Tbl_People: {
        FirstName: string | null;
        LastName: string | null;
        NationalCode: string | null;
        PersonCode: string | null;
    } | null;
};

export type RecoveryGraftingOpDTO = Tbl_GraftingOperation & {
    Tbl_Orders: {
        OrderCode: string | null;
        Tbl_People_Tbl_Orders_CustomerIDToTbl_People: {
            FirstName: string | null;
            LastName: string | null;
        } | null;
    } | null;
    Tbl_GraftWorkers: RecoveryWorkerDTO[];
};

export type RecoveryRoomListItem = Tbl_RecoveryRoomPerOrder & {
    Tbl_GraftingOperation: RecoveryGraftingOpDTO | null;
};
