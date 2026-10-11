import { z } from "zod";
export const signInInputSchema = z.object({
  username: z.string().min(1, "نام کاربری الزامی است.").max(150),
  password: z.string().min(1, "رمز عبور الزامی است."),
  remember: z.boolean().default(false),
});
