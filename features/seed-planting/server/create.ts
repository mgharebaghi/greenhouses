"use server";
import { actionError } from "@/server/actions/errors";
import { requireSession } from "@/server/auth/require-session";
import { parseInput } from "@/shared/validation/input";
import { seedPlantingInputSchema } from "../schema";

import { prisma } from "@/server/db/prisma";
import { revalidatePath } from "next/cache";

export async function createSeedPlanting(input: unknown) {
  try {
    await requireSession();
    const data = parseInput(seedPlantingInputSchema, input);
    // Basic validation or transformation could happen here
    // Connect relations if they are passed as IDs

    // Ensure numeric fields are numbers
    const payload = {
      OrderID: Number(data.OrderID),
      GreenhouseID: data.GreenhouseID ? Number(data.GreenhouseID) : null,
      SeedType: Boolean(data.SeedType), // 0 or 1
      PlantingDate: data.PlantingDate ? new Date(data.PlantingDate) : null,
      SeedPlantingNumber: Number(data.SeedPlantingNumber),
      TrayNumber: Number(data.TrayNumber),
      CellPerTrayNumber: Number(data.CellPerTrayNumber),
      CellHeight: Number(data.CellHeight),
      TrayMaterial: data.TrayMaterial,
      PlantingBed: data.PlantingBed,
      PlantingBedRatio: data.PlantingBedRatio
        ? Number(data.PlantingBedRatio)
        : null,
      GerminationDate: data.GerminationDate
        ? new Date(data.GerminationDate)
        : null,
      TechnicianID: data.TechnicianID ? Number(data.TechnicianID) : null,
    };

    await prisma.tbl_SeedPlanting.create({
      data: payload,
    });

    revalidatePath("/dashboard/seed-planting");
    return { status: "ok", message: "کاشت با موفقیت ثبت شد" };
  } catch (error) {
    return actionError(error);
  }
}
