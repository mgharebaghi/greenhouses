import { getAllOwners } from "@/app/lib/services/owners";
import type { Tbl_People } from "@/app/generated/prisma";

export type OwnerRawArray = Awaited<ReturnType<typeof getAllOwners>>;
export type OwnerFlattened = Tbl_People;

export async function ownersCSVData(source?: OwnerRawArray): Promise<OwnerFlattened[]> {
  const data = source ?? (await getAllOwners());
  return data.dta.map((item: Tbl_People) => ({ ...item }));
}

export const headers = [
  { displayLabel: "نام", key: "FirstName" },
  { displayLabel: "نام خانوادگی", key: "LastName" },
  { displayLabel: "شماره تماس", key: "PhoneNumber" },
  { displayLabel: "تخصص", key: "Profesion" },
];
