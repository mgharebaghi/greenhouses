import {
  optionalCount,
  optionalId,
  optionalText,
  sqlDecimal,
} from "@/shared/validation/input";
import { z } from "zod";
export const varietyInputSchema = z.object({
  PlantID: optionalId,
  VarietyName: z.string().min(1).max(200),
  DaysToGermination: optionalCount,
  DaysToSprout: optionalCount,
  DaysToSeedling: optionalCount,
  DaysToMaturity: optionalCount,
  IdealTempMin: sqlDecimal(6, 2).nullish(),
  IdealTempMax: sqlDecimal(6, 2).nullish(),
  IdealHumidityMin: sqlDecimal(6, 2).nullish(),
  IdealHumidityMax: sqlDecimal(6, 2).nullish(),
  LightRequirement: optionalText(100),
  Notes: optionalText(500),
});
export type VarietyInput = z.infer<typeof varietyInputSchema>;
