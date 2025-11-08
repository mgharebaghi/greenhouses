import { getAllOwners } from "@/app/lib/services/owners";
import type { Owner_Observer } from "@/app/generated/prisma";

export type OwnerRawArray = Awaited<ReturnType<typeof getAllOwners>>;
export type OwnerFlattened = Owner_Observer;

export async function ownersCSVData(source?: OwnerRawArray): Promise<OwnerFlattened[]> {
  const data = source ?? (await getAllOwners());
  return data.map((item) => ({ ...item }));
}

export const headers = [
  { displayLabel: "نام", key: "FirstName" },
  { displayLabel: "نام خانوادگی", key: "LastName" },
  { displayLabel: "شماره تماس", key: "PhoneNumber" },
  { displayLabel: "تخصص", key: "Profesion" },
];
