import {
  pickerDateToISO,
  toCalendarDate,
  type DateCalendar,
} from "@/shared/dates/calendar";
import { InputValidationError } from "@/shared/validation/input";

export function seedPackageExpiration(
  productionDate: Date | null | undefined,
  calendar: DateCalendar,
) {
  if (!productionDate) return null;
  const date = toCalendarDate(productionDate, "day", calendar);
  if (date) {
    const day = date.day;
    date.setDay(1).setYear(date.year + 1);
    const iso = pickerDateToISO(date.setDay(Math.min(day, date.month.length)));
    if (iso && /^\d{4}-\d{2}-\d{2}$/.test(iso) && !iso.startsWith("0000"))
      return new Date(`${iso}T00:00:00.000Z`);
  }
  throw new InputValidationError({
    ProductionDate: ["از تاریخ تولید واردشده نمی‌توان تاریخ انقضا ساخت."],
  });
}
