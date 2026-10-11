"use client";

import GreenhouseButton from "./GreenhouseButton";

export default function DataLoadError({ onRetry }: { onRetry: () => void }) {
  return (
    <div role="alert" className="p-6 space-y-4 text-center">
      <p>دریافت اطلاعات انجام نشد. لطفاً دوباره تلاش کنید.</p>
      <GreenhouseButton
        text="تلاش دوباره"
        variant="primary"
        onClick={onRetry}
      />
    </div>
  );
}
