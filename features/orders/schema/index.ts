import { z } from "zod";

export const orderSchema = z.object({
    ID: z.number().optional(),
    OrderCode: z.string().min(1, "کد سفارش الزامی است").optional().nullable(),
    CustomerID: z.number().min(1, "انتخاب مشتری الزامی است").nullable(),
    SupplierID: z.number().min(1, "انتخاب تامین کننده الزامی است").nullable(),
    ProjectManager: z.number().min(1, "انتخاب مدیر پروژه الزامی است").nullable(),
    OrderDate: z.any().optional().nullable(), // Will handle Date object or string
    OrderCount: z.number().min(1, "تعداد سفارش باید حداقل ۱ باشد").nullable(),
    RootstockID: z.number().nullable().optional(),
    ScionID: z.number().nullable().optional(),
});

export type OrderInput = z.infer<typeof orderSchema>;
