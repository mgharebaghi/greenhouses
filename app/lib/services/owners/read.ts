"use server";

import { Tbl_People } from "@/app/generated/prisma";
import { prisma } from "@/app/lib/singletone";
import { OwnerResponse } from "./types";
export async function getAllOwners(): Promise<OwnerResponse> {
  const peaples = prisma.tbl_People.findMany({
    orderBy: { ID: "desc" }
  });

  if (!peaples) {
    return {
      status: "error",
      message: "جدول اشخاص خالی میباشد",
    };
  }
  return {
    status: "ok",
    message: "مالکین با موفقیت دریافت شد",
    dta: peaples,
  };
}