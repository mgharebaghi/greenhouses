"use server";
import { readError } from "@/server/actions/errors";
import { requireSession } from "@/server/auth/require-session";
import { prisma } from "@/server/db/prisma";
import {
  serializeSupplier,
  supplierIdentitySelect,
  supplierPersonOptionsSelect,
} from "./person";

export async function getSuppliers() {
  try {
    await requireSession();
    const suppliers = await prisma.tbl_Suppliers.findMany({
      include: {
        Tbl_People_Companies: supplierIdentitySelect.Tbl_People_Companies,
      },
      orderBy: { ID: "desc" },
    });
    return suppliers.map(serializeSupplier);
  } catch (error) {
    throw readError(error);
  }
}

export async function getSupplierPeople() {
  try {
    await requireSession();
    return await prisma.tbl_People_Companies.findMany({
      select: supplierPersonOptionsSelect,
      orderBy: { ID: "desc" },
    });
  } catch (error) {
    throw readError(error);
  }
}
