"use client";

import DataLoadError from "@/shared/components/DataLoadError";

export default function DashboardError({ reset }: { reset: () => void }) {
  return <DataLoadError onRetry={reset} />;
}
