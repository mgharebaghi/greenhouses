import { tehranDayStart } from "@/shared/dates/calendar";
import {
  optionalText,
  recordIdSchema,
  sqlInteger,
} from "@/shared/validation/input";
import { z } from "zod";
export const seedWarehousingInputSchema = z.object({
  SeedPackageID: recordIdSchema,
  WarehouseID: recordIdSchema,
  TransactionType: z
    .union([z.boolean(), z.literal("true"), z.literal("false")])
    .transform((value) => value === true || value === "true"),
  PackageQuantity: sqlInteger.nonnegative(),
  TransactionDate: z
    .union([
      z.date(),
      z.iso.datetime({ offset: true }).transform((value) => new Date(value)),
      z.iso.date().transform(tehranDayStart),
    ])
    .nullish(),
  DestinationType: optionalText(50),
  RecordedBy: optionalText(150),
});
