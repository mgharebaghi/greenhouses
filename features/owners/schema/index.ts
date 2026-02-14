import { z } from "zod";

const peoplePostSchema = z.object({
    PostName: z.string().min(3, "نام پست حداقل 3 حرف باشد"),
    ID: z.number(),
});

export const databaseItemsSchema = z.object({
    ID: z.number(),
    FirstName: z.string().min(3, "نام حداقل 3 حرف باشد").nullable(),
    LastName: z.string().min(3, "نام خانوادگی حداقل 3 حرف باشد").nullable(),
    PersonCode: z.string().min(4, "کد باید حد اقل 4 حرف باشد").nullable(),
    NationalCode: z.string().min(10, "کد ملی حداقل 10 حرف باشد").nullable(),
    PhoneNumber: z.string().min(10, "تلفن حداقل 10 حرف باشد").nullable(),
    EmailAddress: z.string().min(10, "ایمیل حداقل 10 حرف باشد").nullable(),
    Profesion: z.string().min(3, "شغل حداقل 3 حرف باشد").nullable(),
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