import { optionalText } from "@/shared/validation/input";
import { z } from "zod";
export const plantInputSchema = z.object({
  CommonName: z.string().min(1).max(150),
  ScientificName: z.string().min(1).max(250),
  PlantFamily: z.string().min(1).max(150),
  Notes: optionalText(500),
});
export type PlantInput = z.infer<typeof plantInputSchema>;
