import DateObject from "react-date-object";
import gregorian from "react-date-object/calendars/gregorian";
import persian from "react-date-object/calendars/persian";
import gregorianEn from "react-date-object/locales/gregorian_en";
import persianFa from "react-date-object/locales/persian_fa";

const tehran = "Asia/Tehran";
const tehranDay = new Intl.DateTimeFormat("sv-SE", { timeZone: tehran });
const tehranOffset = new Intl.DateTimeFormat("en", {
  timeZone: tehran,
  timeZoneName: "longOffset",
});
const tehranTime = new Intl.DateTimeFormat("fa-IR", {
  timeZone: tehran,
  hour: "2-digit",
  minute: "2-digit",
  hourCycle: "h23",
});

export type DateValue = Date | string | null | undefined;
export type DateKind = "day" | "timestamp";
export type DateCalendar = "persian" | "gregorian";

export function dateCalendarSettings(system: DateCalendar) {
  return system === "gregorian"
    ? { calendar: gregorian, locale: gregorianEn }
    : { calendar: persian, locale: persianFa };
}

export function getTehranDay(timestamp: number | Date) {
  return tehranDay.format(timestamp);
}

export function toCalendarDate(
  value: DateValue,
  kind: DateKind = "day",
  system: DateCalendar = "persian",
) {
  if (!value) return null;
  const date = value instanceof Date ? value : new Date(value);
  if (!Number.isFinite(date.getTime())) return null;
  const day =
    kind === "timestamp" ? getTehranDay(date) : date.toISOString().slice(0, 10);
  const { calendar, locale } = dateCalendarSettings(system);
  return new DateObject({
    date: day,
    format: "YYYY-MM-DD",
    calendar: gregorian,
    locale: gregorianEn,
  }).convert(calendar, locale);
}

// Send the selected day without turning it into an instant in the browser.
export function pickerDateToISO(value: DateObject | null) {
  if (!value?.isValid) return null;
  return new DateObject(value)
    .convert(gregorian, gregorianEn)
    .format("YYYY-MM-DD");
}

export function formatPersianDate(
  value: DateValue,
  {
    kind = "day",
    format = "YYYY/MM/DD",
    fallback = "—",
  }: {
    kind?: DateKind;
    format?: string;
    fallback?: string;
  } = {},
) {
  return toCalendarDate(value, kind)?.format(format) ?? fallback;
}

export function formatTehranTime(timestamp: number) {
  return tehranTime.format(timestamp);
}

function offsetAt(timestamp: number) {
  const offset = tehranOffset
    .formatToParts(timestamp)
    .find((part) => part.type === "timeZoneName")?.value;
  const match = /^GMT([+-])(\d{2}):(\d{2})(?::(\d{2}))?$/.exec(offset ?? "");
  if (!match) throw new Error("Could not resolve the Tehran time zone offset");
  const [, sign, hours, minutes, seconds = "0"] = match;
  return (
    (sign === "-" ? -1 : 1) *
    (Number(hours) * 3600 + Number(minutes) * 60 + Number(seconds)) *
    1000
  );
}

export function tehranDayStart(day: string) {
  const utcMidnight = Date.parse(`${day}T00:00:00.000Z`);
  const candidate = utcMidnight - offsetAt(utcMidnight);
  // On historical DST transitions, local midnight could be skipped.
  const start =
    getTehranDay(candidate) === day
      ? candidate
      : utcMidnight - offsetAt(candidate);
  return new Date(start);
}
