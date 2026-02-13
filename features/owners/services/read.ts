"use server";

import { prisma } from "@/lib/singletone";
import { OwnerResponse, PersonPostResponse } from "../types";
import { peopleReadDTO } from "../schema";
import { z } from "zod";

export async function getAllOwners(): Promise<OwnerResponse> {
  const peaples = await prisma.tbl_People.findMany({
    include: {
      Tbl_PeoplePosts: { select: { PostName: true, ID: true } }
    },
    orderBy: { ID: "desc" }
  });

  if (!peaples) {
    return {
      status: "error",
      message: "جدول اشخاص خالی میباشد",
    };
  }

  let peopleParsed = z.array(peopleReadDTO).parse(peaples);

  return {
    status: "ok",
    message: "مالکین با موفقیت دریافت شد",
    dta: peopleParsed,
  };
}

export async function getPersonsPosts(): Promise<PersonPostResponse> {
  const posts = await prisma.tbl_PeoplePosts.findMany({
  });

  if (!posts) {
    return {
      status: "error",
      message: "جدول اشخاص خالی میباشد",
    };
  }

  return {
    status: "ok",
    message: "سمت ها با موفقیت دریافت شد",
    dta: posts,
  };
}

export async function getLastPersonCode(): Promise<string> {
  const lastPerson = await prisma.tbl_People.findFirst({
    orderBy: { ID: "desc" },
    select: { PersonCode: true }
  });

  if (!lastPerson) {
    return "0";
  }

  return lastPerson.PersonCode || "0";
}
