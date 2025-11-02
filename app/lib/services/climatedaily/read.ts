"use server";
import { prisma } from "@/app/lib/singletone";

export async function getClimateData() {
  const climateData = await prisma.climateDaily.findMany({
    orderBy: {
      ClimateDailyID: "desc",
    },
    take: 100,
    include: {
      Owner_Observer: { select: { ID: true, FirstName: true, LastName: true } },
      Zones: {
        select: {
          ZoneID: true,
          Name: true,
          Greenhouses: {
            select: { GreenhouseID: true, GreenhouseName: true },
          },
        },
      },
    },
  });

  const castedDecimals = climateData.map((item) => {
    return {
      ...item,
      Owner_Observer: item.Owner_Observer
        ? {
            ...item.Owner_Observer,
            FullName: `${item.Owner_Observer.FirstName} ${item.Owner_Observer.LastName}`,
          }
        : null,
      RecordDate: item.RecordDate ? item.RecordDate.toISOString().split("T")[0] : null,
      RecordTime: item.RecordTime ? item.RecordTime.toISOString().split("T")[1].split(".")[0] : null,
      ExternalTemp: item.ExternalTemp ? Number(item.ExternalTemp) : null,
      ExternalHumidity: item.ExternalHumidity ? Number(item.ExternalHumidity) : null,
      ExternalPressure: item.ExternalPressure ? Number(item.ExternalPressure) : null,
      ExternalRainfallMM: item.ExternalRainfallMM ? Number(item.ExternalRainfallMM) : null,
      InternalTemp: item.InternalTemp ? Number(item.InternalTemp) : null,
      InternalHumidity: item.InternalHumidity ? Number(item.InternalHumidity) : null,
      CO2ppm: item.CO2ppm ? Number(item.CO2ppm) : null,
      ExternalPAR: item.ExternalPAR ? Number(item.ExternalPAR) : null,
      ExternalDLI: item.ExternalDLI ? Number(item.ExternalDLI) : null,
      InternalPAR: item.InternalPAR ? Number(item.InternalPAR) : null,
      InternalDLI: item.InternalDLI ? Number(item.InternalDLI) : null,
      WindSpeed: item.WindSpeed ? Number(item.WindSpeed) : null,
      VentOpenPct: item.VentOpenPct ? Number(item.VentOpenPct) : null,
      VPD: item.VPD ? Number(item.VPD) : null,
    };
  });

  return castedDecimals;
}

export async function getClimateDailyByGreenhouseId(greenhouseId: number) {
  const climateData = await prisma.climateDaily.findMany({
    where: {
      Zones: { GreenhouseID: greenhouseId },
    },
    take: 100,
    include: {
      Owner_Observer: { select: { ID: true, FirstName: true, LastName: true } },
      Zones: {
        select: {
          ZoneID: true,
          Name: true,
          Greenhouses: {
            select: { GreenhouseID: true, GreenhouseName: true },
          },
        },
      },
    },
    orderBy: { ClimateDailyID: "desc" },
  });

  const castedDecimals = climateData.map((item) => {
    return {
      ...item,
      Owner_Observer: item.Owner_Observer
        ? {
            ...item.Owner_Observer,
            FullName: `${item.Owner_Observer.FirstName} ${item.Owner_Observer.LastName}`,
          }
        : null,
      RecordDate: item.RecordDate ? item.RecordDate.toISOString().split("T")[0] : null,
      RecordTime: item.RecordTime ? item.RecordTime.toISOString().split("T")[1].split(".")[0] : null,
      ExternalTemp: item.ExternalTemp ? Number(item.ExternalTemp) : null,
      ExternalHumidity: item.ExternalHumidity ? Number(item.ExternalHumidity) : null,
      ExternalPressure: item.ExternalPressure ? Number(item.ExternalPressure) : null,
      ExternalRainfallMM: item.ExternalRainfallMM ? Number(item.ExternalRainfallMM) : null,
      InternalTemp: item.InternalTemp ? Number(item.InternalTemp) : null,
      InternalHumidity: item.InternalHumidity ? Number(item.InternalHumidity) : null,
      CO2ppm: item.CO2ppm ? Number(item.CO2ppm) : null,
      ExternalPAR: item.ExternalPAR ? Number(item.ExternalPAR) : null,
      ExternalDLI: item.ExternalDLI ? Number(item.ExternalDLI) : null,
      InternalPAR: item.InternalPAR ? Number(item.InternalPAR) : null,
      InternalDLI: item.InternalDLI ? Number(item.InternalDLI) : null,
      WindSpeed: item.WindSpeed ? Number(item.WindSpeed) : null,
      VentOpenPct: item.VentOpenPct ? Number(item.VentOpenPct) : null,
      VPD: item.VPD ? Number(item.VPD) : null,
    };
  });

  return castedDecimals;
}

export async function getClimateDailyByZoneId(zoneId: number) {
  const climateData = await prisma.climateDaily.findMany({
    where: {
      ZoneID: zoneId,
    },
    take: 100,
    include: {
      Owner_Observer: { select: { ID: true, FirstName: true, LastName: true } },
      Zones: {
        select: {
          ZoneID: true,
          Name: true,
          Greenhouses: {
            select: { GreenhouseID: true, GreenhouseName: true },
          },
        },
      },
    },
    orderBy: { ClimateDailyID: "desc" },
  });

  const castedDecimals = climateData.map((item) => {
    return {
      ...item,
      Owner_Observer: item.Owner_Observer
        ? {
            ...item.Owner_Observer,
            FullName: `${item.Owner_Observer.FirstName} ${item.Owner_Observer.LastName}`,
          }
        : null,
      RecordDate: item.RecordDate ? item.RecordDate.toISOString().split("T")[0] : null,
      RecordTime: item.RecordTime ? item.RecordTime.toISOString().split("T")[1].split(".")[0] : null,
      ExternalTemp: item.ExternalTemp ? Number(item.ExternalTemp) : null,
      ExternalHumidity: item.ExternalHumidity ? Number(item.ExternalHumidity) : null,
      ExternalPressure: item.ExternalPressure ? Number(item.ExternalPressure) : null,
      ExternalRainfallMM: item.ExternalRainfallMM ? Number(item.ExternalRainfallMM) : null,
      InternalTemp: item.InternalTemp ? Number(item.InternalTemp) : null,
      InternalHumidity: item.InternalHumidity ? Number(item.InternalHumidity) : null,
      CO2ppm: item.CO2ppm ? Number(item.CO2ppm) : null,
      ExternalPAR: item.ExternalPAR ? Number(item.ExternalPAR) : null,
      ExternalDLI: item.ExternalDLI ? Number(item.ExternalDLI) : null,
      InternalPAR: item.InternalPAR ? Number(item.InternalPAR) : null,
      InternalDLI: item.InternalDLI ? Number(item.InternalDLI) : null,
      WindSpeed: item.WindSpeed ? Number(item.WindSpeed) : null,
      VentOpenPct: item.VentOpenPct ? Number(item.VentOpenPct) : null,
      VPD: item.VPD ? Number(item.VPD) : null,
    };
  });

  return castedDecimals;
}
