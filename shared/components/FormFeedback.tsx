"use client";

import type { ActionMessage } from "@/shared/contracts/action-result";
import {
  CheckCircleOutlined,
  ExclamationCircleOutlined,
} from "@ant-design/icons";
import clsx from "clsx";
import { createContext, useContext, type ReactNode } from "react";

export const FormValidationFeedback = createContext<ActionMessage | null>(null);

export default function FormFeedback({
  message,
  className,
  detail,
}: {
  message?: ActionMessage | null;
  className?: string;
  detail?: ReactNode;
}) {
  const validation = useContext(FormValidationFeedback);
  const feedback = message?.status === "ok" ? message : (validation ?? message);
  if (!feedback?.message.trim()) return null;
  const success = feedback.status === "ok";
  return (
    <div
      role={success ? "status" : "alert"}
      className={clsx(
        "record-form-feedback",
        success ? "is-success" : "is-error",
        className,
      )}
    >
      <span className="record-form-feedback-icon" aria-hidden="true">
        {success ? <CheckCircleOutlined /> : <ExclamationCircleOutlined />}
      </span>
      <span className="min-w-0">
        <span>{feedback.message}</span>
        {detail && <span className="block text-xs">{detail}</span>}
      </span>
    </div>
  );
}
