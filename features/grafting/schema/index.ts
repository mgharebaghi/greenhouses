import { z } from "zod";

// Worker Schema (Nested in Grafting Operation)
export const graftingWorkerSchema = z.object({
    PersonID: z.number(),
    // PersonCode is display-only
});

// Grafting Operation Schema
export const createGraftingOperationSchema = z.object({
    OrderID: z.number(),
    ColdRoomExitDate: z.date(),
    GraftingDate: z.date(),

    // Tray Information
    TrayNumber: z.number().min(1, "حداقل ۱ سینی"),
    CellPerTrayNumber: z.number().min(1, "حداقل ۱ حفره"),
    CellHeight: z.number().min(1),
    TrayMaterial: z.string(),

    // Planting Information
    PlantingBed: z.string(),
    PlantingBedRatio: z.number().optional().nullable(),

    // Tools
    GraftingClamp: z.string(),
    GraftingStick: z.string(),

    // Personnel
    GraftingTechnicianID: z.number(),

    // Workers List
    Workers: z.array(graftingWorkerSchema).optional(),
});
