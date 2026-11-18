"use client";

import type { SeedVariety } from "@/shared/contracts/seed-variety";
import clsx from "clsx";
import { useId } from "react";

const seedTypes = [
  { value: false, label: "گیاه پایه", english: "Rootstock" },
  { value: true, label: "پیوندک", english: "Scion" },
] as const;

export function renderSeedType(value: boolean | null | undefined) {
  if (value == null) return "—";
  const { label, english } = seedTypes[value ? 1 : 0];
  return (
    <span
      className={clsx(
        "inline-flex w-fit flex-wrap items-baseline gap-x-1 rounded-md px-2 py-0.5 text-xs font-semibold",
        value
          ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/50 dark:text-emerald-200"
          : "bg-cyan-100 text-cyan-800 dark:bg-cyan-900/50 dark:text-cyan-200",
      )}
    >
      {label}
      <bdi lang="en" dir="ltr" className="font-normal">
        ({english})
      </bdi>
    </span>
  );
}

function renderVariety(variety: SeedVariety | null | undefined) {
  const plant = variety?.Tbl_Plants?.CommonName?.trim();
  return (
    <span className="flex min-w-0 flex-wrap items-baseline gap-x-1.5 text-sm [overflow-wrap:anywhere]">
      <bdi>{variety?.VarietyName || "—"}</bdi>
      {plant && (
        <span className="text-xs text-(--ui-muted-text)">({plant})</span>
      )}
    </span>
  );
}

export function renderSeedInfo(
  value: boolean | null | undefined,
  variety: SeedVariety | null | undefined,
) {
  if (value == null) return "—";
  return (
    <div className="flex min-w-0 flex-col gap-1">
      {renderSeedType(value)}
      {renderVariety(variety)}
    </div>
  );
}

export function SeedTypePicker({
  value,
  onChange,
  rootstock,
  scion,
}: {
  value: boolean | null | undefined;
  onChange: (value: boolean) => void;
  rootstock?: SeedVariety | null;
  scion?: SeedVariety | null;
}) {
  const name = useId();
  return (
    <fieldset className="grid min-w-0 grid-cols-1 gap-4 sm:grid-cols-2">
      <legend className="sr-only">نوع بذر</legend>
      {seedTypes.map(({ value: type, label }) => (
        <label
          key={label}
          className={clsx(
            "grid min-w-0 cursor-pointer gap-2 rounded-xl border-2 p-3 text-(--ui-text) transition-colors focus-within:outline-2 focus-within:outline-emerald-600",
            value === type
              ? "border-emerald-500 bg-(--button-tint)"
              : "border-(--ui-border) bg-(--ui-muted-panel) hover:border-emerald-400",
          )}
        >
          <span className="flex items-center justify-between gap-2">
            {renderSeedType(type)}
            <input
              type="radio"
              name={name}
              checked={value === type}
              onChange={() => onChange(type)}
              aria-label={label}
              className="size-4 shrink-0 accent-emerald-700 dark:accent-emerald-400"
            />
          </span>
          {renderVariety(type ? scion : rootstock)}
        </label>
      ))}
    </fieldset>
  );
}
