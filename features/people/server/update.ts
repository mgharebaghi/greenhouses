"use server";
import { actionError } from "@/server/actions/errors";
import { requireSession } from "@/server/auth/require-session";
import { prisma } from "@/server/db/prisma";
import { parseInput, recordIdSchema } from "@/shared/validation/input";
import { revalidatePath } from "next/cache";
import { personInputSchema, peopleReadDTO } from "../schema";
import type { PersonActionResponse } from "../types";

export async function updatePerson(params: {
  id: number;
  data: unknown;
}): Promise<PersonActionResponse> {
  try {
    await requireSession();
    const id = parseInput(recordIdSchema, params?.id);
    const data = parseInput(personInputSchema, params.data);
    const person = await prisma.tbl_People.update({
      where: { ID: id },
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
