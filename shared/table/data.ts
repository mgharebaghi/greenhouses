import { formatPersianDate } from "@/shared/dates/calendar";
import { toLatinDigits } from "@/shared/utils/digits";

export type SortOrder = "asc" | "desc" | null;

export function fieldValue(record: object, field: string): unknown {
  return (record as Record<string, unknown>)[field];
}

function normalizeSearch(text: string) {
  return toLatinDigits(text.normalize("NFKC"))
    .toLowerCase()
    .replace(/٫/g, ".")
    .replace(/(\d)[٬,](?=\d)/g, "$1")
    .replace(/[يى]/g, "ی")
    .replace(/ك/g, "ک")
    .replace(/[\u064b-\u065f\u0670]/g, "")
    .replace(/\u200c/g, " ")
    .replace(/(\d)-(?=\d)/g, "$1/")
    .trim();
}

function collectSearchValues(
  value: unknown,
  values: string[],
  visited: Set<object>,
) {
  if (typeof value === "string") {
    if (value.startsWith("data:")) return;
    values.push(value);
    if (/^\d{4}-\d{2}-\d{2}(?:$|T)/.test(value)) {
      values.push(formatPersianDate(value, { fallback: "" }));
      if (value.includes("T"))
        values.push(
          formatPersianDate(value, { kind: "timestamp", fallback: "" }),
        );
    }
    return;
  }
  if (
    typeof value === "number" ||
    typeof value === "boolean" ||
    typeof value === "bigint"
  ) {
    values.push(String(value));
    return;
  }
  if (value instanceof Date) {
    if (Number.isFinite(value.getTime()))
      collectSearchValues(value.toISOString(), values, visited);
    return;
  }
  if (
    !value ||
    typeof value !== "object" ||
    ArrayBuffer.isView(value) ||
    visited.has(value)
  )
    return;
  if (
    !Array.isArray(value) &&
    Object.getPrototypeOf(value) !== Object.prototype &&
    Object.getPrototypeOf(value) !== null
  )
    return;

  visited.add(value);
  for (const child of Object.values(value))
    collectSearchValues(child, values, visited);
}

export function indexTableRows<T extends object>(
  rows: T[],
  extraValues?: (row: T, index: number) => string[],
) {
  return new Map(
    rows.map((row, index) => {
      const values = extraValues?.(row, index) ?? [];
      collectSearchValues(row, values, new Set());
      return [row, normalizeSearch(values.join(" "))] as const;
    }),
  );
}

export function filterAndSort<T extends object>(
  rows: T[],
  search: string,
  field: string | null,
  order: SortOrder,
  searchIndex?: ReadonlyMap<T, string>,
): T[] {
  const terms = normalizeSearch(search).split(/\s+/).filter(Boolean);
  const index = terms.length ? (searchIndex ?? indexTableRows(rows)) : null;
  const filtered = index
    ? rows.filter((row) =>
        terms.every((term) => index.get(row)?.includes(term)),
      )
    : rows;
  if (!field || !order) return filtered;
  return [...filtered].sort((left, right) => {
    const a = fieldValue(left, field);
    const b = fieldValue(right, field);
    if (a === b) return 0;
    const value =
      a == null
        ? -1
        : b == null
          ? 1
          : typeof a === "number" && typeof b === "number"
            ? a - b
            : String(a) < String(b)
              ? -1
              : 1;
    return order === "asc" ? value : -value;
  });
}

export function visiblePage(
  current: number,
  total: number,
  size: number,
): number {
  return Math.min(Math.max(1, current), Math.max(1, Math.ceil(total / size)));
}

export function displayCell(value: unknown): string | number {
  return value == null || value === ""
    ? "-"
    : typeof value === "number"
      ? value
      : String(value);
}
