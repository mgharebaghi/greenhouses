import type { FieldErrors } from "@/shared/contracts/action-result";
import type { FormInstance } from "antd";
import type {
  FieldPath,
  FieldValues,
  Resolver,
  UseFormSetError,
} from "react-hook-form";

export function withoutBlankPathErrors<T extends FieldValues>(
  resolver: Resolver<T>,
): Resolver<T> {
  return async (...args) => {
    const result = await resolver(...args);
    // Zod's resolver can emit a blank-path error for a nested date union
    // alongside the field error. The extra error cannot be cleared by editing.
    Reflect.deleteProperty(result.errors, "");
    return result;
  };
}

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

export function applyHookFormErrors<T extends FieldValues>(
  setError: UseFormSetError<T>,
  result: { status: string; fieldErrors?: FieldErrors },
) {
  if (result.status !== "error" || !result.fieldErrors) return;
  for (const [path, errors] of Object.entries(result.fieldErrors)) {
    if (path && errors[0]) {
      setError(path as FieldPath<T>, { type: "server", message: errors[0] });
    }
  }
}
