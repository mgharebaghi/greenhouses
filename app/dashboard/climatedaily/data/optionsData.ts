import { Greenhouses } from "@/app/generated/prisma";
import { allGreenHouses } from "@/app/lib/services/greenhouse";
import { getgreenHouseZones } from "@/app/lib/services/zones/read";

type SelectOptions = {
  label: string | null;
  value: string | number;
};

export const fetchGreenhouseOptions = async (
  setZoneId: (id: number | null) => void,
  setZoneOptions: (options: SelectOptions[]) => void,
  setGreenhouseLoading: (loading: boolean) => void,
  setGreenhouseOptions: (options: SelectOptions[]) => void
) => {
  setZoneId(null);
  setZoneOptions([]);
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
  setZoneOptions: (options: SelectOptions[]) => void
) => {
  setZoneLoading(true);
  setZoneId(null);
  setZoneOptions([]);
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
