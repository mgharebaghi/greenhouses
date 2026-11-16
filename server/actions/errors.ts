import { AuthenticationError } from "@/server/auth/require-session";
import type { ActionResult } from "@/shared/contracts/action-result";
import { InputValidationError } from "@/shared/validation/input";
import { unstable_rethrow } from "next/navigation";
import "server-only";
import { FeatureUnavailableError } from "./feature-unavailable";

class DataReadError extends Error {
  constructor() {
    super("دریافت اطلاعات انجام نشد. لطفاً دوباره تلاش کنید.");
  }
}

export function readError(error: unknown) {
  unstable_rethrow(error);
  if (
    error instanceof AuthenticationError ||
    error instanceof FeatureUnavailableError ||
    error instanceof DataReadError
  )
    return error;
  console.error("Data query failed", error);
  return new DataReadError();
}

export function actionError(
  error: unknown,
  fallback = "عملیات انجام نشد. لطفاً دوباره تلاش کنید.",
): Extract<ActionResult, { status: "error" }> {
  if (error instanceof InputValidationError)
    return {
      status: "error",
      message: error.message,
      fieldErrors: error.fieldErrors,
    };
  if (
    error instanceof AuthenticationError ||
    error instanceof FeatureUnavailableError
  )
    return { status: "error", message: error.message };
  if (error && typeof error === "object" && "code" in error) {
    if (error.code === "P2003")
      return {
        status: "error",
        message:
          "اطلاعات انتخاب‌شده معتبر نیست یا این رکورد در بخش دیگری استفاده شده است.",
      };
    if (error.code === "P2025")
      return {
        status: "error",
        message: "این رکورد دیگر موجود نیست. فهرست را تازه کنید.",
      };
    if (error.code === "P2002")
      return {
        status: "error",
        message: "اطلاعات تکراری است؛ مقدار دیگری وارد کنید.",
      };
    if (error.code === "P2000" || error.code === "P2020")
      return {
        status: "error",
        message: "اندازه یا مقدار یکی از فیلدها خارج از محدودهٔ مجاز است.",
      };
  }
  console.error(fallback, error);
  return { status: "error", message: fallback };
}
