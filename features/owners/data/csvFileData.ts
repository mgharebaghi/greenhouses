import { getAllOwners, OwnerResponse } from "@/features/owners/services";
import type { Tbl_People } from "@/app/generated/prisma";
import { PeopleReadDTO } from "../schema";

export type OwnerRawArray = Awaited<ReturnType<typeof getAllOwners>>;
export type OwnerFlattened = {
  FirstName: string | null;
  LastName: string | null;
  EmailAddress: string | null;
  PhoneNumber: string | null;
  Profesion: string | null;
  PersonCode: string | null;
  PostName: string | null;
};

export async function ownersCSVData(source?: PeopleReadDTO[]): Promise<OwnerFlattened[]> {
  const data = source ?? (await getAllOwners()).dta ?? [];
  return data.map((item: PeopleReadDTO) => ({
    FirstName: item.FirstName,
    LastName: item.LastName,
    EmailAddress: item.EmailAddress,
    PhoneNumber: item.PhoneNumber,
    Profesion: item.Profesion,
    PersonCode: item.PersonCode,
    PostName: item.PostName,
  }));
}

export const headers = [
  { displayLabel: "نام", key: "FirstName" },
  { displayLabel: "نام خانوادگی", key: "LastName" },
  { displayLabel: "آدرس ایمیل", key: "EmailAddress" },
  { displayLabel: "شماره تماس", key: "PhoneNumber" },
  { displayLabel: "تخصص", key: "Profesion" },
];
