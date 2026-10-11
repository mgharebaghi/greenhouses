import {
  optionalDate,
  optionalText,
  recordIdSchema,
} from "@/shared/validation/input";
import { z } from "zod";
export const seedWarehousingInputSchema = z.object({
  SeedPackageID: recordIdSchema,
  WarehouseID: recordIdSchema,
  TransactionType: z
    .union([z.boolean(), z.literal("true"), z.literal("false")])
    .transform((value) => value === true || value === "true"),
  PackageQuantity: z.number().int().nonnegative(),
  TransactionDate: optionalDate,
  DestinationType: optionalText(50),
  RecordedBy: optionalText(150),
});
