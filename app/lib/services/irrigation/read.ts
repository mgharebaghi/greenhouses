"use server";
import { prisma } from "@/app/lib/singletone";

export async function getIrrigationEvents() {
  const irrigationEvents = await prisma.irrigationEvent.findMany({
    orderBy: {
      EventID: "desc",
    },
    take: 100,
    include: {
      Zones: {
        select: {
          ZoneID: true,
          Name: true,
          Greenhouses: {
            select: { GreenhouseID: true, GreenhouseName: true },
          },
        },
      },
      IrrigationRecords: true,
    },
  });

  const castedDecimals = irrigationEvents.map((item) => {
    return {
      ...item,
      StartTime: item.StartTime ? item.StartTime.toISOString() : null,
      EndTime: item.EndTime ? item.EndTime.toISOString() : null,
      VolumeLiter: item.VolumeLiter ? Number(item.VolumeLiter) : null,
      ECIn: item.ECIn ? Number(item.ECIn) : null,
      ECOut: item.ECOut ? Number(item.ECOut) : null,
      pHIn: item.pHIn ? Number(item.pHIn) : null,
      pHOut: item.pHOut ? Number(item.pHOut) : null,
      DrainPct: item.DrainPct ? Number(item.DrainPct) : null,
      AvgFlowRate: item.AvgFlowRate ? Number(item.AvgFlowRate) : null,
      IrrigationRecords: item.IrrigationRecords.map((record) => ({
        ...record,
        StartTime: record.StartTime ? record.StartTime.toISOString() : null,
        EndTime: record.EndTime ? record.EndTime.toISOString() : null,
        VolumeLiters: record.VolumeLiters ? Number(record.VolumeLiters) : null,
        ECIn: record.ECIn ? Number(record.ECIn) : null,
        ECOut: record.ECOut ? Number(record.ECOut) : null,
        pHIn: record.pHIn ? Number(record.pHIn) : null,
        pHOut: record.pHOut ? Number(record.pHOut) : null,
        FlowRate_L_per_min: record.FlowRate_L_per_min ? Number(record.FlowRate_L_per_min) : null,
      })),
    };
  });

  return castedDecimals;
}

export async function getIrrigationEventsByGreenhouseId(greenhouseId: number) {
  const irrigationEvents = await prisma.irrigationEvent.findMany({
    where: {
      Zones: { GreenhouseID: greenhouseId },
    },
    take: 100,
    include: {
      Zones: {
        select: {
          ZoneID: true,
          Name: true,
          Greenhouses: {
            select: { GreenhouseID: true, GreenhouseName: true },
          },
        },
      },
      IrrigationRecords: true,
    },
    orderBy: { EventID: "desc" },
  });

  const castedDecimals = irrigationEvents.map((item) => {
    return {
      ...item,
      StartTime: item.StartTime ? item.StartTime.toISOString() : null,
      EndTime: item.EndTime ? item.EndTime.toISOString() : null,
      VolumeLiter: item.VolumeLiter ? Number(item.VolumeLiter) : null,
      ECIn: item.ECIn ? Number(item.ECIn) : null,
      ECOut: item.ECOut ? Number(item.ECOut) : null,
      pHIn: item.pHIn ? Number(item.pHIn) : null,
      pHOut: item.pHOut ? Number(item.pHOut) : null,
      DrainPct: item.DrainPct ? Number(item.DrainPct) : null,
      AvgFlowRate: item.AvgFlowRate ? Number(item.AvgFlowRate) : null,
      IrrigationRecords: item.IrrigationRecords.map((record) => ({
        ...record,
        StartTime: record.StartTime ? record.StartTime.toISOString() : null,
        EndTime: record.EndTime ? record.EndTime.toISOString() : null,
        VolumeLiters: record.VolumeLiters ? Number(record.VolumeLiters) : null,
        ECIn: record.ECIn ? Number(record.ECIn) : null,
        ECOut: record.ECOut ? Number(record.ECOut) : null,
        pHIn: record.pHIn ? Number(record.pHIn) : null,
        pHOut: record.pHOut ? Number(record.pHOut) : null,
        FlowRate_L_per_min: record.FlowRate_L_per_min ? Number(record.FlowRate_L_per_min) : null,
      })),
    };
  });

  return castedDecimals;
}

export async function getIrrigationEventsByZoneId(zoneId: number) {
  const irrigationEvents = await prisma.irrigationEvent.findMany({
    where: {
      ZoneID: zoneId,
    },
    take: 100,
    include: {
      Zones: {
        select: {
          ZoneID: true,
          Name: true,
          Greenhouses: {
            select: { GreenhouseID: true, GreenhouseName: true },
          },
        },
      },
      IrrigationRecords: true,
    },
    orderBy: { EventID: "desc" },
  });

  const castedDecimals = irrigationEvents.map((item) => {
    return {
      ...item,
      StartTime: item.StartTime ? item.StartTime.toISOString() : null,
      EndTime: item.EndTime ? item.EndTime.toISOString() : null,
      VolumeLiter: item.VolumeLiter ? Number(item.VolumeLiter) : null,
      ECIn: item.ECIn ? Number(item.ECIn) : null,
      ECOut: item.ECOut ? Number(item.ECOut) : null,
      pHIn: item.pHIn ? Number(item.pHIn) : null,
      pHOut: item.pHOut ? Number(item.pHOut) : null,
      DrainPct: item.DrainPct ? Number(item.DrainPct) : null,
      AvgFlowRate: item.AvgFlowRate ? Number(item.AvgFlowRate) : null,
      IrrigationRecords: item.IrrigationRecords.map((record) => ({
        ...record,
        StartTime: record.StartTime ? record.StartTime.toISOString() : null,
        EndTime: record.EndTime ? record.EndTime.toISOString() : null,
        VolumeLiters: record.VolumeLiters ? Number(record.VolumeLiters) : null,
        ECIn: record.ECIn ? Number(record.ECIn) : null,
        ECOut: record.ECOut ? Number(record.ECOut) : null,
        pHIn: record.pHIn ? Number(record.pHIn) : null,
        pHOut: record.pHOut ? Number(record.pHOut) : null,
        FlowRate_L_per_min: record.FlowRate_L_per_min ? Number(record.FlowRate_L_per_min) : null,
      })),
    };
  });

  return castedDecimals;
}
