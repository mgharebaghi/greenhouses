"use client";

import {
  useImperativeHandle,
  useRef,
  type ComponentProps,
  type Ref,
} from "react";
import persian from "react-date-object/calendars/persian";
import persianFa from "react-date-object/locales/persian_fa";
import DatePicker, { type DatePickerRef } from "react-multi-date-picker";

type Props = Omit<ComponentProps<typeof DatePicker<false, false>>, "ref"> & {
  ref?: Ref<DatePickerRef>;
};
export default function PersianDatePicker({ ref, ...props }: Props) {
  const pickerRef = useRef<DatePickerRef>(null);
  useImperativeHandle(ref, () => pickerRef.current!, []);
  return (
    <DatePicker
      ref={pickerRef}
      calendar={persian}
      locale={persianFa}
      calendarPosition="bottom-right"
      {...props}
    />
  );
}
