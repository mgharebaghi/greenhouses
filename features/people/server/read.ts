"use server";
import { requireSession } from "@/server/auth/require-session";

import { prisma } from "@/server/db/prisma";
import { z } from "zod";
import { peopleReadDTO } from "../schema";
import { PersonActionResponse, PersonPostResponse } from "../types";

export async function getPeople(): Promise<PersonActionResponse> {
  await requireSession();
  const people = await prisma.tbl_People.findMany({
    include: {
      Tbl_PeoplePosts: { select: { PostName: true, ID: true } },
    },
    orderBy: { ID: "desc" },
  });

  if (!people) {
    return {
      status: "error",
      message: "جدول اشخاص خالی میباشد",
    };
  }

  const peopleParsed = z.array(peopleReadDTO).parse(people);

  return {
    status: "ok",
    message: "مالکین با موفقیت دریافت شد",
    dta: peopleParsed,
  };
}

export async function getPersonsPosts(): Promise<PersonPostResponse> {
  await requireSession();
  const posts = await prisma.tbl_PeoplePosts.findMany({});

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
  await requireSession();
  const lastPerson = await prisma.tbl_People.findFirst({
    orderBy: { ID: "desc" },
    select: { PersonCode: true },
  });

  if (!lastPerson) {
    return "0";
  }

  return lastPerson.PersonCode || "0";
}
