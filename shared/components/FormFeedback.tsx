"use client";

import type { ActionMessage } from "@/shared/contracts/action-result";
import {
  CheckCircleOutlined,
  ExclamationCircleOutlined,
} from "@ant-design/icons";

export default function FormFeedback({
  message,
  className,
}: {
  message: ActionMessage | null;
  className?: string;
}) {
  if (!message) return null;
  const success = message.status === "ok";
  return (
    <div
      role={success ? "status" : "alert"}
      className={`mt-5 p-4 rounded-xl border-2 flex items-start gap-3 animate-in fade-in slide-in-from-top-3 duration-300 shadow-sm ${
        success
          ? "bg-gradient-to-br from-emerald-50 to-emerald-100/50 dark:from-emerald-900/30 dark:to-emerald-900/10 border-emerald-300 dark:border-emerald-800 text-emerald-900 dark:text-emerald-300"
          : "bg-gradient-to-br from-rose-50 to-rose-100/50 dark:from-rose-900/30 dark:to-rose-900/10 border-rose-300 dark:border-rose-800 text-rose-900 dark:text-rose-300"
      } ${className ?? ""}`}
    >
      <div
        className={`mt-0.5 p-1.5 rounded-lg ${success ? "bg-emerald-200/50 dark:bg-emerald-800/50" : "bg-rose-200/50 dark:bg-rose-800/50"}`}
      >
        {success ? (
          <CheckCircleOutlined className="text-lg text-emerald-700 dark:text-emerald-400" />
        ) : (
          <ExclamationCircleOutlined className="text-lg text-rose-700 dark:text-rose-400" />
        )}
      </div>
      <div className="flex-1">
        <p className="text-sm font-semibold mb-0.5">
          {success ? "موفقیت‌آمیز" : "خطا"}
        </p>
        <p className="text-sm leading-relaxed opacity-90">{message.message}</p>
      </div>
    </div>
  );
}
