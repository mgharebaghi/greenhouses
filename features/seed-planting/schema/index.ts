import {
  optionalDate,
  optionalId,
  optionalNumber,
  optionalText,
  recordIdSchema,
} from "@/shared/validation/input";
import { z } from "zod";
export const seedPlantingInputSchema = z.object({
  OrderID: recordIdSchema,
  GreenhouseID: optionalId,
  SeedType: z.boolean(),
  PlantingDate: optionalDate,
  SeedPlantingNumber: z.number().int().nonnegative(),
  TrayNumber: z.number().int().nonnegative(),
  CellPerTrayNumber: z.number().int().nonnegative(),
  CellHeight: z.number().int().nonnegative(),
  TrayMaterial: optionalText(50),
  PlantingBed: optionalText(50),
  PlantingBedRatio: optionalNumber,
  GerminationDate: optionalDate,
  TechnicianID: optionalId,
});
