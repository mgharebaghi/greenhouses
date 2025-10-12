"use client";
import type { ColumnsType, ColumnType } from "antd/es/table";

type Row = Record<string, any>;

export type ValueGetters<T> = Record<string, (row: T) => any>;
export type HeaderOverrides = Record<string, string>;

export type ColumnFormatters<T> = Record<string, (row: T, rawValue: any) => any>;

export type CsvOptions<T> = {
  getters?: ValueGetters<T>; // فقط برای ستون‌های بدون dataIndex (مثل قبل)
  formatters?: ColumnFormatters<T>; // ✅ جدید: روی هر ستونی اعمال می‌شود
  headerOverrides?: HeaderOverrides;
  excludeKeys?: string[];
  forceExcelSeparatorLine?: boolean;
};

function pathToString(di: any): string | null {
  if (di == null) return null;
  return Array.isArray(di) ? di.join(".") : String(di);
}

function toText(x: any) {
  if (x == null) return "";
  if (x instanceof Date) return x.toISOString();
  if (typeof x === "object" && "toNumber" in x && typeof (x as any).toNumber === "function")
    return (x as any).toNumber();
  if (typeof x === "object" && "toString" in x && typeof (x as any).toString === "function")
    return (x as any).toString();
  if (typeof x === "object") return JSON.stringify(x);
  return String(x);
}

function getByPath(row: Row, path: string | (string | number)[]) {
  if (Array.isArray(path)) return path.reduce((acc: any, k) => acc?.[k] ?? "", row);
  return row?.[path] ?? "";
}

function flattenColumns<T>(cols: ColumnsType<T>): ColumnType<T>[] {
  const out: ColumnType<T>[] = [];
  const walk = (arr: any[]) => {
    for (const c of arr) {
      if (c?.children && Array.isArray(c.children)) walk(c.children);
      else out.push(c);
    }
  };
  walk(cols as any[]);
  return out;
}

function extractText(node: any): string {
  if (node == null || node === false) return "";
  if (typeof node === "string" || typeof node === "number") return String(node);
  if (typeof node === "object" && "props" in node && (node as any).props) {
    const ch = (node as any).props.children;
    if (Array.isArray(ch)) return ch.map(extractText).join(" ").trim();
    return extractText(ch);
  }
  return "";
}

function titleForColumn(col: any, overrides?: HeaderOverrides): string {
  const key = col?.key as string | undefined;
  if (key && overrides?.[key]) return overrides[key];
  const t = extractText(col?.title);
  if (t) return t;
  if (key) return key;
  return "";
}

function toCSV<T>(rows: T[], columns: ColumnsType<T>, opts: CsvOptions<T> = {}) {
  const { getters, formatters, headerOverrides, excludeKeys = [], forceExcelSeparatorLine = true } = opts;

  const leafCols = flattenColumns(columns)
    .filter((c) => c.title != null)
    .filter((c) => !excludeKeys.includes(String(c.key ?? "")));

  const headers = leafCols.map((c) => titleForColumn(c, headerOverrides));
  const head = headers.map((h) => `"${h.replace(/"/g, '""')}"`).join(",");

  const body = rows
    .map((r) =>
      leafCols
        .map((c) => {
          const key = (c as any).key as string | undefined;
          const di = c.dataIndex as any;
          const diStr = pathToString(di);

          // 1) مقدار خام از dataIndex یا getters (قدیمی)
          let raw: any = "";
          if (di != null) raw = getByPath(r as any, di);
          else if (key && getters?.[key]) raw = getters[key](r as any);
          else raw = "";

          // 2) formatter اختیاری (روی هر ستونی اعمال می‌شود)
          const fmt = (key && formatters?.[key]) || (diStr && formatters?.[diStr]);

          const val = fmt ? fmt(r as any, raw) : raw;

          const s = toText(val).replace(/"/g, '""');
          return `"${s}"`;
        })
        .join(",")
    )
    .join("\n");

  const sep = forceExcelSeparatorLine ? "sep=,\n" : "";
  return sep + head + "\n" + body;
}

export function downloadCSVFromAntd<T>(
  rows: T[],
  columns: ColumnsType<T>,
  filename = "table.csv",
  opts: CsvOptions<T> = {}
) {
  const csv = "\uFEFF" + toCSV(rows, columns, opts);
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}
