import type { Prisma } from "@/app/generated/prisma";
import { InputValidationError } from "@/shared/validation/input";
import "server-only";
import type { SupplierInput } from "../schema";

const personIdentitySelect = {
  Legal: true,
  CompanyName: true,
  FirstName: true,
  LastName: true,
} satisfies Prisma.Tbl_People_CompaniesSelect;

export const supplierPersonOptionsSelect = {
  ID: true,
  PersonCode: true,
  ...personIdentitySelect,
} satisfies Prisma.Tbl_People_CompaniesSelect;

export const supplierIdentitySelect = {
  CompanyName: true,
  FirstName: true,
  LastName: true,
  Tbl_People_Companies: { select: personIdentitySelect },
} satisfies Prisma.Tbl_SuppliersSelect;

type SupplierIdentityRow = Prisma.Tbl_SuppliersGetPayload<{
  select: typeof supplierIdentitySelect;
}>;

export function serializeSupplier<T extends SupplierIdentityRow>(supplier: T) {
  const { Tbl_People_Companies: person, ...fields } = supplier;
  return {
    ...fields,
    Legal: person ? person.Legal === true : null,
    CompanyName: fields.CompanyName || person?.CompanyName || null,
    FirstName:
      person && person.Legal !== true ? person.FirstName : fields.FirstName,
    LastName:
      person && person.Legal !== true ? person.LastName : fields.LastName,
  };
}

export async function prepareSupplierWrite(
  tx: Prisma.TransactionClient,
  input: SupplierInput,
) {
  const person = await tx.tbl_People_Companies.findUnique({
    where: { ID: input.People_CompaniesID },
    select: { Legal: true },
  });
  if (!person)
    throw new InputValidationError({
      People_CompaniesID: ["شخص انتخاب‌شده دیگر موجود نیست."],
    });

  return {
    ...input,
    FirstName: person.Legal === true ? input.FirstName : null,
    LastName: person.Legal === true ? input.LastName : null,
  };
}
