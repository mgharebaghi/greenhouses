import {
  optionalCount,
  optionalDate,
  optionalText,
} from "@/shared/validation/input";
import { z } from "zod";
export const warehouseInputSchema = z.object({
  WarehouseCode: z.string().min(1).max(50),
  WarehouseName: z.string().min(1).max(150),
  WarehouseLocation: optionalText(200),
  TemperatureRange: optionalText(50),
  HumidityRange: optionalText(50),
  Capacity: optionalCount,
  WarehouseManagerName: optionalText(150),
  WarehouseCreatedAt: optionalDate,
});
