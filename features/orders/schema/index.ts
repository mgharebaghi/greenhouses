import {
  optionalDate,
  recordIdSchema,
  sqlInteger,
} from "@/shared/validation/input";
import { z } from "zod";

export const orderSchema = z.object({
  ID: z.number().optional(),
  OrderCode: z
    .string()
    .min(1, "کد سفارش الزامی است")
    .max(10)
    .optional()
    .nullable(),
  CustomerID: recordIdSchema.nullable(),
  SupplierID: recordIdSchema.nullable(),
  ProjectManager: recordIdSchema.nullable(),
  OrderDate: optionalDate,
  OrderCount: sqlInteger.min(1, "تعداد سفارش باید حداقل ۱ باشد").nullable(),
  RootstockID: recordIdSchema.nullish(),
  ScionID: recordIdSchema.nullish(),
});

export type OrderInput = z.infer<typeof orderSchema>;
export const orderInputSchema = orderSchema.omit({ ID: true });
