import type { ActionMessage } from "@/shared/contracts/action-result";

export function loadFormOptions(
  load: (isCurrent: () => boolean) => Promise<void>,
  onError: (message: ActionMessage) => void,
  onSettled?: () => void,
) {
  let current = true;
  void load(() => current)
    .catch(() => {
      if (current) {
        onError({
          status: "error",
          message:
            "دریافت گزینه‌های فرم انجام نشد. فرم را ببندید و دوباره باز کنید.",
        });
      }
    })
    .finally(() => {
      if (current) onSettled?.();
    });
  return () => {
    current = false;
  };
}
