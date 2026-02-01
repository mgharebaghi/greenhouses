"use server";

import { prisma } from "@/app/lib/singletone";
import { SeedPackageCreateRes } from "./types";

export async function deleteSeedPackage(id: number): Promise<SeedPackageCreateRes> {
    try {
        await prisma.seedPackage.delete({
            where: { SeedPackageID: id },
        });
        return { status: "ok", message: "بسته بذر با موفقیت حذف شد" };
    } catch (error) {
        console.error("Error deleting seed package:", error);
        return { status: "error", message: "خطا در حذف بسته بذر" };
    }
}
