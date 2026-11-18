"use client";

import {
  ConfigProvider,
  Form as AntForm,
  InputNumber as AntInputNumber,
  type FormProps,
  type InputNumberProps,
} from "antd";
import clsx from "clsx";
import { ArrowLeftOutlined, ArrowRightOutlined } from "@ant-design/icons";
import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ComponentProps,
  type ReactNode,
} from "react";
import type { ActionMessage } from "@/shared/contracts/action-result";
import {
  INVALID_FORM_MESSAGE,
  validationMessages,
} from "@/shared/validation/input";
import FormFeedback, { FormValidationFeedback } from "./FormFeedback";
import PersianDatePicker from "./PersianDatePicker";
import GreenhouseButton from "./GreenhouseButton";
import { normalizeNumericInput } from "@/shared/utils/digits";

// Keep Ant Design's value, event, and ref types at the point of use.
export { Checkbox, Input, Radio, Select, Switch } from "antd";
export const FormItem = AntForm.Item;
const FormIsOpen = createContext(true);
export const FormSubmission = createContext<{
  busy: boolean;
  saved: { message: string; status: "refreshing" | "failed" } | null;
  retry: () => void;
} | null>(null);

export function InputNumber<T extends string | number = number>({
  decimalSeparator = "٫",
  parser,
  ...props
}: ComponentProps<typeof AntInputNumber<T>> & InputNumberProps<T>) {
  return (
    <AntInputNumber<T>
      {...props}
      decimalSeparator={decimalSeparator}
      parser={
        parser ??
        ((value) => normalizeNumericInput(value, decimalSeparator) as T)
      }
    />
  );
}

function SharedForm<T>({
  children,
  actions,
  fieldsClassName,
  onFinish,
  onFinishFailed,
  onFieldsChange,
  scrollToFirstError = { block: "center", focus: true },
  ...props
}: Omit<FormProps<T>, "children"> & {
  children?: ReactNode;
  actions?: ReactNode;
  fieldsClassName?: string;
}) {
  const open = useContext(FormIsOpen);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    if (!open) setFailed(false);
  }, [open]);

  return (
    <FormValidationFeedback.Provider
      value={
        failed && open
          ? { status: "error", message: INVALID_FORM_MESSAGE }
          : null
      }
    >
      <AntForm<T>
        {...props}
        scrollToFirstError={scrollToFirstError}
        onFinish={(values) => {
          setFailed(false);
          return onFinish?.(values);
        }}
        onFinishFailed={(result) => {
          if (!result.outOfDate && result.errorFields.length) setFailed(true);
          onFinishFailed?.(result);
        }}
        onFieldsChange={(changed, fields) => {
          if (!fields.some((field) => field.validating || field.errors?.length))
            setFailed(false);
          onFieldsChange?.(changed, fields);
        }}
      >
        {actions ? (
          <>
            <FormFields className={fieldsClassName}>{children}</FormFields>
            {actions}
          </>
        ) : (
          children
        )}
      </AntForm>
    </FormValidationFeedback.Provider>
  );
}

export const Form = Object.assign(SharedForm, {
  List: AntForm.List,
  useForm: AntForm.useForm,
  useWatch: AntForm.useWatch,
});

export function DatePicker(props: ComponentProps<typeof PersianDatePicker>) {
  const submission = useContext(FormSubmission);

  return (
    <PersianDatePicker
      {...props}
      disabled={props.disabled || submission?.busy || !!submission?.saved}
      containerClassName="w-full"
      className="greenhouse-calendar"
      inputClass="record-date-input"
      portal
      zIndex={1100}
    />
  );
}

export function FormAppearance({
  className,
  children,
  open = true,
}: {
  className?: string;
  children: ReactNode;
  open?: boolean;
}) {
  return (
    <ConfigProvider
      componentSize="middle"
      form={{ validateMessages: validationMessages }}
      theme={{ token: { controlHeight: 38, borderRadius: 10 } }}
    >
      <FormIsOpen.Provider value={open}>
        <div className={clsx("record-form", className)}>{children}</div>
      </FormIsOpen.Provider>
    </ConfigProvider>
  );
}

export function FormLabel({ className, ...props }: ComponentProps<"label">) {
  return <label {...props} className={clsx(className, "record-form-label")} />;
}

export function FormFields({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  const submission = useContext(FormSubmission);
  const locked = submission?.busy || !!submission?.saved;

  return (
    <ConfigProvider componentDisabled={locked || undefined}>
      <fieldset
        disabled={locked}
        inert={locked}
        className={clsx("record-form-fields min-w-0", className)}
      >
        {children}
      </fieldset>
    </ConfigProvider>
  );
}

export function FormGrid({
  children,
  className,
  columns = 2,
  title,
}: {
  children: ReactNode;
  className?: string;
  columns?: 2 | 3;
  title?: string;
}) {
  const grid = (
    <div
      className={clsx(
        "record-form-grid",
        columns === 3 && "record-form-grid-three",
        !title && className,
      )}
    >
      {children}
    </div>
  );
  if (!title) return grid;

  return (
    <fieldset className={clsx("record-form-section", className)}>
      <legend className="record-form-section-title">{title}</legend>
      {grid}
    </fieldset>
  );
}

export function FieldFeedback({ message }: { message?: string }) {
  if (!message) return null;
  return (
    <p role="alert" className="mt-1 text-xs text-rose-700 dark:text-rose-300">
      {message}
    </p>
  );
}

export function FormActions({
  message,
  onCancel,
  loading = false,
  editing = false,
  submitDisabled = false,
  nextStep = false,
  onBack,
}: {
  message?: ActionMessage | null;
  onCancel: () => void;
  loading?: boolean;
  editing?: boolean;
  submitDisabled?: boolean;
  nextStep?: boolean;
  onBack?: () => void;
}) {
  const submission = useContext(FormSubmission);
  const saved = submission?.saved;
  const busy = loading || submission?.busy;
  const retryRefresh = saved?.status === "failed";
  const submitLabel = editing ? "ذخیره تغییرات" : "ثبت";
  return (
    <div className="record-form-actions">
      <FormFeedback
        message={saved ? { status: "ok", message: saved.message } : message}
        detail={
          saved &&
          (retryRefresh ? (
            "به‌روزرسانی جدول انجام نشد."
          ) : (
            <span className="inline-flex items-center gap-1.5">
              <span
                aria-hidden="true"
                className="size-3 shrink-0 rounded-full border-2 border-current/30 border-e-current motion-safe:animate-spin"
              />
              در حال به‌روزرسانی جدول…
            </span>
          ))
        }
      />
      <div className="record-form-buttons">
        <GreenhouseButton
          text={retryRefresh ? "بستن" : "انصراف"}
          variant="secondary"
          onClick={onCancel}
          disabled={busy}
        />
        {onBack && (
          <GreenhouseButton
            text="مرحله قبل"
            variant="outline"
            icon={<ArrowRightOutlined />}
            onClick={onBack}
            disabled={busy || !!saved}
          />
        )}
        {retryRefresh ? (
          <GreenhouseButton text="تلاش دوباره" onClick={submission?.retry} />
        ) : (
          <GreenhouseButton
            text={
              saved
                ? "ذخیره شد"
                : nextStep
                  ? "مرحله بعد"
                  : loading
                    ? "در حال ذخیره…"
                    : submitLabel
            }
            type="submit"
            icon={!saved && nextStep ? <ArrowLeftOutlined /> : undefined}
            loading={loading && !saved}
            disabled={busy || submitDisabled || !!saved}
          />
        )}
      </div>
    </div>
  );
}
