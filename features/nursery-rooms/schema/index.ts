import {
  optionalDate,
  optionalText,
  sqlDecimal,
} from "@/shared/validation/input";
import { z } from "zod";
export const nurseryRoomInputSchema = z.object({
  NurseryRoomCode: z.string().min(1).max(50),
  NurseryRoomName: z.string().min(1).max(100),
  TemperatureMin: sqlDecimal(5, 2).nullish(),
  TemperatureMax: sqlDecimal(5, 2).nullish(),
  HumidityMin: sqlDecimal(5, 2).nullish(),
  HumidityMax: sqlDecimal(5, 2).nullish(),
  LightType: optionalText(50),
  LightHoursPerDay: sqlDecimal(4, 1).nullish(),
  CO2Range: optionalText(50),
  StrelizationMethod: optionalText(200),
  NurseryRoomCreatedAt: optionalDate,
});
