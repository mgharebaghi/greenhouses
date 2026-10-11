import { optionalDate } from "@/shared/validation/input";
import { z } from "zod";

const supplierSchema = z.object({
  ID: z.number(),
  CompanyName: z.string(),
  FirstName: z.string(),
  LastName: z.string(),
  Legal: z.boolean(),
});

const varietySchema = z.object({
  ID: z.number(),
  VarietyName: z.string(),
});

export const seedPackageSchema = z.object({
  ID: z.number().optional(),
  SupplierID: z.number().nullable().optional(),
  ProducerCompany: z.string().max(150).optional().nullable(),
  CropVariety: z.number().min(1, "واریته الزامی است"),
  GerminationRate: z
    .number()
    .int()
    .min(0, "درصد باید مثبت باشد")
    .max(100, "درصد نمی‌تواند بیش از ۱۰۰ باشد")
    .optional()
    .nullable(),
  PurityPercent: z.number().int().min(0).max(100).optional().nullable(),
  PackageNumber: z.number().int().nonnegative().optional().nullable(),
  ProductionDate: optionalDate,
  ExpirationDate: optionalDate,
  QualityGrade: z.string().max(50).optional().nullable(),
  SerialNumber: z.string().min(1, "شماره سریال بسته الزامی است").max(50),
  PackageType: z.string().max(50).optional().nullable(),
  SeedCount: z.number().int().min(0).optional().nullable(),
  WeightGram: z.number().min(0).optional().nullable(),
  PackagingDate: optionalDate,
  IsCertified: z.boolean().optional().nullable(),

  // فیلدهای رابطه‌ای (Relations) که از Include در پریزما می‌آیند
  Tbl_suppliers: supplierSchema.optional().nullable(),
  Tbl_plantVariety: varietySchema.optional().nullable(),
});

// استخراج تایپ از اسکیما
export type SeedPackageDTO = z.infer<typeof seedPackageSchema>;
export const seedPackageInputSchema = seedPackageSchema.omit({
  ID: true,
  Tbl_suppliers: true,
  Tbl_plantVariety: true,
});
