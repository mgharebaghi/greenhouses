import { getClimateData } from "@/app/lib/services/climatedaily";
import dayjs from "dayjs";
import jalaliday from "jalaliday";
dayjs.extend(jalaliday);

/**
 * نوع آرایه اصلی که از سرویس خوانده می‌شود
 */
export type ClimateDailyRawArray = Awaited<ReturnType<typeof getClimateData>>;

/**
 * ردیف تخت شده (Flattened) برای خروجی CSV
 * فیلدهای تو در تو مثل Owner_Observer و Zones به رشته ساده تبدیل می‌شوند.
 */
export type ClimateDailyFlattened = Omit<ClimateDailyRawArray[number], "Owner_Observer" | "Zones"> & {
  Owner_Observer: string; // نام و نام‌خانوادگی ناظر
  Zones: string; // نام سالن
  Greenhouse: string; // نام گلخانه (از داخل Zones.Greenhouses)
};

/**
 * این تابع یا از آرایه داده موجود (مثلاً داده فیلتر شده جدول) استفاده می‌کند
 * یا خودش داده را از دیتابیس می‌گیرد و سپس آن را برای CSV تخت می‌کند.
 * @param source اختیاری: اگر ندهیم خودش getClimateData صدا می‌زند
 */
export async function climateDailyCSVData(source?: ClimateDailyRawArray): Promise<ClimateDailyFlattened[]> {
  const data = source ?? (await getClimateData());
  return data.map((item) => {
    const fullName = item.Owner_Observer ? `${item.Owner_Observer.FirstName} ${item.Owner_Observer.LastName}` : "";
    const zoneName = item.Zones?.Name ?? "";
    const greenhouseName = item.Zones?.Greenhouses?.GreenhouseName ?? "";
    const RecordDate = item.RecordDate
      ? dayjs(item.RecordDate).calendar("jalali").locale("fa").format("YYYY/MM/DD")
      : "-";

    const { ClimateDailyID, ZoneID, ObserverID, ...rest } = item;

    return {
      // بقیه فیلدهای اصلی را نگه می‌داریم
      ...rest,
      RecordDate, // فرمت تاریخ را هم اصلاح می‌کنیم
      // تبدیل فیلدهای تو در تو به مقادیر ساده متنی
      Owner_Observer: fullName,
      Zones: zoneName,
      Greenhouse: greenhouseName,
    } as ClimateDailyFlattened;
  });
}

export const headers = [
  { displayLabel: "تاریخ ثبت", key: "RecordDate" },
  { displayLabel: "زمان ثبت", key: "RecordTime" },
  { displayLabel: "دمای خارجی", key: "ExternalTemp" },
  { displayLabel: "رطوبت خارجی", key: "ExternalHumidity" },
  { displayLabel: "فشار خارجی", key: "ExternalPressure" },
  { displayLabel: "میزان بارش (mm)", key: "ExternalRainfallMM" },
  { displayLabel: "دمای داخلی", key: "InternalTemp" },
  { displayLabel: "رطوبت داخلی", key: "InternalHumidity" },
  { displayLabel: "غلظت CO2 (ppm)", key: "CO2ppm" },
  { displayLabel: "PAR خارجی", key: "ExternalPAR" },
  { displayLabel: "DLI خارجی", key: "ExternalDLI" },
  { displayLabel: "PAR داخلی", key: "InternalPAR" },
  { displayLabel: "DLI داخلی", key: "InternalDLI" },
  { displayLabel: "سرعت باد", key: "WindSpeed" },
  { displayLabel: "جهت باد", key: "WindDirection" },
  { displayLabel: "درصد باز بودن دریچه", key: "VentOpenPct" },
  { displayLabel: "تعداد خطای دریچه", key: "VentErrorCount" },
  { displayLabel: "VPD", key: "VPD" },
  { displayLabel: "یادداشت‌ها", key: "Notes" },
  { displayLabel: "ناظر (ثبت‌کننده)", key: "Owner_Observer" },
  { displayLabel: "سالن", key: "Zones" },
  { displayLabel: "گلخانه", key: "Greenhouse" },
];
