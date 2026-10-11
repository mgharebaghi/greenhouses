import { z } from "zod";

const peoplePostSchema = z.object({
  PostName: z.string().nullable(),
  ID: z.number(),
});

export const databaseItemsSchema = z.object({
  ID: z.number(),
  FirstName: z.string().nullable(),
  LastName: z.string().nullable(),
  PersonCode: z.string().nullable(),
  NationalCode: z.string().nullable(),
  PhoneNumber: z.string().nullable(),
  EmailAddress: z.string().nullable(),
  Profesion: z.string().nullable(),
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

// Input rules apply before writes; historical data only needs the read DTO shape.
export const personInputSchema = z.object({
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
  PersonCode: z
    .string({ error: "کد شخص الزامی است" })
    .trim()
    .min(1, "کد شخص الزامی است")
    .max(6, "کد شخص حداکثر ۶ کاراکتر باشد"),
  NationalCode: z
    .string({ error: "کد ملی الزامی است" })
    .trim()
    .regex(/^[0-9]{10}$/, "کد ملی باید دقیقاً ۱۰ رقم انگلیسی باشد"),
  PhoneNumber: z
    .string({ error: "شماره تماس الزامی است" })
    .trim()
    .min(10, "شماره تماس حداقل ۱۰ کاراکتر باشد")
    .max(150, "شماره تماس حداکثر ۱۵۰ کاراکتر باشد"),
  EmailAddress: z
    .string({ error: "ایمیل الزامی است" })
    .trim()
    .min(1, "ایمیل الزامی است")
    .email("ایمیل معتبر وارد کنید؛ مانند name@example.com")
    .max(50, "ایمیل حداکثر ۵۰ کاراکتر باشد"),
  Profesion: z
    .string({ error: "تخصص الزامی است" })
    .trim()
    .min(3, "تخصص حداقل ۳ حرف باشد")
    .max(150, "تخصص حداکثر ۱۵۰ حرف باشد"),
  PostID: z
    .number({ error: "سمت را انتخاب کنید" })
    .int("سمت معتبر انتخاب کنید")
    .positive("سمت را انتخاب کنید"),
});

export type PersonInput = z.infer<typeof personInputSchema>;
