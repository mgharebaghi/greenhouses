type DecimalLike = { toNumber(): number };
export type Serialized<T> = T extends Date
  ? string
  : T extends bigint
    ? string
    : T extends Uint8Array
      ? string
      : T extends DecimalLike
        ? number
        : T extends readonly (infer U)[]
          ? Serialized<U>[]
          : T extends object
            ? { [K in keyof T]: Serialized<T[K]> }
            : T;

/** Transport representation for features whose existing DTOs use ISO dates and PNG data URLs. */
export function serializeData<T>(value: T): Serialized<T> {
  if (value == null) return value as Serialized<T>;
  if (typeof value === "bigint") return value.toString() as Serialized<T>;
  if (value instanceof Date) return value.toISOString() as Serialized<T>;
  if (value instanceof Uint8Array)
    return `data:image/png;base64,${Buffer.from(value).toString("base64")}` as Serialized<T>;
  if (Array.isArray(value)) return value.map(serializeData) as Serialized<T>;
  if (typeof value === "object") {
    if ("toNumber" in value && typeof value.toNumber === "function")
      return value.toNumber() as Serialized<T>;
    return Object.fromEntries(
      Object.entries(value).map(([key, item]) => [key, serializeData(item)]),
    ) as Serialized<T>;
  }
  return value as Serialized<T>;
}

export function decimalToNumber(
  value: DecimalLike | null | undefined,
): number | null {
  return value == null ? null : value.toNumber();
}
