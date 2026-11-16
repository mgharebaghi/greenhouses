const persianDigits = "۰۱۲۳۴۵۶۷۸۹";
const arabicDigits = "٠١٢٣٤٥٦٧٨٩";

export function toLatinDigits(value: string) {
  return value.replace(/[۰-۹٠-٩]/g, (digit) =>
    String((persianDigits + arabicDigits).indexOf(digit) % 10),
  );
}

export function toPersianDigits(value: string | number | bigint) {
  return toLatinDigits(String(value)).replace(
    /[0-9]/g,
    (digit) => persianDigits[Number(digit)],
  );
}

export function normalizeNumericInput(value = "", decimalSeparator = "٫") {
  return toLatinDigits(value)
    .replace(decimalSeparator, ".")
    .replace(/[٫。]/g, ".")
    .replace(/−/g, "-")
    .replace(/[,٬\s\u061c\u200e\u200f]/g, "");
}
