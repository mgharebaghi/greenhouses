import type { PeopleReadDTO, OwnerInput } from "../schema";
import { Tbl_PeoplePosts } from "@/app/generated/prisma";

export type OwnerResponse = {
  status: "ok" | "error";
  message: string;
  dta?: PeopleReadDTO[];
  fieldErrors?: Partial<Record<keyof OwnerInput, string[]>>;
};

export type OwnerCreateDTO = OwnerInput;

export type PersonPostResponse = {
  status: "ok" | "error";
  message: string;
  dta?: Tbl_PeoplePosts[];
};
