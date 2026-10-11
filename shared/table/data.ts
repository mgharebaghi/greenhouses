export type SortOrder = "asc" | "desc" | null;
export type SearchColumn = { dataIndex?: string; searchable?: boolean };

export function fieldValue(record: object, field: string): unknown {
  return (record as Record<string, unknown>)[field];
}

export function filterAndSort<T extends object>(
  rows: T[],
  columns: SearchColumn[],
  search: string,
  field: string | null,
  order: SortOrder,
): T[] {
  const query = search.toLowerCase();
  const filtered = query
    ? rows.filter((record) =>
        columns.some(
          (column) =>
            column.searchable !== false &&
            column.dataIndex &&
            String(fieldValue(record, column.dataIndex) ?? "")
              .toLowerCase()
              .includes(query),
        ),
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
