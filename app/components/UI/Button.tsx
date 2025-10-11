"use client";

interface ButtonProps {
  onclick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
  text: string;
  className?: string;
  type?: "button" | "submit" | "reset";
}

export default function PrimaryButton({ onclick, text, className, type }: ButtonProps) {
  return (
    <button
      onClick={onclick}
      className={`min-w-[150px] px-4 py-2 bg-slate-800 text-white rounded hover:bg-slate-500
        transition-all duration-300 cursor-pointer
        active:bg-slate-800 ${className}`}
      type={type || "button"}
    >
      {text}
    </button>
  );
}
