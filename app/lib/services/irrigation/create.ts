"use server";
import { IrrigationEvent, IrrigationRecords } from "@/app/generated/prisma";
import { prisma } from "@/app/lib/singletone";

export async function createIrrigationEvent(data: IrrigationEvent) {
  const inserting = await prisma.irrigationEvent.create({
    data: data,
  });

  if (inserting) {
    return true;
  } else {
    return false;
  }
}

export async function createIrrigationRecord(data: IrrigationRecords) {
  const inserting = await prisma.irrigationRecords.create({
    data: data,
  });

  if (inserting) {
    return true;
  } else {
    return false;
  }
}
