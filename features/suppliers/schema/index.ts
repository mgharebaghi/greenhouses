import { optionalText } from "@/shared/validation/input";
import { z } from "zod";
export const supplierInputSchema = z.object({
  Legal: z.boolean().nullish(),
  CompanyName: optionalText(150),
  BrandName: optionalText(150),
  SupplierCountry: optionalText(150),
  SupplierCity: optionalText(150),
  FirstName: optionalText(150),
  LastName: optionalText(150),
  ContactEmail: optionalText(150),
  ContactTel: optionalText(50),
  CompanyAddress: z.string().nullish(),
  LicenseNumber: optionalText(50),
});
export type SupplierInput = z.infer<typeof supplierInputSchema>;
