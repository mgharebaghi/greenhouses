import { PeopleReadDTO } from "../schema";
import { Tbl_PeoplePosts } from "@/app/generated/prisma";

export type OwnerResponse = {
  status: "ok" | "error";
  message: string;
  dta?: PeopleReadDTO[];
};

export type OwnerCreateDTO = {
  FirstName: string;
  LastName: string;
  PhoneNumber: string;
  Profesion: string;
  PostID: number;
  EmailAddress: string;
  NationalCode: string;
  PersonCode: string;
};

export type PersonPostResponse = {
  status: "ok" | "error";
  message: string;
  dta?: Tbl_PeoplePosts[];
};
