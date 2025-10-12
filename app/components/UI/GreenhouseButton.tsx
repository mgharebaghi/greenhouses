"use client";
import React from "react";
import clsx from "clsx";

type ButtonType = "button" | "submit" | "reset";
type ButtonVariant = "primary" | "secondary" | "outline";

interface GreenhouseButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  text: string;
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
  type = "button",
  ...rest
}: GreenhouseButtonProps) {
  const baseClasses =
    "inline-flex items-center justify-center gap-2 rounded-lg h-10 px-4 font-medium text-sm transition-all duration-200 ease-out focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer";

  const variantClasses = {
    primary:
      "bg-emerald-700 hover:bg-emerald-600 text-white border border-emerald-700 hover:border-emerald-600 shadow-sm focus-visible:ring-emerald-500",
    secondary:
      "bg-emerald-100 hover:bg-emerald-50 text-emerald-800 border border-emerald-300 hover:border-emerald-200 focus-visible:ring-emerald-500",
    outline:
      "bg-transparent hover:bg-emerald-50 text-emerald-700 border border-emerald-400 hover:border-emerald-300 focus-visible:ring-emerald-500",
  };

  const classes = clsx(baseClasses, variantClasses[variant], fullWidth && "w-full", className);

  return (
    <button
      type={type}
      className={classes}
      disabled={disabled || loading}
      aria-busy={loading}
      aria-disabled={disabled || loading}
      {...rest}
    >
      {loading && (
        <span className="inline-block h-4 w-4 border-2 border-current/30 border-r-current rounded-full animate-spin" />
      )}
      {!loading && icon ? <span className="text-current/90">{icon}</span> : null}
      <span>{text}</span>
    </button>
  );
}
