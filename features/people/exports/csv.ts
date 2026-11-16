import type { getPeople } from "@/features/people/actions";
import { PeopleReadDTO } from "../schema";

export type PeopleRawArray = Awaited<ReturnType<typeof getPeople>>;
export type PersonCsvRow = {
  FirstName: string | null;
  LastName: string | null;
  CompanyName: string | null;
  PersonType: string;
  EmailAddress: string | null;
  PhoneNumber: string | null;
  Profesion: string | null;
  PersonCode: string | null;
  PostName: string | null;
};

export async function peopleCSVData(
  source?: PeopleReadDTO[],
): Promise<PersonCsvRow[]> {
  const data = source ?? [];
  return data.map((item: PeopleReadDTO) => ({
    FirstName: item.FirstName,
    LastName: item.LastName,
    CompanyName: item.CompanyName,
    PersonType: item.Legal ? "حقوقی" : "حقیقی",
    EmailAddress: item.EmailAddress,
    PhoneNumber: item.PhoneNumber,
    Profesion: item.Profession,
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
  { displayLabel: "نوع شخص", key: "PersonType" },
  { displayLabel: "نام شرکت", key: "CompanyName" },
];
