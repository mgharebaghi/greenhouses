import { z } from "zod";

// Worker Schema (Nested in Grafting Operation)
export const graftingWorkerSchema = z.object({
  PersonID: z.number().int().positive(),
  // PersonCode is display-only
});

// Grafting Operation Schema
export const createGraftingOperationSchema = z.object({
  OrderID: z.number().int().positive(),
  ColdRoomExitDate: z.date(),
  GraftingDate: z.date(),

  // Tray Information
  TrayNumber: z.number().int().min(1, "حداقل ۱ سینی"),
  CellPerTrayNumber: z.number().int().min(1, "حداقل ۱ حفره"),
  CellHeight: z.number().int().min(1),
  TrayMaterial: z.string().max(50),

  // Planting Information
  PlantingBed: z.string().max(50),
  PlantingBedRatio: z.number().optional().nullable(),

  // Tools
  GraftingClamp: z.string().max(50),
  GraftingStick: z.string().max(50),

  // Personnel
  GraftingTechnicianID: z.number().int().positive(),

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
