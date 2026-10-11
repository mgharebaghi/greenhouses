import { z } from "zod";

export const startSeedlingCycleSchema = z.object({
  OrderID: z.number().int().positive(),
  SeedType: z.boolean(),
  GerminationRoomExitDate: z.date(),
  NumberOfLostSeedlingFromGermination: z.coerce
    .number()
    .int()
    .nonnegative()
    .optional(),
  GreenhouseEntryDate: z.date(),
  NumberOfTrays: z.coerce.number().int().nonnegative().optional(),
  GreenhouseID: z.number().int().positive(),
  SalonName: z.string().max(50).optional(),
  GreenhouseExitDate: z.date().optional().nullable(),
  NumberOfLostSeedlingFromGreenhouse: z.coerce
    .number()
    .int()
    .nonnegative()
    .optional(),
});

export type StartSeedlingCycleFormValues = z.infer<
  typeof startSeedlingCycleSchema
>;
