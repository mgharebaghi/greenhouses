"use server";
import type { OwnerResponse } from "../types";
import { prisma } from "@/lib/singletone";
import { ownerInputSchema, peopleReadDTO } from "../schema";
import { z } from "zod";

export async function createOwner(data: unknown): Promise<OwnerResponse> {
  const validation = ownerInputSchema.safeParse(data);
  if (!validation.success) {
    return { status: "error", message: "لطفاً خطاهای فرم را اصلاح کنید.", fieldErrors: z.flattenError(validation.error).fieldErrors };
  }

  try {
    const insert = await prisma.tbl_People.create({
      data: validation.data,
      include: {
        Tbl_PeoplePosts: {
          select: {
            PostName: true,
            ID: true,
          },
        }
      }
    });

    const parsed = peopleReadDTO.parse(insert);
    return { status: "ok", message: "اطلاعات با موفقیت ثبت شد.", dta: [parsed] };
  } catch (error) {
    console.error("Error creating person:", error);
    if (error instanceof Error && "code" in error && error.code === "P2003") {
      return { status: "error", message: "سمت انتخاب‌شده معتبر نیست.", fieldErrors: { PostID: ["سمت را دوباره انتخاب کنید."] } };
    }
    return { status: "error", message: "خطایی در ثبت اطلاعات رخ داد. لطفاً دوباره تلاش کنید." };
  }
}
