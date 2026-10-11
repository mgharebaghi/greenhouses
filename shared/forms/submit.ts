import type { ActionMessage } from "@/shared/contracts/action-result";

/** Keep forms usable after transport failures and always release their loading state. */
export async function submitForm(
  operation: () => Promise<void>,
  onError: (message: ActionMessage) => void,
  onSettled: () => void,
) {
  try {
    await operation();
  } catch {
    onError({
      status: "error",
      message: "عملیات انجام نشد. لطفاً دوباره تلاش کنید.",
    });
  } finally {
    onSettled();
  }
}
