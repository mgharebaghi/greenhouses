import {
  optionalDate,
  optionalId,
  optionalNumber,
  optionalText,
  recordIdSchema,
  sqlInteger,
} from "@/shared/validation/input";
import { z } from "zod";
export const seedPlantingInputSchema = z.object({
  OrderID: recordIdSchema,
  GreenhouseID: optionalId,
  SeedType: z.boolean(),
  PlantingDate: optionalDate,
  SeedPlantingNumber: sqlInteger.nonnegative(),
  TrayNumber: sqlInteger.nonnegative(),
  CellPerTrayNumber: sqlInteger.nonnegative(),
  CellHeight: sqlInteger.nonnegative(),
  TrayMaterial: optionalText(50),
  PlantingBed: optionalText(50),
  PlantingBedRatio: optionalNumber,
  GerminationDate: optionalDate,
  TechnicianID: optionalId,
});
