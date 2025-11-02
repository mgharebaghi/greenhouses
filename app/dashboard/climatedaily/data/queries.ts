import {
  getClimateData,
  getClimateDailyByGreenhouseId,
  getClimateDailyByZoneId,
} from "@/app/lib/services/climatedaily";

export const getAllData = async (setTableLoading: (loading: boolean) => void, setDataSource: (data: any[]) => void) => {
  setTableLoading(true);
  const res: any = await getClimateData();
  if (res) {
    setTableLoading(false);
    setDataSource(res);
  }
};

export const getDataByGreenhouseId = async (
  ghId: number,
  setTableLoading: (loading: boolean) => void,
  setDataSource: (data: any[]) => void
) => {
  setTableLoading(true);
  const res: any = await getClimateDailyByGreenhouseId(ghId);
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
  const res: any = await getClimateDailyByZoneId(zId);
  if (res) {
    setTableLoading(false);
    setDataSource(res);
  } else {
    setTableLoading(false);
    setDataSource([]);
  }
};
