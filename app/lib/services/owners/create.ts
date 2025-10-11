"use server";
import { Owner_Observer } from "@/app/generated/prisma";
import { OwnerResponse } from "./types";
import { prisma } from "@/app/lib/singletone";

export async function createOwner(data: Owner_Observer): Promise<OwnerResponse> {
  if (!data.FirstName || !data.LastName || !data.PhoneNumber || !data.Profesion) {
    return { status: "error", message: "لطفاً تمام فیلدها را پر کنید." };
  }

  const insert = await prisma.owner_Observer.create({
    data: {
      FirstName: data.FirstName,
      LastName: data.LastName,
      PhoneNumber: data.PhoneNumber,
      Profesion: data.Profesion,
    },
  });

  if (insert) {
    return { status: "ok", message: "اطلاعات با موفقیت ثبت شد.", dta: insert };
  } else {
    return { status: "error", message: "خطایی در ثبت اطلاعات رخ داد. لطفاً دوباره تلاش کنید." };
  }
}
