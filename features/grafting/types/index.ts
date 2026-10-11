import type {
  GraftingOperationRecord,
  GraftWorkerRecord,
} from "@/features/grafting/types/record";
import type { OrderRecord } from "@/features/orders/types/record";
import type { PersonRecord } from "@/features/people/types/record";
import { z } from "zod";
import { createGraftingOperationSchema } from "../schema";

export type GraftingCreateDTO = z.infer<typeof createGraftingOperationSchema>;

export type GraftingOperationWithDetails = GraftingOperationRecord & {
  Tbl_Orders: OrderRecord | null;
  Tbl_People: PersonRecord | null; // Technician
  Tbl_GraftWorkers: (GraftWorkerRecord & {
    Tbl_People: PersonRecord | null;
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

export type * from "./record";
