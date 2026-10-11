import {
  optionalDate,
  optionalText,
  recordIdSchema,
} from "@/shared/validation/input";
import { z } from "zod";

export const greenhouseInputSchema = z.object({
  GreenhouseName: z.string().min(1, "نام گلخانه الزامی است").max(150),
  OwnerID: recordIdSchema,
  GreenhouseAddress: z.string().min(1, "آدرس گلخانه الزامی است").max(250),
  Notes: optionalText(500),
  GreenhouseType: optionalText(150),
  AreaSqM: z.number().nonnegative().nullish(),
  ConstructionDate: optionalDate,
  IsActive: z.boolean().nullish(),
});
