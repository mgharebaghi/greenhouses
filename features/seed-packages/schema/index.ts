import {
  optionalDate,
  sqlDecimal,
  recordIdSchema,
  sqlInteger,
} from "@/shared/validation/input";
import { z } from "zod";

const supplierSchema = z.object({
  ID: z.number(),
  CompanyName: z.string().nullable(),
  FirstName: z.string().nullable(),
  LastName: z.string().nullable(),
  Legal: z.boolean().nullable(),
});

const varietySchema = z.object({
  ID: z.number(),
  VarietyName: z.string(),
});

export const seedPackageSchema = z.object({
  ID: z.number().optional(),
  SupplierID: recordIdSchema.nullish(),
  ProducerCompany: z.string().max(150).optional().nullable(),
  CropVariety: recordIdSchema,
  GerminationRate: sqlInteger
    .min(0, "درصد باید مثبت باشد")
    .max(100, "درصد نمی‌تواند بیش از ۱۰۰ باشد")
    .optional()
    .nullable(),
  PurityPercent: sqlInteger.min(0).max(100).optional().nullable(),
  PackageNumber: sqlInteger.nonnegative().optional().nullable(),
  ProductionDate: optionalDate,
  ExpirationDate: optionalDate,
  QualityGrade: z.string().max(50).optional().nullable(),
  SerialNumber: z.string().min(1, "شماره سریال بسته الزامی است").max(50),
  PackageType: z.string().max(50).optional().nullable(),
  SeedCount: sqlInteger.min(0).optional().nullable(),
  WeightGram: sqlDecimal(8, 2).nonnegative().nullish(),
  PackagingDate: optionalDate,
  IsCertified: z.boolean().optional().nullable(),

  // فیلدهای رابطه‌ای (Relations) که از Include در پریزما می‌آیند
  Tbl_suppliers: supplierSchema.optional().nullable(),
  Tbl_plantVariety: varietySchema.optional().nullable(),
});

// استخراج تایپ از اسکیما
export type SeedPackageDTO = z.infer<typeof seedPackageSchema>;
export const productionCalendarSchema = z
  .enum(["persian", "gregorian"])
  .default("persian");
export const seedPackageInputSchema = seedPackageSchema
  .omit({
    ID: true,
    ExpirationDate: true,
    Tbl_suppliers: true,
    Tbl_plantVariety: true,
  })
  .extend({ ProductionCalendar: productionCalendarSchema });
