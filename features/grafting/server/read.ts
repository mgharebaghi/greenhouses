"use server";
import { requireSession } from "@/server/auth/require-session";

import { prisma } from "@/server/db/prisma";
import { GraftingFormData, GraftingListResponse } from "../types";

export async function getGraftingFormData(): Promise<GraftingFormData> {
  await requireSession();
  const orders = await prisma.tbl_Orders.findMany({
    select: {
      ID: true,
      OrderCode: true,
      OrderCount: true,
    },
    orderBy: { ID: "desc" },
  });

  const people = await prisma.tbl_People.findMany({
    where: {
      // You might want to filter by active status or specific roles here if applicable
    },
    select: {
      ID: true,
      FirstName: true,
      LastName: true,
      NationalCode: true,
      PersonCode: true,
    },
    orderBy: { LastName: "asc" },
  });

  return { orders, people };
}

export async function getAllGraftingOperations(): Promise<GraftingListResponse> {
  await requireSession();
  try {
    const data = await prisma.tbl_GraftingOperation.findMany({
      include: {
        Tbl_Orders: true,
        Tbl_People: true, // Technician
        Tbl_GraftWorkers: {
          include: {
            Tbl_People: true,
          },
        },
      },
      orderBy: { ID: "desc" },
    });
    return { status: "ok", data };
  } catch (error) {
    console.error("Error fetching grafting operations:", error);
    return { status: "error", message: "خطا در دریافت لیست عملیات پیوند" };
  }
}
