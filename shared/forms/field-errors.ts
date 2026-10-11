import type { FieldErrors } from "@/shared/contracts/action-result";
import type { FormInstance } from "antd";

export function applyFieldErrors<T>(
  form: Pick<FormInstance<T>, "setFields">,
  result: { status: string; fieldErrors?: FieldErrors },
) {
  if (result.status !== "error" || !result.fieldErrors) return;
  const fields = Object.entries(result.fieldErrors)
    .filter(([key]) => key.length > 0)
    .map(([key, errors]) => ({
      name: key
        .split(".")
        .map((part) => (/^\d+$/.test(part) ? Number(part) : part)),
      errors,
    }));
  form.setFields(fields as Parameters<FormInstance<T>["setFields"]>[0]);
}
