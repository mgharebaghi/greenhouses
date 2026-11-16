import {
  calendarDateSchema,
  optionalCount,
  sqlInteger,
} from "@/shared/validation/input";
import { z } from "zod";

export const startSeedlingCycleSchema = z.object({
  OrderID: sqlInteger.positive(),
  SeedType: z.boolean(),
  GerminationRoomExitDate: calendarDateSchema,
  NumberOfLostSeedlingFromGermination: optionalCount,
  GreenhouseEntryDate: calendarDateSchema,
  NumberOfTrays: optionalCount,
  GreenhouseID: sqlInteger.positive(),
  SalonName: z.string().max(50).optional(),
  GreenhouseExitDate: calendarDateSchema.nullish(),
  NumberOfLostSeedlingFromGreenhouse: optionalCount,
});

export type StartSeedlingCycleFormValues = z.input<
  typeof startSeedlingCycleSchema
>;
