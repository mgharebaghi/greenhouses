"use client";

import { ConfigProvider, Form as AntForm, type FormProps } from "antd";
import clsx from "clsx";
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

// Keep Ant Design's value, event, and ref types at the point of use.
export { Checkbox, Input, InputNumber, Radio, Select, Switch } from "antd";
export const FormItem = AntForm.Item;
const FormIsOpen = createContext(true);

function SharedForm<T>({
  onFinish,
  onFinishFailed,
  onFieldsChange,
  scrollToFirstError = { block: "center", focus: true },
  ...props
}: Omit<FormProps<T>, "children"> & { children?: ReactNode }) {
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
      />
    </FormValidationFeedback.Provider>
  );
}

export const Form = Object.assign(SharedForm, {
  List: AntForm.List,
  useForm: AntForm.useForm,
  useWatch: AntForm.useWatch,
});

export function DatePicker(props: ComponentProps<typeof PersianDatePicker>) {
  return (
    <PersianDatePicker
      {...props}
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
  children,
  message,
}: {
  children: ReactNode;
  message?: ActionMessage | null;
}) {
  return (
    <div className="record-form-actions">
      <FormFeedback message={message} />
      <div className="record-form-buttons">{children}</div>
    </div>
  );
}
