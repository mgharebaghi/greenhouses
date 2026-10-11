import {
  optionalCount,
  optionalId,
  optionalNumber,
  optionalText,
} from "@/shared/validation/input";
import { z } from "zod";
export const varietyInputSchema = z.object({
  PlantID: optionalId,
  VarietyName: z.string().min(1).max(200),
  DaysToGermination: optionalCount,
  DaysToSprout: optionalCount,
  DaysToSeedling: optionalCount,
  DaysToMaturity: optionalCount,
  IdealTempMin: optionalNumber,
  IdealTempMax: optionalNumber,
  IdealHumidityMin: optionalNumber,
  IdealHumidityMax: optionalNumber,
  LightRequirement: optionalText(100),
  Notes: optionalText(500),
});
export type VarietyInput = z.infer<typeof varietyInputSchema>;
