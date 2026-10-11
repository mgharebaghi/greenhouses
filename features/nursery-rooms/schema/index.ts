import {
  optionalDate,
  optionalNumber,
  optionalText,
} from "@/shared/validation/input";
import { z } from "zod";
export const nurseryRoomInputSchema = z.object({
  NurseryRoomCode: z.string().min(1).max(50),
  NurseryRoomName: z.string().min(1).max(100),
  TemperatureMin: optionalNumber,
  TemperatureMax: optionalNumber,
  HumidityMin: optionalNumber,
  HumidityMax: optionalNumber,
  LightType: optionalText(50),
  LightHoursPerDay: optionalNumber,
  CO2Range: optionalText(50),
  StrelizationMethod: optionalText(200),
  NurseryRoomCreatedAt: optionalDate,
});
