import {
  optionalCount,
  optionalText,
  recordIdSchema,
} from "@/shared/validation/input";
import { z } from "zod";
export const growthStageInputSchema = z.object({
  VarietyID: recordIdSchema,
  StageOrder: z.number().int().positive(),
  StageName: z.string().min(1).max(100),
  EntryCriteria: optionalText(100),
  ExitCriteria: optionalText(100),
  note: optionalText(500),
  StartDay: optionalCount,
  EndDay: optionalCount,
});
export type GrowthStageInput = z.infer<typeof growthStageInputSchema>;
