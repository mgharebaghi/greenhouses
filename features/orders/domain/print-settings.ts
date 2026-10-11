export const LABEL_SIZES = [
  { label: "تنظیمات پرینتر ", value: "auto" },
  { label: "۱۰ × ۱۰ میلی‌متر (مربعی کوچک)", value: "10mm 10mm" },
  { label: "۱۵ × ۱۵ میلی‌متر (مربعی)", value: "15mm 15mm" },
  { label: "۲۰ × ۲۰ میلی‌متر (مربعی)", value: "20mm 20mm" },
  { label: "۲۵ × ۲۵ میلی‌متر (مربعی استاندارد)", value: "25mm 25mm" },
  { label: "۳۰ × ۳۰ میلی‌متر (مربعی متوسط)", value: "30mm 30mm" },
  { label: "۳۵ × ۳۵ میلی‌متر", value: "35mm 35mm" },
  { label: "۴۰ × ۴۰ میلی‌متر (مربعی بزرگ)", value: "40mm 40mm" },
  { label: "۵۰ × ۵۰ میلی‌متر", value: "50mm 50mm" },
  { label: "۲۰ × ۱۰ میلی‌متر", value: "20mm 10mm" },
  { label: "۲۵ × ۱۵ میلی‌متر", value: "25mm 15mm" },
  { label: "۳۰ × ۲۰ میلی‌متر", value: "30mm 20mm" },
  { label: "۳۵ × ۲۵ میلی‌متر", value: "35mm 25mm" },
  { label: "۴۰ × ۲۰ میلی‌متر", value: "40mm 20mm" },
  { label: "۴۰ × ۳۰ میلی‌متر", value: "40mm 30mm" },
  { label: "۴۰ × ۶۰ میلی‌متر", value: "40mm 60mm" },
  { label: "۴۵ × ۳۰ میلی‌متر", value: "45mm 30mm" },
  { label: "۵۰ × ۲۵ میلی‌متر", value: "50mm 25mm" },
  { label: "۵۰ × ۳۰ میلی‌متر", value: "50mm 30mm" },
  { label: "۵۰ × ۴۰ میلی‌متر", value: "50mm 40mm" },
  { label: "۵۵ × ۳۰ میلی‌متر", value: "55mm 30mm" },
  { label: "۶۰ × ۳۰ میلی‌متر", value: "60mm 30mm" },
  { label: "۶۰ × ۴۰ میلی‌متر", value: "60mm 40mm" },
  { label: "۷۰ × ۴۰ میلی‌متر", value: "70mm 40mm" },
  { label: "۷۰ × ۵۰ میلی‌متر", value: "70mm 50mm" },
  { label: "۸۰ × ۵۰ میلی‌متر", value: "80mm 50mm" },
  { label: "۱۰۰ × ۵۰ میلی‌متر", value: "100mm 50mm" },
  { label: "۱۰۰ × ۸۰ میلی‌متر (بزرگ)", value: "100mm 80mm" },
  { label: "۱۰۰ × ۱۵۰ میلی‌متر (لیبل پستی)", value: "100mm 150mm" },
];
export const QR_LABEL_SIZES = [
  { label: "۱۰ × ۱۰ میلی‌متر", value: "10mm" },
  { label: "۲۰ × ۲۰ میلی‌متر", value: "20mm" },
  { label: "۳۰ × ۳۰ میلی‌متر", value: "30mm" },
  { label: "۴۰ × ۴۰ میلی‌متر", value: "40mm" },
  { label: "۵۰ × ۵۰ میلی‌متر", value: "50mm" },
  { label: "۶۰ × ۶۰ میلی‌متر", value: "60mm" },
  { label: "تمام صفحه (Full)", value: "100%" },
];
export const PLANT_TYPE_OPTIONS = [
  { label: "—  (بدون انتخاب)", value: "" },
  { label: "گیاه پایه (Root Stock)", value: "rootstock" },
  { label: "پیوندک (Scion)", value: "scion" },
  { label: "نشاء پیوندی (Grafted)", value: "grafted" },
];
export function parseLabelSize(value: string): {
  width: string;
  height: string;
} {
  if (value === "auto") return { width: "100mm", height: "100mm" };
  const parts = value.trim().split(/\s+/);
  if (parts.length === 2) return { width: parts[0], height: parts[1] };
  return { width: parts[0], height: parts[0] };
}
