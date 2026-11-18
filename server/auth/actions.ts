"use server";

import { prisma } from "@/server/db/prisma";
import bcrypt from "bcryptjs";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { CreateSession, DeleteSession, ReadSession } from "./session";
import { signInInputSchema } from "@/features/auth/schema";
import { parseInput } from "@/shared/validation/input";
import { actionError, readError } from "../actions/errors";

export type SignInResult = {
  status: "ok" | "error";
  message?: string;
  user?: User;
};

type User = {
  username: string;
};

const databaseUnavailableMessage =
  "ارتباط با پایگاه داده برقرار نشد. لطفاً کمی بعد دوباره تلاش کنید.";

function isDatabaseUnavailable(error: unknown) {
  if (!(error instanceof Error)) return false;
  const code =
    "errorCode" in error && error.errorCode != null
      ? error.errorCode
      : "code" in error
        ? error.code
        : undefined;
  return (
    code === "P1001" ||
    code === "P1002" ||
    (error.name === "PrismaClientInitializationError" &&
      code == null &&
      error.message.includes("Can't reach database server"))
  );
}

export async function signIn(input: unknown): Promise<SignInResult> {
  try {
    const data = parseInput(signInInputSchema, input);
    if (!data.username || !data.password) {
      return { status: "error", message: "نام کاربری و رمز عبور الزامی است." };
    }

    const user = await prisma.users.findUnique({
      where: { Username: data.username },
    });

    if (user?.IsActive !== true) {
      return { status: "error", message: "کاربری با این مشخصات یافت نشد!" };
    }

    const isPasswordValid = await bcrypt.compare(
      data.password,
      user.PasswordHash,
    );
    if (!isPasswordValid) {
      return { status: "error", message: "کلمه عبور صحیح نمی باشد!" };
    }

    const { token, ttlDays } = await CreateSession({
      userId: user.ID,
      remember: data.remember,
    });

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
  } catch (error) {
    if (isDatabaseUnavailable(error)) {
      return { status: "error", message: databaseUnavailableMessage };
    }
    return actionError(error);
  }
}

export async function requireAuth(route: string) {
  let session: Awaited<ReturnType<typeof ReadSession>>;
  try {
    session = await ReadSession();
  } catch (error) {
    if (route === "/" && isDatabaseUnavailable(error)) {
      return databaseUnavailableMessage;
    }
    throw readError(error);
  }

  if (session?.status === "ok" && (route === "/" || route === "/login"))
    redirect("/dashboard");

  if (
    session?.status === "error" &&
    (session.code === 403 || session?.code === 404)
  ) {
    redirect(`/api/auth/invalid?next=/`);
  }

  if (!session && route !== "/") {
    redirect("/");
  }
}

export async function removeAuth() {
  await DeleteSession().catch((error: unknown) => {
    throw readError(error);
  });

  redirect("/");
}
