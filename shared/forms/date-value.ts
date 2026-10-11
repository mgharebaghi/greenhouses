import DateObject from "react-date-object";

export function toDate(
  value: DateObject | Date | string | null | undefined,
): Date | null {
  if (value == null || value === "") return null;
  return value instanceof DateObject
    ? value.toDate()
    : value instanceof Date
      ? value
      : new Date(value);
}
