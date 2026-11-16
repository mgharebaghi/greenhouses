import { z } from "zod";
import { recordIdSchema } from "@/shared/validation/input";
import { toLatinDigits } from "@/shared/utils/digits";
import { normalizeIranianPhone } from "@/shared/utils/phone";

export const LEGAL_PERSON_POST_ID = 13;

const peoplePostSchema = z.object({
  PostName: z.string().nullable(),
  ID: z.number(),
});

const databaseItemsSchema = z.object({
  ID: z.number(),
  Legal: z.boolean().nullable(),
  FirstName: z.string().nullable(),
  LastName: z.string().nullable(),
  PersonCode: z.string().nullable(),
  NationalCode: z.string().nullable(),
  PhoneNumber: z.string().transform(normalizeIranianPhone).nullable(),
  EmailAddress: z.string().nullable(),
  Profession: z.string().nullable(),
  CompanyName: z.string().nullable(),
  CompanyEconomicCode: z.string().nullable(),
  CompanyRegistrationCode: z.string().nullable(),
  Tbl_PeoplePosts: peoplePostSchema.nullable(),
});

export const peopleReadDTO = databaseItemsSchema.transform((item) => {
  return {
    ...item,
    PostName: item.Tbl_PeoplePosts?.PostName ?? null,
    PostID: item.Tbl_PeoplePosts?.ID ?? null,
  };
});

export type PeopleReadDTO = z.infer<typeof peopleReadDTO>;

const nullableText = (schema: z.ZodString) =>
  z
    .preprocess(
      (value) => (typeof value === "string" ? value.trim() || null : value),
      schema.nullish(),
    )
    .transform((value) => value ?? null);

export const commonPersonFields = {
  PhoneNumber: z
    .string({ error: "شماره تماس الزامی است" })
    .trim()
    .min(10, "شماره تماس حداقل ۱۰ کاراکتر باشد")
    .max(150, "شماره تماس حداکثر ۱۵۰ کاراکتر باشد")
    .transform(normalizeIranianPhone),
  EmailAddress: nullableText(
    z
      .string()
      .email("ایمیل معتبر وارد کنید؛ مانند name@example.com")
      .max(50, "ایمیل حداکثر ۵۰ کاراکتر باشد"),
  ),
  Profession: nullableText(
    z
      .string()
      .min(3, "تخصص حداقل ۳ حرف باشد")
      .max(150, "تخصص حداکثر ۱۵۰ حرف باشد"),
  ),
};

export const naturalPersonFields = {
  FirstName: z
    .string({ error: "نام الزامی است" })
    .trim()
    .min(3, "نام حداقل ۳ حرف باشد")
    .max(150, "نام حداکثر ۱۵۰ حرف باشد"),
  LastName: z
    .string({ error: "نام خانوادگی الزامی است" })
    .trim()
    .min(3, "نام خانوادگی حداقل ۳ حرف باشد")
    .max(150, "نام خانوادگی حداکثر ۱۵۰ حرف باشد"),
  NationalCode: z
    .string({ error: "کد ملی الزامی است" })
    .trim()
    .transform(toLatinDigits)
    .pipe(z.string().regex(/^[0-9]{10}$/, "کد ملی باید دقیقاً ۱۰ رقم باشد")),
  PostID: recordIdSchema.refine(
    (id) => id !== LEGAL_PERSON_POST_ID,
    "سمت شخصیت حقوقی فقط برای شخص حقوقی قابل انتخاب است",
  ),
};

export const legalPersonFields = {
  NationalCode: z
    .string({ error: "شناسه ملی الزامی است" })
    .trim()
    .regex(/^[0-9۰-۹٠-٩]{1,11}$/, "شناسه ملی باید بین ۱ تا ۱۱ رقم باشد")
    .transform(toLatinDigits),
  CompanyName: z
    .string({ error: "نام شرکت الزامی است" })
    .trim()
    .min(1, "نام شرکت الزامی است")
    .max(150, "نام شرکت حداکثر ۱۵۰ حرف باشد"),
  CompanyEconomicCode: nullableText(
    z.string().max(50, "کد اقتصادی حداکثر ۵۰ کاراکتر باشد"),
  ),
  CompanyRegistrationCode: nullableText(
    z.string().max(50, "شماره ثبت حداکثر ۵۰ کاراکتر باشد"),
  ),
};

const naturalPersonSchema = z.object({
  Legal: z.literal(false),
  ...commonPersonFields,
  ...naturalPersonFields,
});
const legalPersonSchema = z.object({
  Legal: z.literal(true),
  ...commonPersonFields,
  ...legalPersonFields,
});
const legalPersonUpdateSchema = legalPersonSchema.extend({
  NationalCode: legalPersonFields.NationalCode.optional(),
});

function normalizePerson(
  person: z.output<typeof naturalPersonSchema | typeof legalPersonUpdateSchema>,
) {
  if (person.Legal)
    return {
      ...person,
      PostID: LEGAL_PERSON_POST_ID,
      FirstName: null,
      LastName: null,
    };
  return {
    ...person,
    CompanyName: null,
    CompanyEconomicCode: null,
    CompanyRegistrationCode: null,
  };
}

export const personInputSchema = z
  .discriminatedUnion("Legal", [naturalPersonSchema, legalPersonSchema])
  .transform(normalizePerson);

export const personUpdateSchema = z
  .discriminatedUnion("Legal", [naturalPersonSchema, legalPersonUpdateSchema])
  .transform(normalizePerson);

export type PersonInput = {
  Legal: boolean;
  PersonCode?: string;
  FirstName?: string;
  LastName?: string;
  NationalCode: string;
  PhoneNumber: string;
  EmailAddress?: string;
  Profession?: string;
  PostID?: number;
  CompanyName?: string;
  CompanyEconomicCode?: string;
  CompanyRegistrationCode?: string;
};
