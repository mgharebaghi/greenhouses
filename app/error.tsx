"use client";

import DataLoadError from "@/shared/components/DataLoadError";

export default function AppError({ reset }: { reset: () => void }) {
  return <DataLoadError onRetry={reset} />;
}
