import { InputValidationError } from "@/shared/validation/input";

export function nextPersonCode(previous: string | null | undefined) {
  const next = (Number.parseInt(previous ?? "0", 10) || 0) + 1;
  const code = String(next);
  if (next < 1 || code.length > 6)
    throw new InputValidationError({
      PersonCode: ["ظرفیت کد شخص تمام شده است. با مدیر سیستم تماس بگیرید."],
    });
  return code;
}
