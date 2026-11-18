"use client";

import { useState } from "react";
import { formatPersianDate } from "@/shared/dates/calendar";
import type { ActivityBucket } from "../types";
import { useChartMode, type ChartMode } from "./ChartMode";
import {
  BarChartOutlined,
  LineChartOutlined,
  PercentageOutlined,
} from "@ant-design/icons";

const number = new Intl.NumberFormat("fa-IR");
const percent = new Intl.NumberFormat("fa-IR", {
  style: "percent",
  maximumFractionDigits: 1,
});
const chartModes = [
  { value: "bar", label: "ستونی", Icon: BarChartOutlined },
  { value: "line", label: "خطی", Icon: LineChartOutlined },
  { value: "share", label: "سهم از کل", Icon: PercentageOutlined },
] as const;

function bucketLabel(bucket: ActivityBucket) {
  const end = formatPersianDate(bucket.end, { format: "D MMMM YYYY" });
  return bucket.start === bucket.end
    ? end
    : formatPersianDate(bucket.start, { format: "D MMMM YYYY" }) + " تا " + end;
}

function Plot({
  buckets,
  current,
  upper,
  mode,
  onSelect,
}: {
  buckets: ActivityBucket[];
  current: ActivityBucket;
  upper: number;
  mode: Exclude<ChartMode, "share">;
  onSelect: (bucket: ActivityBucket) => void;
}) {
  const ticks = [4, 3, 2, 1, 0];
  const positions = buckets.map(({ count }, index) => ({
    x: 100 - ((index + 0.5) / buckets.length) * 100,
    y: 100 - (count / upper) * 100,
  }));
  // The plot reads right to left, so the oldest interval starts on the right.
  const line = [
    ...positions.map(({ x, y }) => x + "% calc(" + y + "% - 1px)"),
    ...positions.toReversed().map(({ x, y }) => x + "% calc(" + y + "% + 1px)"),
  ];
  return (
    <div className="grid grid-cols-[2.25rem_minmax(0,1fr)] gap-x-2 pt-2 sm:gap-x-3">
      <div
        className="flex h-40 flex-col justify-between text-end text-[10px] text-(--ui-muted-text) sm:h-48"
        aria-hidden="true"
      >
        {ticks.map((tick) => (
          <span key={tick} className="-translate-y-1/2">
            {number.format(tick * (upper / 4))}
          </span>
        ))}
      </div>
      <div className="min-w-0">
        <div className="relative h-40 sm:h-48">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 flex flex-col justify-between"
          >
            {ticks.map((tick) => (
              <span
                key={tick}
                className="border-t border-dashed border-(--ui-border)"
              />
            ))}
          </div>
          {mode === "line" && positions.length > 1 && (
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 bg-emerald-600 dark:bg-emerald-400"
              style={{ clipPath: "polygon(" + line.join(", ") + ")" }}
            />
          )}
          <div className="absolute inset-0 grid grid-flow-col auto-cols-fr">
            {buckets.map((bucket) => {
              const selected = current.start === bucket.start;
              const height = (bucket.count / upper) * 100 + "%";
              return (
                <button
                  key={bucket.start}
                  type="button"
                  aria-label={
                    bucketLabel(bucket) +
                    "، " +
                    number.format(bucket.count) +
                    " سفارش"
                  }
                  aria-pressed={selected}
                  title={
                    bucketLabel(bucket) +
                    " · " +
                    number.format(bucket.count) +
                    " سفارش"
                  }
                  onClick={() => onSelect(bucket)}
                  className="group relative min-w-0 rounded-lg text-emerald-600 transition-colors hover:bg-emerald-500/5 focus-visible:z-10 focus-visible:outline-2 focus-visible:outline-emerald-600 dark:text-emerald-400"
                >
                  {mode === "bar" ? (
                    <span
                      aria-hidden="true"
                      className={
                        "absolute bottom-0 left-1/2 w-3/4 max-w-12 -translate-x-1/2 rounded-t-md " +
                        (selected
                          ? "bg-emerald-700 dark:bg-emerald-400"
                          : "bg-emerald-200 group-hover:bg-emerald-400 dark:bg-emerald-800 dark:group-hover:bg-emerald-600")
                      }
                      style={{ height: "max(2px, " + height + ")" }}
                    />
                  ) : (
                    <span
                      aria-hidden="true"
                      className={
                        "absolute left-1/2 size-2.5 -translate-x-1/2 translate-y-1/2 rounded-full border-2 border-current " +
                        (selected
                          ? "bg-current ring-2 ring-emerald-500/25"
                          : "bg-(--ui-panel)")
                      }
                      style={{ bottom: height }}
                    />
                  )}
                </button>
              );
            })}
          </div>
        </div>
        <div
          aria-hidden="true"
          className="mt-1.5 grid grid-flow-col auto-cols-fr text-center text-[10px] text-(--ui-muted-text)"
        >
          {buckets.map((bucket, index) => (
            <span
              key={bucket.start}
              className={
                "min-w-0 truncate " +
                (index % 2 !== 0 && index !== buckets.length - 1
                  ? "max-sm:invisible"
                  : "")
              }
            >
              {formatPersianDate(bucket.start, { format: "D/M" })}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function OrderActivityChart({
  buckets,
}: {
  buckets: ActivityBucket[];
}) {
  const { mode, setMode } = useChartMode();
  const [active, setActive] = useState<string | null>(null);
  const total = buckets.reduce((sum, bucket) => sum + bucket.count, 0);
  const peak = buckets.reduce<ActivityBucket | null>(
    (highest, bucket) =>
      !highest || bucket.count >= highest.count ? bucket : highest,
    null,
  );
  const current = buckets.find((bucket) => bucket.start === active) ?? peak;
  const chooseBucket = (bucket: ActivityBucket) => setActive(bucket.start);

  return (
    <>
      <div
        role="group"
        aria-label="نوع نمودار سفارش‌ها"
        className="mb-4 flex w-fit max-w-full flex-wrap gap-1 rounded-xl border border-(--ui-border) bg-(--ui-muted-panel) p-1"
      >
        {chartModes.map(({ value, label, Icon }) => (
          <button
            key={value}
            type="button"
            aria-pressed={mode === value}
            onClick={() => setMode(value)}
            className={
              "inline-flex min-h-9 items-center gap-1.5 rounded-lg px-2 text-xs font-bold outline-offset-2 focus-visible:outline-2 focus-visible:outline-emerald-600 sm:px-3 " +
              (mode === value
                ? "bg-(--button-tint) text-(--button-accent)"
                : "text-(--ui-muted-text) hover:bg-(--ui-panel)")
            }
          >
            <Icon aria-hidden="true" /> {label}
          </button>
        ))}
      </div>
      {total === 0 || !current || !peak ? (
        <div className="grid min-h-44 place-items-center rounded-2xl border border-dashed border-(--ui-border) bg-(--ui-muted-panel) px-4 text-center text-sm text-(--ui-muted-text)">
          در این بازه سفارشی ثبت نشده است.
        </div>
      ) : (
        <>
          <div className="mb-3 flex flex-wrap items-center justify-between gap-2 text-xs text-(--ui-muted-text)">
            <div className="inline-flex items-center gap-2">
              <span
                className="size-2.5 rounded-sm bg-emerald-500"
                aria-hidden="true"
              />
              {mode === "share"
                ? "سهم هر دوره از کل سفارش‌ها"
                : "تعداد سفارش‌های ثبت‌شده"}
            </div>
            <div
              aria-live="polite"
              aria-atomic="true"
              className="flex max-w-full flex-wrap items-center gap-x-2.5 gap-y-1 rounded-lg bg-(--ui-muted-panel) px-2.5 py-1.5"
            >
              <bdi dir="rtl" className="min-w-0 wrap-break-word">
                {bucketLabel(current)}
              </bdi>
              <span className="inline-flex max-w-full flex-wrap items-center gap-2 rounded-md bg-(--ui-panel) px-2 py-0.5 font-semibold text-(--ui-text)">
                <bdi dir="rtl" className="tabular-nums">
                  {number.format(current.count)} سفارش
                </bdi>
                {mode === "share" && (
                  <bdi
                    dir="rtl"
                    className="tabular-nums text-(--button-accent)"
                  >
                    {percent.format(current.count / total)}
                  </bdi>
                )}
              </span>
            </div>
          </div>
          {mode === "share" ? (
            <ul className="grid gap-1.5">
              {buckets.map((bucket) => {
                const share = bucket.count / total;
                return (
                  <li key={bucket.start}>
                    <button
                      type="button"
                      aria-pressed={current.start === bucket.start}
                      onClick={() => chooseBucket(bucket)}
                      className={
                        "grid w-full grid-cols-[minmax(0,1fr)_minmax(2rem,0.7fr)_3.25rem] items-center gap-2 rounded-lg px-2 py-1.5 text-start text-xs outline-offset-2 focus-visible:outline-2 focus-visible:outline-emerald-600 " +
                        (current.start === bucket.start
                          ? "bg-(--button-tint)"
                          : "hover:bg-(--ui-muted-panel)")
                      }
                    >
                      <span className="min-w-0 wrap-break-word">
                        {bucketLabel(bucket)}
                      </span>
                      <span
                        aria-hidden="true"
                        className="h-2 rounded-full bg-(--ui-border)"
                      >
                        <span
                          className="block h-2 rounded-full bg-emerald-600 dark:bg-emerald-400"
                          style={{ width: share * 100 + "%" }}
                        />
                      </span>
                      <span className="text-end font-bold tabular-nums">
                        {percent.format(share)}
                      </span>
                    </button>
                  </li>
                );
              })}
            </ul>
          ) : (
            <Plot
              buckets={buckets}
              current={current}
              upper={Math.max(1, Math.ceil(peak.count / 4)) * 4}
              mode={mode}
              onSelect={chooseBucket}
            />
          )}
        </>
      )}
    </>
  );
}
