import { ButtonHTMLAttributes, ReactNode, useState } from "react";

interface GreenhouseButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "emerald" | "forest" | "mint" | "sage" | "lime" | "olive";
  size?: "sm" | "md" | "lg";
  icon?: ReactNode;
  loading?: boolean;
  fullWidth?: boolean;
  htmlType?: "button" | "submit" | "reset";
}

export default function GreenhouseButton({
  children = "Button",
  variant = "emerald",
  size = "md",
  icon,
  loading = false,
  fullWidth = false,
  className = "",
  disabled,
  onClick,
  htmlType = "button",
  ...props
}: GreenhouseButtonProps) {
  const [isPressed, setIsPressed] = useState(false);

  const baseStyles = [
    "relative",
    "inline-flex",
    "items-center",
    "justify-center",
    "gap-2",
    "font-medium",
    "rounded-lg",
    "transition-all",
    "duration-200",
    "ease-out",
    "focus:outline-none",
    "focus-visible:outline-none",
    "focus:ring-0",
    "focus-visible:ring-0",
    "disabled:opacity-50",
    "disabled:cursor-not-allowed",
    "cursor-pointer",
    "select-none",
    "overflow-hidden",
    "group",
    "border",
    "backdrop-blur-sm",
  ].join(" ");

  const variants = {
    emerald: [
      "bg-emerald-500/80",
      "text-white",
      "border-emerald-400/20",
      "shadow-md shadow-emerald-500/15",
      "hover:bg-emerald-600/85",
      "hover:shadow-lg shadow-emerald-500/20",
      "hover:border-emerald-300/25",
      "active:bg-emerald-700/90",
    ].join(" "),

    forest: [
      "bg-green-600/80",
      "text-white",
      "border-green-500/20",
      "shadow-md shadow-green-600/15",
      "hover:bg-green-700/85",
      "hover:shadow-lg shadow-green-600/20",
      "hover:border-green-400/25",
      "active:bg-green-800/90",
    ].join(" "),

    mint: [
      "bg-green-400/70",
      "text-green-900",
      "border-green-300/20",
      "shadow-md shadow-green-400/10",
      "hover:bg-green-500/75",
      "hover:shadow-lg shadow-green-400/15",
      "hover:border-green-200/25",
      "active:bg-green-600/80",
    ].join(" "),

    sage: [
      "bg-slate-500/70",
      "text-white",
      "border-slate-400/20",
      "shadow-md shadow-slate-500/10",
      "hover:bg-slate-600/75",
      "hover:shadow-lg shadow-slate-500/15",
      "hover:border-slate-300/25",
      "active:bg-slate-700/80",
    ].join(" "),

    lime: [
      "bg-lime-500/80",
      "text-lime-900",
      "border-lime-400/20",
      "shadow-md shadow-lime-500/15",
      "hover:bg-lime-600/85",
      "hover:shadow-lg shadow-lime-500/20",
      "hover:border-lime-300/25",
      "active:bg-lime-700/90",
    ].join(" "),

    olive: [
      "bg-yellow-600/75",
      "text-yellow-50",
      "border-yellow-500/20",
      "shadow-md shadow-yellow-600/10",
      "hover:bg-yellow-700/80",
      "hover:shadow-lg shadow-yellow-600/15",
      "hover:border-yellow-400/25",
      "active:bg-yellow-800/85",
    ].join(" "),
  };

  const sizes = {
    sm: "px-3 py-1.5 text-sm min-h-[2rem]",
    md: "px-4 py-2 text-base min-h-[2.5rem]",
    lg: "px-6 py-3 text-lg min-h-[3rem]",
  };

  const handleMouseDown = () => setIsPressed(true);
  const handleMouseUp = () => setIsPressed(false);
  const handleMouseLeave = () => setIsPressed(false);

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (disabled || loading) return;
    onClick?.(e);
  };

  return (
    <button
      type={htmlType}
      className={`
        ${baseStyles}
        ${variants[variant]}
        ${sizes[size]}
        ${fullWidth ? "w-full" : ""}
        ${isPressed ? "scale-95" : ""}
        ${className}
      `}
      disabled={disabled || loading}
      onClick={handleClick}
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseLeave}
      onBlur={() => setIsPressed(false)}
      {...props}
    >
      {/* Subtle glass overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-white/20 via-transparent to-transparent rounded-lg" />

      {/* Shimmer effect on hover */}
      <div className="absolute inset-0 -top-2 bg-gradient-to-r from-transparent via-white/20 to-transparent skew-y-2 opacity-0 group-hover:opacity-100 group-hover:animate-pulse transition-opacity duration-300" />

      {/* Content */}
      <div className="relative z-10 flex items-center gap-2">
        {loading ? (
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 bg-current rounded-full animate-bounce [animation-delay:-0.3s]" />
            <div className="w-3 h-3 bg-current rounded-full animate-bounce [animation-delay:-0.15s]" />
            <div className="w-3 h-3 bg-current rounded-full animate-bounce" />
          </div>
        ) : (
          icon && <span className="transition-transform duration-150 group-hover:scale-110 flex-shrink-0">{icon}</span>
        )}
        <span className="font-medium whitespace-nowrap">{children}</span>
      </div>
    </button>
  );
}
