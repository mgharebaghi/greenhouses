"use client";

import { CalendarOutlined, CheckOutlined } from "@ant-design/icons";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useId, useRef, useState, useTransition, type FormEvent } from "react";
import {
  DatePicker,
  FormAppearance,
  FormLabel,
} from "@/shared/components/FormControls";
import GreenhouseButton from "@/shared/components/GreenhouseButton";
import { toCalendarDate } from "@/shared/dates/calendar";
import {
  dashboardPeriods,
  shiftDay,
  validDashboardDates,
} from "../domain/activity";
import type { DashboardPeriod, DashboardRange } from "../types";
import DashboardLinkIndicator from "./DashboardLinkIndicator";

const labels: Record<DashboardPeriod, string> = {
  "7": "۷ روز",
  "30": "۳۰ روز",
  "90": "۹۰ روز",
  "365": "یک سال",
  all: "همهٔ دوره",
};

const option =
  "inline-flex min-h-9 items-center justify-center gap-1 rounded-lg px-2 py-1.5 text-xs font-bold outline-offset-2 focus-visible:outline-2 focus-visible:outline-emerald-600 sm:px-2.5";
const active = "bg-(--button-tint) text-(--button-accent)!";
const inactive = "text-(--ui-muted-text)! hover:bg-(--ui-muted-panel)";

function CustomRange({
  pathname,
  range,
  today,
}: {
  pathname: string;
  range: DashboardRange;
  today: string;
}) {
  const router = useRouter();
  const id = useId();
  const trigger = useRef<HTMLButtonElement>(null);
  const [open, setOpen] = useState(false);
  const [pending, startTransition] = useTransition();
  const [start, setStart] = useState(range.start ?? shiftDay(today, -29));
  const [end, setEnd] = useState(range.end);
  const [error, setError] = useState(false);
  const lastDay = toCalendarDate(today);

  function close() {
    setStart(range.start ?? shiftDay(today, -29));
    setEnd(range.end);
    setError(false);
    setOpen(false);
    trigger.current?.focus();
  }

  function apply(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!validDashboardDates(start, end, today)) {
      setError(true);
      return;
    }
    setError(false);
    if (
      range.period === "custom" &&
      range.start === start &&
      range.end === end
    ) {
      close();
      return;
    }
    const query = new URLSearchParams({ from: start, to: end });
    startTransition(() =>
      router.push(`${pathname}?${query}`, { scroll: false }),
    );
  }

  return (
    <>
      <button
        ref={trigger}
        type="button"
        className={`${option} ${open || range.period === "custom" ? active : inactive}`}
        aria-expanded={open}
        aria-controls={id}
        disabled={pending}
        onClick={() => (open ? close() : setOpen(true))}
      >
        <CalendarOutlined aria-hidden="true" />
        بازهٔ دلخواه
      </button>
      {open && (
        <div
          id={id}
          className="basis-full border-t border-(--ui-border) p-2 sm:px-3"
        >
          <FormAppearance>
            <form onSubmit={apply} className="flex flex-wrap items-end gap-2.5">
              <div className="min-w-24 flex-1">
                <FormLabel htmlFor={`${id}-from`} className="block">
                  از تاریخ
                </FormLabel>
                <DatePicker
                  id={`${id}-from`}
                  value={start}
                  onChange={(value) => setStart(value ?? "")}
                  disabled={pending}
                  maxDate={lastDay ?? undefined}
                />
              </div>
              <div className="min-w-24 flex-1">
                <FormLabel htmlFor={`${id}-to`} className="block">
                  تا تاریخ
                </FormLabel>
                <DatePicker
                  id={`${id}-to`}
                  value={end}
                  onChange={(value) => setEnd(value ?? "")}
                  disabled={pending}
                  maxDate={lastDay ?? undefined}
                />
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <GreenhouseButton
                  text="انصراف"
                  variant="secondary"
                  disabled={pending}
                  onClick={close}
                />
                <GreenhouseButton
                  type="submit"
                  text={pending ? "در حال دریافت…" : "اعمال"}
                  loading={pending}
                />
              </div>
              {error && (
                <p
                  role="alert"
                  className="basis-full text-xs text-rose-700 dark:text-rose-300"
                >
                  تاریخ شروع و پایان را به‌ترتیب و حداکثر تا امروز وارد کنید.
                </p>
              )}
            </form>
          </FormAppearance>
        </div>
      )}
    </>
  );
}

export default function DashboardRangeSelector({
  range,
  today,
}: {
  range: DashboardRange;
  today: string;
}) {
  const pathname = usePathname();
  return (
    <nav
      aria-label="بازهٔ زمانی داشبورد"
      className="flex max-w-full flex-wrap items-center gap-1 rounded-xl border border-(--ui-border) bg-(--ui-panel) p-1"
    >
      {dashboardPeriods.map((period) => (
        <Link
          key={period}
          href={period === "30" ? pathname : `${pathname}?days=${period}`}
          prefetch={false}
          scroll={false}
          aria-current={range.period === period ? "true" : undefined}
          className={`${option} ${range.period === period ? active : inactive}`}
        >
          {labels[period]}
          <DashboardLinkIndicator>
            {range.period === period && (
              <CheckOutlined className="text-[10px]" />
            )}
          </DashboardLinkIndicator>
        </Link>
      ))}
      <CustomRange
        key={`${range.period}:${range.start}:${range.end}`}
        pathname={pathname}
        range={range}
        today={today}
      />
    </nav>
  );
}
