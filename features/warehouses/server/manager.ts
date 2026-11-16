import { prisma } from "@/server/db/prisma";
import { InputValidationError } from "@/shared/validation/input";
import "server-only";

export function managerName(person: {
  FirstName: string | null;
  LastName: string | null;
}) {
  return [person.FirstName?.trim(), person.LastName?.trim()]
    .filter(Boolean)
    .join(" ");
}

export async function resolveManagerName(id: number | null | undefined) {
  if (id == null) return id;

  const person = await prisma.tbl_People_Companies.findFirst({
    where: { ID: id, Legal: false },
    select: { FirstName: true, LastName: true },
  });
  const name = person ? managerName(person) : "";
  if (!name || name.length > 150)
    throw new InputValidationError({
      WarehouseManagerID: ["یک شخص حقیقی با نام معتبر انتخاب کنید."],
    });
  return name;
}
