import { z } from "zod";

export const startSeedlingCycleSchema = z.object({
    OrderID: z.number(),
    SeedType: z.boolean(),
    GerminationRoomExitDate: z.date(),
    NumberOfLostSeedlingFromGermination: z.coerce.number().optional(),
    GreenhouseEntryDate: z.date(),
    NumberOfTrays: z.coerce.number().optional(),
    GreenhouseID: z.number(),
    SalonName: z.string().optional(),
    GreenhouseExitDate: z.date().optional().nullable(),
    NumberOfLostSeedlingFromGreenhouse: z.coerce.number().optional(),
});

export type StartSeedlingCycleFormValues = z.infer<typeof startSeedlingCycleSchema>;
