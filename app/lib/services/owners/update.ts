"use server";
import { prisma } from "@/app/lib/singletone";

export async function updateOwner(params: { id: number; data: any }) {
  return await prisma.tbl_People.update({
    where: { ID: params.id },
    data: params.data,
  });
}
