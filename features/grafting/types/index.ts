import { z } from "zod";
import { createGraftingOperationSchema } from "../schema";
import { Tbl_GraftingOperation, Tbl_GraftWorkers, Tbl_People, Tbl_Orders } from "@/app/generated/prisma";

export type GraftingCreateDTO = z.infer<typeof createGraftingOperationSchema>;

export type GraftingOperationWithDetails = Tbl_GraftingOperation & {
    Tbl_Orders: Tbl_Orders | null;
    Tbl_People: Tbl_People | null; // Technician
    Tbl_GraftWorkers: (Tbl_GraftWorkers & {
        Tbl_People: Tbl_People | null;
    })[];
};

export interface GraftingFormData {
    orders: {
        ID: number;
        OrderCode: string | null;
        OrderCount: number | null;
    }[];
    people: {
        ID: number;
        FirstName: string | null;
        LastName: string | null;
        NationalCode: string | null;
        PersonCode: string | null;
    }[];
}

export type GraftingListResponse = {
    status: "ok" | "error";
    message?: string;
    data?: GraftingOperationWithDetails[];
};

export type GraftingActionResponse = {
    status: "ok" | "error";
    message: string;
    id?: number;
};
