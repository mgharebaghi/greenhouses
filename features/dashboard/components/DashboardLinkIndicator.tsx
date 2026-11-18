"use client";

import { useLinkStatus } from "next/link";
import type { ReactNode } from "react";

export default function DashboardLinkIndicator({
  children,
}: {
  children?: ReactNode;
}) {
  const { pending } = useLinkStatus();
  return (
    <span className="grid size-4 shrink-0 place-items-center">
      {pending ? (
        <span role="status" className="grid place-items-center">
          <span
            aria-hidden="true"
            className="size-3.5 rounded-full border-2 border-current/25 border-e-current motion-safe:animate-spin"
          />
          <span className="sr-only">در حال بارگذاری…</span>
        </span>
      ) : (
        <span aria-hidden="true" className="inline-flex">
          {children}
        </span>
      )}
    </span>
  );
}
