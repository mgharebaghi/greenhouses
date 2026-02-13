"use server";
import { Tbl_People } from "@/app/generated/prisma";
import { OwnerCreateDTO, OwnerResponse } from "../types";
import { prisma } from "@/lib/singletone";
import { peopleReadDTO } from "../schema";

export async function createOwner(data: OwnerCreateDTO): Promise<OwnerResponse> {
  if (!data.FirstName || !data.LastName || !data.PhoneNumber || !data.Profesion) {
    return { status: "error", message: "لطفاً تمام فیلدها را پر کنید." };
  }

  const insert = await prisma.tbl_People.create({
    data: {
      FirstName: data.FirstName,
      LastName: data.LastName,
      PhoneNumber: data.PhoneNumber,
      Profesion: data.Profesion,
      PostID: data.PostID,
      EmailAddress: data.EmailAddress,
      NationalCode: data.NationalCode,
      PersonCode: data.PersonCode,
    },
    include: {
      Tbl_PeoplePosts: {
        select: {
          PostName: true,
          ID: true
        }
      }
    }
  });

  if (insert) {
    const parsed = peopleReadDTO.parse(insert);
    return { status: "ok", message: "اطلاعات با موفقیت ثبت شد.", dta: [parsed] };
  } else {
    return { status: "error", message: "خطایی در ثبت اطلاعات رخ داد. لطفاً دوباره تلاش کنید." };
  }
}
