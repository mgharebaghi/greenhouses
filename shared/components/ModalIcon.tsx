import type { ReactNode } from "react";

export default function ModalIcon({ children }: { children: ReactNode }) {
  return (
    <span
      aria-hidden="true"
      className="grid size-9 shrink-0 place-items-center rounded-lg bg-(--button-tint) text-lg text-(--button-accent) sm:size-10"
    >
      {children}
    </span>
  );
}
