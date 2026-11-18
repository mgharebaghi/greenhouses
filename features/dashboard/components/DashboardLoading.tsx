export default function DashboardLoading() {
  return (
    <div role="status" className="grid gap-4 sm:gap-5">
      <p className="flex min-h-6 items-center gap-2 text-sm font-medium text-(--button-accent)">
        <span
          aria-hidden="true"
          className="size-4 rounded-full border-2 border-current/25 border-e-current motion-safe:animate-spin"
        />
        در حال دریافت آمار داشبورد…
      </p>
      <div
        aria-hidden="true"
        className="grid grid-cols-2 gap-2.5 sm:gap-4 lg:grid-cols-4"
      >
        {[1, 2, 3, 4].map((card) => (
          <div
            key={card}
            className="min-w-0 rounded-2xl border border-(--ui-border) bg-(--ui-panel) p-3 sm:p-4"
          >
            <div className="flex items-start gap-2 motion-safe:animate-pulse sm:gap-3">
              <div className="size-9 shrink-0 rounded-xl bg-(--button-tint)" />
              <div className="min-w-0 flex-1 space-y-2 pt-1">
                <div className="h-3 w-full max-w-24 rounded bg-(--ui-border)" />
                <div className="h-6 w-10 max-w-full rounded bg-(--ui-border)" />
              </div>
            </div>
            <div className="mt-3 h-3 w-3/5 rounded bg-(--ui-border) motion-safe:animate-pulse" />
          </div>
        ))}
      </div>
      <div
        aria-hidden="true"
        className="grid gap-4 lg:grid-cols-[minmax(0,1.73fr)_minmax(0,1fr)]"
      >
        <div className="rounded-2xl border border-(--ui-border) bg-(--ui-panel) p-4 sm:p-5">
          <div className="h-4 w-44 max-w-full rounded bg-(--ui-border) motion-safe:animate-pulse" />
          <div className="mt-5 h-44 rounded-xl bg-(--ui-muted-panel) motion-safe:animate-pulse" />
        </div>
        <div className="space-y-2 rounded-2xl border border-(--ui-border) bg-(--ui-panel) p-4 sm:p-5">
          {[1, 2, 3, 4].map((row) => (
            <div
              key={row}
              className="h-10 rounded-xl bg-(--ui-muted-panel) motion-safe:animate-pulse"
            />
          ))}
        </div>
      </div>
    </div>
  );
}
