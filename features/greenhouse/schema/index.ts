import { z } from "zod";

export const createGreenHouseSchema = z.object({
    GreenhouseName: z.string().min(1, "نام گلخانه الزامی است"),
    OwnerID: z.number().min(1, "شناسه مالک الزامی است"),
    GreenhouseAddress: z.string().min(1, "آدرس گلخانه الزامی است"),
    Notes: z.string().optional(),
    GreenhouseType: z.string().optional(),
    AreaSqM: z.number().optional(),
    ConstructionDate: z.date().optional(),
    IsActive: z.boolean().optional(),
});