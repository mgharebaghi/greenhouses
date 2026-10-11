"use client";

import DataLoadError from "@/shared/components/DataLoadError";

export default function PublicScanError({ reset }: { reset: () => void }) {
  return <DataLoadError onRetry={reset} />;
}
