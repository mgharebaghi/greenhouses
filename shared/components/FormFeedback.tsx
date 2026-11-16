"use client";

import type { ActionMessage } from "@/shared/contracts/action-result";
import {
  CheckCircleOutlined,
  ExclamationCircleOutlined,
} from "@ant-design/icons";
import clsx from "clsx";
import { createContext, useContext } from "react";

export const FormValidationFeedback = createContext<ActionMessage | null>(null);

export default function FormFeedback({
  message,
  className,
}: {
  message?: ActionMessage | null;
  className?: string;
}) {
  const feedback = useContext(FormValidationFeedback) ?? message;
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
      <span>{feedback.message}</span>
    </div>
  );
}
