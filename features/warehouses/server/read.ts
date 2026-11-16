"use server";
import { readError } from "@/server/actions/errors";
import { requireSession } from "@/server/auth/require-session";

import { prisma } from "@/server/db/prisma";
import type { WarehouseRecord } from "../types/record";
import { managerName } from "./manager";

export async function getAllWarehouses(): Promise<WarehouseRecord[]> {
  try {
    await requireSession();
    const warehouses = await prisma.tbl_Warehouses.findMany({
      orderBy: {
        ID: "desc",
      },
    });
    return warehouses;
  } catch (error) {
    throw readError(error);
  }
}

export async function getWarehouseById(
  id: number,
): Promise<WarehouseRecord | null> {
  try {
    await requireSession();
    const warehouse = await prisma.tbl_Warehouses.findUnique({
      where: { ID: id },
    });
    return warehouse;
  } catch (error) {
    throw readError(error);
  }
}

export async function getWarehouseManagerOptions() {
  try {
    await requireSession();
    const people = await prisma.tbl_People_Companies.findMany({
      where: { Legal: false },
      select: { ID: true, FirstName: true, LastName: true, PersonCode: true },
      orderBy: [{ FirstName: "asc" }, { LastName: "asc" }, { ID: "asc" }],
    });
    return people.flatMap((person) => {
      const name = managerName(person);
      return name && name.length <= 150
        ? [
            {
              value: person.ID,
              label: `${name} · ${person.PersonCode || person.ID}`,
              name,
            },
          ]
        : [];
    });
  } catch (error) {
    throw readError(error);
  }
}
