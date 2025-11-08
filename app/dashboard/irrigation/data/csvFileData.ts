import { getIrrigationEvents } from "@/app/lib/services/irrigation";
import dayjs from "dayjs";
import jalaliday from "jalaliday";
dayjs.extend(jalaliday);

export type IrrigationRawArray = Awaited<ReturnType<typeof getIrrigationEvents>>;
export type IrrigationFlattened = {
  EventID: number;
  ZoneName: string;
  StartTime: string;
  EndTime: string;
  VolumeLiter: number | null;
  ECIn: number | null;
  ECOut: number | null;
  pHIn: number | null;
  pHOut: number | null;
  DrainPct: number | null;
  CyclesCount: number | null;
  TotalDurationSeconds: number | null;
  TriggerType: string | null;
  AvgFlowRate: number | null;
};

export async function irrigationCSVData(source?: IrrigationRawArray): Promise<IrrigationFlattened[]> {
  const data = source ?? (await getIrrigationEvents());
  return data.map((item: any) => ({
    EventID: item.EventID,
    ZoneName: item.Zones?.Name ?? "",
    StartTime: item.StartTime ? dayjs(item.StartTime).calendar("jalali").locale("fa").format("YYYY/MM/DD HH:mm") : "-",
    EndTime: item.EndTime ? dayjs(item.EndTime).calendar("jalali").locale("fa").format("YYYY/MM/DD HH:mm") : "-",
    VolumeLiter: item.VolumeLiter,
    ECIn: item.ECIn,
    ECOut: item.ECOut,
    pHIn: item.pHIn,
    pHOut: item.pHOut,
    DrainPct: item.DrainPct,
    CyclesCount: item.CyclesCount,
    TotalDurationSeconds: item.TotalDurationSeconds,
    TriggerType: item.TriggerType,
    AvgFlowRate: item.AvgFlowRate,
  }));
}

export const headers = [
  { displayLabel: "شناسه رویداد", key: "EventID" },
  { displayLabel: "سالن", key: "ZoneName" },
  { displayLabel: "زمان شروع", key: "StartTime" },
  { displayLabel: "زمان پایان", key: "EndTime" },
  { displayLabel: "حجم (لیتر)", key: "VolumeLiter" },
  { displayLabel: "EC ورودی", key: "ECIn" },
  { displayLabel: "EC خروجی", key: "ECOut" },
  { displayLabel: "pH ورودی", key: "pHIn" },
  { displayLabel: "pH خروجی", key: "pHOut" },
  { displayLabel: "درصد زهکشی", key: "DrainPct" },
  { displayLabel: "تعداد چرخه‌ها", key: "CyclesCount" },
  { displayLabel: "مدت زمان کل (ثانیه)", key: "TotalDurationSeconds" },
  { displayLabel: "نوع راه‌انداز", key: "TriggerType" },
  { displayLabel: "متوسط نرخ جریان", key: "AvgFlowRate" },
];
