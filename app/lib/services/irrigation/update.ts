"use server";
import { IrrigationEvent, IrrigationRecords } from "@/app/generated/prisma";
import { prisma } from "@/app/lib/singletone";

export async function updateIrrigationEvent(id: number, data: IrrigationEvent) {
  const updated = await prisma.irrigationEvent.update({
    where: { EventID: id },
    data,
  });

  if (updated) {
    return true;
  } else {
    return false;
  }
}

export async function updateIrrigationRecord(id: number, data: IrrigationRecords) {
  const updated = await prisma.irrigationRecords.update({
    where: { RecordID: id },
    data,
  });

  if (updated) {
    return true;
  } else {
    return false;
  }
}
