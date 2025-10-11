import {
  getGrowthDaily,
  getGrowthDailyByPlantingId,
  getGrowthingByGreenHouseId,
  getGrowthingByZoneId,
} from "@/app/lib/services/growthdaily";

export const getAllData = async (setTableLoading: (loading: boolean) => void, setDataSource: (data: any[]) => void) => {
  setTableLoading(true);
  const res: any = await getGrowthDaily();
  if (res) {
    setTableLoading(false);
    setDataSource(res);
  }
};

export const getDataByGreenHousId = async (
  ghId: number,
  setTableLoading: (loading: boolean) => void,
  setDataSource: (data: any[]) => void
) => {
  setTableLoading(true);
  const res: any = await getGrowthingByGreenHouseId(ghId);
  if (res) {
    setTableLoading(false);
    setDataSource(res);
  } else {
    setTableLoading(false);
    setDataSource([]);
  }
};

export const getDataByZoneId = async (
  zId: number,
  setTableLoading: (loading: boolean) => void,
  setDataSource: (data: any[]) => void
) => {
  setTableLoading(true);
  const res: any = await getGrowthingByZoneId(zId);
  if (res) {
    setTableLoading(false);
    setDataSource(res);
  } else {
    setTableLoading(false);
    setDataSource([]);
  }
};

export const getDataByPlantingId = async (
  pId: number,
  setTableLoading: (loading: boolean) => void,
  setDataSource: (data: any[]) => void
) => {
  setTableLoading(true);
  const res: any = await getGrowthDailyByPlantingId(pId);
  if (res) {
    setTableLoading(false);
    setDataSource(res);
  } else {
    setTableLoading(false);
    setDataSource([]);
  }
};
