"use client";

import {
  useImperativeHandle,
  useMemo,
  useRef,
  type ComponentProps,
  type Ref,
} from "react";
import DatePicker, { type DatePickerRef } from "react-multi-date-picker";
import {
  dateCalendarSettings,
  pickerDateToISO,
  toCalendarDate,
  type DateKind,
  type DateCalendar,
  type DateValue,
} from "@/shared/dates/calendar";
import { useServerDay } from "@/shared/dates/ServerClock";

type Props = Omit<
  ComponentProps<typeof DatePicker<false, false>>,
  "ref" | "value" | "onChange" | "calendar" | "locale"
> & {
  ref?: Ref<DatePickerRef>;
  value?: DateValue;
  onChange?: (value: string | null) => void;
  kind?: DateKind;
  calendarSystem?: DateCalendar;
};
export default function PersianDatePicker({
  ref,
  value,
  onChange,
  kind = "day",
  calendarSystem = "persian",
  ...props
}: Props) {
  const pickerRef = useRef<DatePickerRef>(null);
  const todayKey = useServerDay();
  const today = useMemo(
    () => toCalendarDate(todayKey, "day", calendarSystem)!,
    [todayKey, calendarSystem],
  );
  const selected = useMemo(
    () => toCalendarDate(value, kind, calendarSystem),
    [value, kind, calendarSystem],
  );
  useImperativeHandle(ref, () => pickerRef.current!);
  return (
    <DatePicker
      ref={pickerRef}
      {...dateCalendarSettings(calendarSystem)}
      calendarPosition="bottom-right"
      {...props}
      key={`${todayKey}:${calendarSystem}`}
      value={selected ?? ""}
      currentDate={today}
      highlightToday={false}
      onOpenPickNewDate={false}
      mapDays={({ date }) =>
        date.year === today.year &&
        date.month.number === today.month.number &&
        date.day === today.day
          ? { className: "bg-sky-300 text-white", "aria-current": "date" }
          : undefined
      }
      onChange={(date) => onChange?.(pickerDateToISO(date))}
    />
  );
}
