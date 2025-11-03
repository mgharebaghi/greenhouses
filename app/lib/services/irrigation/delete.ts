"use server";
import { prisma } from "@/app/lib/singletone";

export async function deleteIrrigationEvent(id: number) {
  // First delete all related irrigation records
  await prisma.irrigationRecords.deleteMany({
    where: {
      EventID: id,
    },
  });

  // Then delete the irrigation event
  await prisma.irrigationEvent.delete({
    where: {
      EventID: id,
    },
  });

  return true;
}

export async function deleteIrrigationRecord(id: number) {
  await prisma.irrigationRecords.delete({
    where: {
      RecordID: id,
    },
  });

  return true;
}
