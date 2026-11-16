import { recordIdSchema } from "@/shared/validation/input";
import { toLatinDigits } from "@/shared/utils/digits";
import { normalizeIranianPhone } from "@/shared/utils/phone";
import { z } from "zod";

const optionalSupplierText = (length: number) =>
  z
    .string()
    .trim()
    .max(length)
    .nullish()
    .transform((value) => (value === "" ? null : value));

export function supplierPhoneNumber(
  phone: string,
  country: string | null | undefined,
) {
  const isIran =
    /^(?:ایران|ايران|جمهوری اسلامی ایران|iran|islamic republic of iran)$/i.test(
      country?.trim() ?? "",
    );
  return isIran ? normalizeIranianPhone(phone) : toLatinDigits(phone);
}

export const supplierFieldsSchema = z.object({
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

export const supplierInputSchema = supplierFieldsSchema.transform((input) => ({
  ...input,
  ContactTel: supplierPhoneNumber(input.ContactTel, input.SupplierCountry),
}));
export type SupplierInput = z.infer<typeof supplierInputSchema>;
