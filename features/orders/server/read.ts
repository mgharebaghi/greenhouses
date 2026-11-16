"use server";
import { readError } from "@/server/actions/errors";
import { requireSession } from "@/server/auth/require-session";
import {
  orderInclude,
  getOrderById as queryById,
  serializeOrder,
} from "./queries";

import { prisma } from "@/server/db/prisma";

export async function getAllOrders() {
  try {
    await requireSession();
    const orders = await prisma.tbl_Orders.findMany({
      include: orderInclude,
      orderBy: {
        ID: "desc",
      },
    });
    return orders.map(serializeOrder);
  } catch (error) {
    throw readError(error);
  }
}

export async function getOrderById(id: number) {
  try {
    await requireSession();
    return queryById(id);
  } catch (error) {
    throw readError(error);
  }
}
