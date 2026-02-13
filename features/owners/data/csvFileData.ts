import { getAllOwners, OwnerResponse } from "@/features/owners/services";
import type { Tbl_People } from "@/app/generated/prisma";

export type OwnerRawArray = Awaited<ReturnType<typeof getAllOwners>>;
export type OwnerFlattened = Tbl_People;

export async function ownersCSVData(source?: Tbl_People[]): Promise<OwnerFlattened[]> {
  if (source) {
    return source.map((item: Tbl_People) => ({ ...item }));
  }
  const data: OwnerResponse = await getAllOwners();
  return data.dta?.map((item: Tbl_People) => ({ ...item })) ?? [];
}

export const headers = [
  { displayLabel: "نام", key: "FirstName" },
  { displayLabel: "نام خانوادگی", key: "LastName" },
  { displayLabel: "آدرس ایمیل", key: "EmailAddress" },
  { displayLabel: "شماره تماس", key: "PhoneNumber" },
  { displayLabel: "تخصص", key: "Profesion" },
];
