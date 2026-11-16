"use server";
import { actionError } from "@/server/actions/errors";
import { requireSession } from "@/server/auth/require-session";
import { prisma } from "@/server/db/prisma";
import { parseInput, recordIdSchema } from "@/shared/validation/input";
import { revalidatePath } from "next/cache";
import { personUpdateSchema, peopleReadDTO } from "../schema";
import type { PersonActionResponse } from "../types";

export async function updatePerson(params: {
  id: number;
  data: unknown;
}): Promise<PersonActionResponse> {
  try {
    await requireSession();
    const id = parseInput(recordIdSchema, params?.id);
    const data = parseInput(personUpdateSchema, params.data);
    // An existing company may keep its historical identifier on unrelated edits.
    const keepNationalCode = data.Legal && data.NationalCode === undefined;
    const person = await prisma.tbl_People_Companies.update({
      where: { ID: id, ...(keepNationalCode ? { Legal: true } : {}) },
      data,
      include: { Tbl_PeoplePosts: { select: { PostName: true, ID: true } } },
    });
    revalidatePath("/dashboard/people");
    return {
      status: "ok",
      message: "اطلاعات با موفقیت ویرایش شد.",
      dta: [peopleReadDTO.parse(person)],
    };
  } catch (error) {
    return actionError(error);
  }
}
