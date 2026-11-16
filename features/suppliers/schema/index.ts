import { recordIdSchema } from "@/shared/validation/input";
import { z } from "zod";

const optionalSupplierText = (length: number) =>
  z
    .string()
    .trim()
    .max(length)
    .nullish()
    .transform((value) => (value === "" ? null : value));

export const supplierInputSchema = z.object({
  People_CompaniesID: recordIdSchema,
  CompanyName: optionalSupplierText(150),
  BrandName: optionalSupplierText(150),
  SupplierCountry: optionalSupplierText(150),
  SupplierCity: optionalSupplierText(150),
  FirstName: optionalSupplierText(150),
  LastName: optionalSupplierText(150),
  ContactEmail: optionalSupplierText(150),
  ContactTel: z.string().trim().min(1, "تلفن را وارد کنید.").max(50),
  CompanyAddress: z
    .string()
    .trim()
    .nullish()
    .transform((value) => (value === "" ? null : value)),
  LicenseNumber: optionalSupplierText(50),
});
export type SupplierInput = z.infer<typeof supplierInputSchema>;
