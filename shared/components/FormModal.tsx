"use client";

import type { ModalProps } from "antd";
import type { ReactNode } from "react";
import FormModalHeader from "./FormModalHeader";
import { FormAppearance } from "./FormControls";
import ResponsiveModal from "./ResponsiveModal";

type Props = Omit<ModalProps, "title" | "onCancel"> & {
  heading: ReactNode;
  description?: ReactNode;
  icon: ReactNode;
  editing?: boolean;
  onClose: () => void;
};

export default function FormModal({
  heading,
  description,
  icon,
  editing,
  onClose,
  children,
  className,
  ...props
}: Props) {
  return (
    <ResponsiveModal
      footer={null}
      closable={false}
      centered
      width={800}
      onCancel={onClose}
      className={
        className
          ? `greenhouse-form-dialog ${className}`
          : "greenhouse-form-dialog"
      }
      styles={{ content: { padding: 0, borderRadius: 16, overflow: "hidden" } }}
      {...props}
    >
      <FormModalHeader
        heading={heading}
        description={description}
        editing={editing}
        icon={icon}
        onClose={onClose}
      />
      <FormAppearance className="greenhouse-form-scroll" open={props.open}>
        {children}
      </FormAppearance>
    </ResponsiveModal>
  );
}
