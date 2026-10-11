"use server";
import { prisma } from "@/lib/singletone";
import { ownerInputSchema, peopleReadDTO } from "../schema";
import type { OwnerResponse } from "../types";
import { z } from "zod";

export async function updateOwner(params: { id: number; data: unknown }): Promise<OwnerResponse> {
  if (!Number.isInteger(params?.id) || params.id < 1) {
    return { status: "error", message: "شناسه شخص معتبر نیست." };
  }
  const validation = ownerInputSchema.safeParse(params.data);
  if (!validation.success) {
    return { status: "error", message: "لطفاً خطاهای فرم را اصلاح کنید.", fieldErrors: z.flattenError(validation.error).fieldErrors };
  }

  try {
    const updated = await prisma.tbl_People.update({
      where: { ID: params.id },
      data: validation.data,
      include: { Tbl_PeoplePosts: { select: { PostName: true, ID: true } } },
    });
    return { status: "ok", message: "اطلاعات با موفقیت ویرایش شد.", dta: [peopleReadDTO.parse(updated)] };
  } catch (error) {
    console.error("Error updating person:", error);
    if (error instanceof Error && "code" in error) {
      if (error.code === "P2003") {
        return { status: "error", message: "سمت انتخاب‌شده معتبر نیست.", fieldErrors: { PostID: ["سمت را دوباره انتخاب کنید."] } };
      }
      if (error.code === "P2025") {
        return { status: "error", message: "این شخص دیگر در سیستم موجود نیست. فهرست را تازه کنید." };
      }
    }
    return { status: "error", message: "خطایی در ویرایش اطلاعات رخ داد. لطفاً دوباره تلاش کنید." };
  }
}
