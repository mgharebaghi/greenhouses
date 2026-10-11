import { message } from "antd";
export class ActionFailure extends Error {}

/** Keep delete failures visible and release every loading flag after network errors. */
export async function runDeletion(
  operation: () => Promise<void>,
  onSettled: () => void,
) {
  try {
    await operation();
  } catch (error) {
    void message.error(
      error instanceof ActionFailure
        ? error.message
        : "عملیات انجام نشد. لطفاً دوباره تلاش کنید.",
    );
  } finally {
    onSettled();
  }
}
