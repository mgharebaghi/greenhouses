"use client";

import clsx from "clsx";
import React from "react";

type ButtonType = "button" | "submit" | "reset";
type ButtonVariant =
  | "primary"
  | "secondary"
  | "outline"
  | "soft"
  | "ghost"
  | "danger"
  | "danger-soft";

interface GreenhouseButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  text?: string;
  loading?: boolean;
  icon?: React.ReactNode;
  fullWidth?: boolean;
  type?: ButtonType;
  variant?: ButtonVariant;
}

export default function GreenhouseButton({
  text,
  loading = false,
  disabled,
  icon,
  fullWidth = false,
  variant = "primary",
  className,
  children,
  type = "button",
  ...rest
}: GreenhouseButtonProps) {
  return (
    <button
      type={type}
      className={clsx(
        "greenhouse-button",
        !text && !children && "greenhouse-icon-button",
        fullWidth && "w-full",
        className,
      )}
      data-variant={variant}
      disabled={disabled || loading}
      aria-busy={loading || undefined}
      {...rest}
    >
      {loading ? (
        <span
          aria-hidden
          className="size-4 shrink-0 rounded-full border-2 border-current/30 border-e-current motion-safe:animate-spin"
        />
      ) : (
        icon && (
          <span aria-hidden className="inline-flex shrink-0 text-[15px]">
            {icon}
          </span>
        )
      )}
      {text ? <span>{text}</span> : children}
    </button>
  );
}
