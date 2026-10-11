export type CsvValue = string | number | boolean | null | undefined;
export type CsvHeader = { displayLabel: string; key: string };

/** Only selected columns reach the CSV writer; relation objects stay in the UI DTO. */
export function csvRows(
  rows: object[],
  headers: CsvHeader[],
): Record<string, CsvValue>[] {
  return rows.map(
    (row) =>
      Object.fromEntries(
        headers.map(({ key }) => {
          const value = (row as Record<string, unknown>)[key];
          return [
            key,
            value instanceof Date
              ? value.toISOString()
              : value == null ||
                  ["string", "number", "boolean"].includes(typeof value)
                ? value
                : String(value),
          ];
        }),
      ) as Record<string, CsvValue>,
  );
}
