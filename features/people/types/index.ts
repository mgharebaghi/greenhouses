import type { PeoplePostRecord } from "@/features/people/types/record";
import type { PersonInput, PeopleReadDTO } from "../schema";

export type PersonActionResponse = {
  status: "ok" | "error";
  message: string;
  dta?: PeopleReadDTO[];
  fieldErrors?: Partial<Record<keyof PersonInput, string[]>>;
};

export type PersonCreateDTO = PersonInput;

export type PersonPostResponse = {
  status: "ok" | "error";
  message: string;
  dta?: PeoplePostRecord[];
};

export type * from "./record";
