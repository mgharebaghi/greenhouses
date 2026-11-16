"use client";

import GreenhouseButton from "./GreenhouseButton";
interface ButtonProps {
  onclick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
  text: string;
  className?: string;
  type?: "button" | "submit" | "reset";
}

export default function PrimaryButton({
  onclick,
  text,
  className,
  type,
}: ButtonProps) {
  return (
    <GreenhouseButton
      onClick={onclick}
      className={className}
      type={type}
      text={text}
    />
  );
}
