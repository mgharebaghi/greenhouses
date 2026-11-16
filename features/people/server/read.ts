"use server";
import { readError } from "@/server/actions/errors";
import { requireSession } from "@/server/auth/require-session";

import { prisma } from "@/server/db/prisma";
import { z } from "zod";
import { peopleReadDTO } from "../schema";
import { PersonActionResponse, PersonPostResponse } from "../types";

export async function getPeople(): Promise<PersonActionResponse> {
  try {
    await requireSession();
    const people = await prisma.tbl_People_Companies.findMany({
      include: {
        Tbl_PeoplePosts: { select: { PostName: true, ID: true } },
      },
      orderBy: { ID: "desc" },
    });

    const peopleParsed = z.array(peopleReadDTO).parse(people);

    return {
      status: "ok",
      message: "اشخاص با موفقیت دریافت شدند",
      dta: peopleParsed,
    };
  } catch (error) {
    throw readError(error);
  }
}

// Existing order and greenhouse foreign keys reference Tbl_People.
export async function getLegacyPersonOptions() {
  try {
    await requireSession();
    return await prisma.tbl_People.findMany({
      select: { ID: true, FirstName: true, LastName: true, NationalCode: true },
      orderBy: { ID: "desc" },
    });
  } catch (error) {
    throw readError(error);
  }
}

export async function getPersonsPosts(): Promise<PersonPostResponse> {
  try {
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
  } catch (error) {
    throw readError(error);
  }
}

export async function getLastPersonCode(): Promise<string> {
  try {
    await requireSession();
    const lastPerson = await prisma.tbl_People_Companies.findFirst({
      orderBy: { ID: "desc" },
      select: { PersonCode: true },
    });

    if (!lastPerson) {
      return "0";
    }

    return lastPerson.PersonCode || "0";
  } catch (error) {
    throw readError(error);
  }
}
