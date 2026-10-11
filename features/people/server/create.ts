"use server";
import { actionError } from "@/server/actions/errors";
import { requireSession } from "@/server/auth/require-session";
import { serializableTransaction } from "@/server/db/transaction";
import { parseInput } from "@/shared/validation/input";
import { revalidatePath } from "next/cache";
import { nextPersonCode } from "../domain/person-code";
import { personInputSchema, peopleReadDTO } from "../schema";
import type { PersonActionResponse } from "../types";

export async function createPerson(
  input: unknown,
): Promise<PersonActionResponse> {
  try {
    await requireSession();
    const data = parseInput(
      personInputSchema.omit({ PersonCode: true }),
      input,
    );
    const person = await serializableTransaction(async (tx) => {
      const previous = await tx.tbl_People.findFirst({
        orderBy: { ID: "desc" },
        select: { PersonCode: true },
      });
      const PersonCode = nextPersonCode(previous?.PersonCode);
      return tx.tbl_People.create({
        data: { ...data, PersonCode },
        include: { Tbl_PeoplePosts: { select: { PostName: true, ID: true } } },
      });
    });
    revalidatePath("/dashboard/people");
    return {
      status: "ok",
      message: "اطلاعات با موفقیت ثبت شد.",
      dta: [peopleReadDTO.parse(person)],
    };
  } catch (error) {
    return actionError(error);
  }
}
