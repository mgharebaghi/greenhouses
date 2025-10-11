import { Greenhouses } from "@/app/generated/prisma";
import { allGreenHouses } from "@/app/lib/services/greenhouse";
import { getPlantingByZoneId } from "@/app/lib/services/planting";
import { getgreenHouseZones } from "@/app/lib/services/zones/read";

type SelectOptions = {
  label: string | null;
  value: string | number;
};

export const fetchGreenhouseOptions = async (
  setZoneId: (id: number | null) => void,
  setPlantingId: (id: number | null) => void,
  setZoneOptions: (options: SelectOptions[]) => void,
  setPlantingOptions: (options: SelectOptions[]) => void,
  setGreenhouseLoading: (loading: boolean) => void,
  setGreenhouseOptions: (options: SelectOptions[]) => void
) => {
  setZoneId(null);
  setPlantingId(null);
  setZoneOptions([]);
  setPlantingOptions([]);
  setGreenhouseLoading(true);
  const res: Greenhouses[] = await allGreenHouses();
  if (res) {
    setGreenhouseLoading(false);
    const options = res.map((gh) => ({
      label: gh.GreenhouseName,
      value: gh.GreenhouseID,
    }));
    setGreenhouseOptions(options);
  }
};

export const fetchZoneOptions = async (
  ghId: number,
  setZoneLoading: (loading: boolean) => void,
  setZoneId: (id: number | null) => void,
  setZoneOptions: (options: SelectOptions[]) => void,
  setPlantingId: (id: number | null) => void,
  setPlantingOptions: (options: SelectOptions[]) => void
) => {
  setZoneLoading(true);
  setZoneId(null);
  setZoneOptions([]);
  setPlantingId(null);
  setPlantingOptions([]);
  const res = await getgreenHouseZones(ghId);
  if (res) {
    setZoneLoading(false);
    const options = res.map((zone) => ({
      label: zone.Name,
      value: zone.ZoneID,
    }));
    setZoneOptions(options);
  }
};

export const fetchPlantingOptions = async (
  zoneId: number,
  setPlantingId: (id: number | null) => void,
  setPlantingOptions: (options: SelectOptions[]) => void,
  setPlantingLoading: (loading: boolean) => void
) => {
  setPlantingId(null);
  setPlantingOptions([]);
  setPlantingLoading(true);
  const res = await getPlantingByZoneId(zoneId);
  if (res) {
    setPlantingLoading(false);
    const options = res.map((planting) => ({
      label: `شناسه کاشت ${planting.PlantingID}`,
      value: Number(planting.PlantingID),
    }));
    setPlantingOptions(options);
  }
};
