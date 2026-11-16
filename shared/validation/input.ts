import { z } from "zod";

export const INVALID_FORM_MESSAGE = "لطفاً خطاهای فرم را اصلاح کنید.";

export const validationMessages = {
  required: "تکمیل این فیلد الزامی است.",
  default: "مقدار واردشده معتبر نیست.",
  types: {
    number: "عدد معتبر وارد کنید.",
    integer: "عدد صحیح وارد کنید.",
    email: "ایمیل معتبر وارد کنید.",
  },
};

export const validationOptions: z.core.ParseContext<z.core.$ZodIssue> = {
  error: (issue) => {
    switch (issue.code) {
      case "invalid_type":
        if (issue.input == null || issue.input === "")
          return validationMessages.required;
        if (issue.expected === "number") return validationMessages.types.number;
        if (issue.expected === "int") return validationMessages.types.integer;
        if (issue.expected === "date") return "تاریخ معتبر انتخاب کنید.";
        return validationMessages.default;
      case "too_small":
        return issue.origin === "string"
          ? `حداقل ${issue.minimum} نویسه وارد کنید.`
          : `مقدار باید ${issue.inclusive ? "حداقل" : "بیشتر از"} ${issue.minimum} باشد.`;
      case "too_big":
        return issue.origin === "string"
          ? `حداکثر ${issue.maximum} نویسه وارد کنید.`
          : `مقدار باید ${issue.inclusive ? "حداکثر" : "کمتر از"} ${issue.maximum} باشد.`;
      case "invalid_format":
        if (issue.format === "email") return validationMessages.types.email;
        if (issue.format === "date" || issue.format === "datetime")
          return "تاریخ معتبر انتخاب کنید.";
        return validationMessages.default;
      case "invalid_union":
        return issue.input == null || issue.input === ""
          ? validationMessages.required
          : validationMessages.default;
      default:
        return validationMessages.default;
    }
  },
};

export class InputValidationError extends Error {
  constructor(
    public readonly fieldErrors: Record<string, string[]>,
    message = INVALID_FORM_MESSAGE,
  ) {
    super(message);
    this.name = "InputValidationError";
  }
}

export function parseInput<T extends z.ZodType>(
  schema: T,
  input: unknown,
): z.output<T> {
  const result = schema.safeParse(input, validationOptions);
  if (!result.success) {
    const fields: Record<string, string[]> = {};
    for (const issue of result.error.issues) {
      const key = issue.path.join(".");
      (fields[key] ??= []).push(issue.message);
    }
    throw new InputValidationError(fields);
  }
  return result.data;
}

export const sqlInteger = z.number().int().min(-2147483648).max(2147483647);
export const recordIdSchema = sqlInteger.positive();
export const optionalText = (length: number) =>
  z.string().max(length).nullish();
export const optionalNumber = z.number().finite().nullish();
export const optionalCount = sqlInteger.nonnegative().nullish();
export function sqlDecimal(precision: number, scale: number) {
  const step = 10 ** -scale;
  const limit = (10 ** precision - 1) / 10 ** scale;
  return z
    .number()
    .min(-limit)
    .max(limit)
    .multipleOf(step, {
      message: `حداکثر ${scale} رقم اعشار وارد کنید.`,
    });
}
export const optionalId = recordIdSchema.nullish();
export const calendarDateSchema = z
  .union([z.date(), z.iso.datetime({ offset: true }), z.iso.date()])
  .transform((value) => {
    // Prisma represents SQL Server DATE columns as UTC-midnight Dates.
    const day =
      typeof value === "string"
        ? value.slice(0, 10)
        : value.toISOString().slice(0, 10);
    return new Date(`${day}T00:00:00.000Z`);
  });
export const optionalDate = calendarDateSchema.nullish();

export function assertDateOrder(
  start: Date | null | undefined,
  end: Date | null | undefined,
  field: string,
) {
  if (start && end && end < start) {
    throw new InputValidationError({
      [field]: ["تاریخ پایان نباید قبل از تاریخ شروع باشد."],
    });
  }
}
