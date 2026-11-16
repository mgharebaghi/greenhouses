import { calendarDateSchema, sqlInteger } from "@/shared/validation/input";
import { z } from "zod";

// Worker Schema (Nested in Grafting Operation)
export const graftingWorkerSchema = z.object({
  PersonID: sqlInteger.positive(),
  // PersonCode is display-only
});

// Grafting Operation Schema
export const createGraftingOperationSchema = z.object({
  OrderID: sqlInteger.positive(),
  ColdRoomExitDate: calendarDateSchema,
  GraftingDate: calendarDateSchema,

  // Tray Information
  TrayNumber: sqlInteger.min(1, "حداقل ۱ سینی"),
  CellPerTrayNumber: sqlInteger.min(1, "حداقل ۱ حفره"),
  CellHeight: sqlInteger.min(1),
  TrayMaterial: z.string().max(50),

  // Planting Information
  PlantingBed: z.string().max(50),
  PlantingBedRatio: z.number().optional().nullable(),

  // Tools
  GraftingClamp: z.string().max(50),
  GraftingStick: z.string().max(50),

  // Personnel
  GraftingTechnicianID: sqlInteger.positive(),

  // Workers List
  Workers: z
    .array(graftingWorkerSchema)
    .refine(
      (workers) =>
        new Set(workers.map((worker) => worker.PersonID)).size ===
        workers.length,
      "هر کارگر فقط یک بار انتخاب شود.",
    )
    .optional(),
});
