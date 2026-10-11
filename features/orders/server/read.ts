"use server";
import { requireSession } from "@/server/auth/require-session";
import {
  orderInclude,
  getOrderById as queryById,
  serializeOrder,
} from "./queries";

import { prisma } from "@/server/db/prisma";

export async function getAllOrders() {
  await requireSession();
  try {
    const orders = await prisma.tbl_Orders.findMany({
      include: orderInclude,
      orderBy: {
        ID: "desc",
      },
    });
    return orders.map(serializeOrder);
  } catch (error) {
    console.error("Query failed", error);
    throw new Error("دریافت اطلاعات انجام نشد. لطفاً دوباره تلاش کنید.");
  }
}

export async function getOrderById(id: number) {
  await requireSession();
  return queryById(id);
}
