"use server";

import { prisma } from "@/app/lib/singletone";

export type OwnersDeleteResponse = {
  status: "ok" | "error";
  message: string;
};

export async function deleteOwner(ownerId: number): Promise<OwnersDeleteResponse> {
  try {
    const deletation = await prisma.owner_Observer.delete({
      where: { ID: ownerId },
    });

    if (!deletation) {
      return {
        status: "error",
        message: "خطایی پیش آمده! لطفا بعدا تلاش کنید.",
      };
    } else {
      return {
        status: "ok",
        message: "",
      };
    }
  } catch (e) {
    return {
      status: "error",
      message: "شما نمیتوانید این شخص را حذف کنید! از این نام در داده های دیگری استفاده شده.",
    };
  }
}
