import { z } from "zod";

export class InputValidationError extends Error {
  constructor(
    public readonly fieldErrors: Record<string, string[]>,
    message = "لطفاً خطاهای فرم را اصلاح کنید.",
  ) {
    super(message);
    this.name = "InputValidationError";
  }
}

export function parseInput<T extends z.ZodType>(
  schema: T,
  input: unknown,
): z.output<T> {
  const result = schema.safeParse(input);
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

export const recordIdSchema = z.number().int().positive();
export const optionalText = (length: number) =>
  z.string().max(length).nullish();
export const optionalNumber = z.number().finite().nullish();
export const optionalCount = z.number().int().nonnegative().nullish();
export const optionalId = recordIdSchema.nullish();
export const optionalDate = z
  .union([z.date(), z.iso.datetime({ offset: true }), z.iso.date()])
  .transform((value) => (value instanceof Date ? value : new Date(value)))
  .nullish();

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
