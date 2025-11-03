import {
  getIrrigationEvents,
  getIrrigationEventsByGreenhouseId,
  getIrrigationEventsByZoneId,
} from "@/app/lib/services/irrigation";

export const getAllData = async (setTableLoading: (loading: boolean) => void, setDataSource: (data: any[]) => void) => {
  setTableLoading(true);
  const res: any = await getIrrigationEvents();
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
  const res: any = await getIrrigationEventsByGreenhouseId(ghId);
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
  const res: any = await getIrrigationEventsByZoneId(zId);
  if (res) {
    setTableLoading(false);
    setDataSource(res);
  } else {
    setTableLoading(false);
    setDataSource([]);
  }
};
