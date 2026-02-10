"use server";

import { prisma } from "@/app/lib/singletone";
import bcrypt from "bcryptjs";
import { CreateSession, DeleteSession, ReadSession } from "./session";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export type SignInResult = {
  status: "ok" | "error";
  message?: string;
  user?: User;
};

type User = {
  username: string;
};

export async function signIn(data: { username: string; password: string; remember: boolean }) {
  if (!data.username || !data.password) {
    return { status: "error", message: "نام کاربری و رمز عبور الزامی است." };
  }

  const user = await prisma.users.findUnique({
    where: { Username: data.username },
  });

  if (!user) {
    return { status: "error", message: "کاربری با این مشخصات یافت نشد!" };
  }

  const isPasswordValid = await bcrypt.compare(data.password, user.PasswordHash);
  if (!isPasswordValid) {
    return { status: "error", message: "کلمه عبور صحیح نمی باشد!" };
  }

  const { token, ttlDays } = await CreateSession({ userId: user.ID, remember: data.remember });

  // Set cookies (this is just an example, adapt it to your framework)
  const cookieStore = cookies();
  (await cookieStore).set({
    name: "GHSession", // نام کوکی
    value: token, // مقدار: همون csn_<publicId>.<secret>
    httpOnly: true, // فقط سرور بهش دسترسی داره (محافظت در برابر XSS)
    sameSite: "lax", // پیشگیری CSRF معقول، فرم‌های اول‌-طرف کار می‌کنند
    secure: process.env.NODE_ENV === "production", // روی HTTPS اجباری (پروداکشن)
    path: "/", // در کل سایت معتبر
    // اگر remember=true پایدارش کن؛ در غیر اینصورت Session Cookie باشه
    ...(data.remember ? { maxAge: ttlDays * 24 * 60 * 60 } : {}), // ثانیه
  });

  return { status: "ok", user: { username: user.Username } };
}

export async function requireAuth(route: string) {
  const session = await ReadSession();

  if (session?.status === "ok" && (route === "/" || route === "/login")) redirect("/dashboard");

  if (session?.status === "error" && (session.code === 403 || session?.code === 404)) {
    redirect(`/api/auth/invalid?next=/`);
  }

  if (!session && route !== "/") {
    redirect("/");
  }
}

export async function removeAuth() {
  await DeleteSession();

  redirect("/");
}
