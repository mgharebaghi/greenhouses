"use server";
import { prisma } from "@/app/lib/singletone";

export type SupplierResponse = { status: "ok" | "error"; message: string };

export async function deleteSupplier(id: number): Promise<SupplierResponse> {
  try {
    await prisma.tbl_suppliers.delete({ where: { ID: id } });
    return { status: "ok", message: "حذف شد" };
  } catch (e: any) {
    return { status: "error", message: e?.message || "حذف با خطا مواجه شد" };
  }
}
