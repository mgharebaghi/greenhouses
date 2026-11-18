"use client";

import type { ModalProps } from "antd";
import type { ReactNode } from "react";
import type useSavedForm from "@/shared/forms/useSavedForm";
import FormModalHeader from "./FormModalHeader";
import { FormAppearance, FormSubmission } from "./FormControls";
import ResponsiveModal from "./ResponsiveModal";

type Props = Omit<ModalProps, "title" | "onCancel"> & {
  heading: ReactNode;
  description?: ReactNode;
  editing?: boolean;
  busy?: boolean;
  savedForm: ReturnType<typeof useSavedForm>;
  onClose: () => void;
};

export default function FormModal({
  heading,
  description,
  editing,
  busy,
  savedForm,
  onClose,
  children,
  className,
  afterOpenChange,
  ...props
}: Props) {
  const { saved, retry, reset } = savedForm;
  const locked = !!busy || saved?.status === "refreshing";
  const handleClose = () => {
    if (!locked) onClose();
  };

  return (
    <ResponsiveModal
      footer={null}
      closable={false}
      centered
      width={800}
      className={
        className
          ? `greenhouse-form-dialog ${className}`
          : "greenhouse-form-dialog"
      }
      styles={{ content: { padding: 0, borderRadius: 16, overflow: "hidden" } }}
      {...props}
      onCancel={handleClose}
      afterOpenChange={(open) => {
        if (!open) reset();
        afterOpenChange?.(open);
      }}
    >
      <FormModalHeader
        heading={heading}
        description={description}
        editing={editing}
        onClose={handleClose}
        busy={locked}
      />
      <FormSubmission.Provider value={{ busy: locked, saved, retry }}>
        <FormAppearance className="greenhouse-form-scroll" open={props.open}>
          {children}
        </FormAppearance>
      </FormSubmission.Provider>
    </ResponsiveModal>
  );
}
