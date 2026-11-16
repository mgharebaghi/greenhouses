"use client";

import { Modal, type ModalProps } from "antd";
import clsx from "clsx";

export default function ResponsiveModal({
  className,
  wrapClassName,
  ...props
}: ModalProps) {
  return (
    <Modal
      {...props}
      className={clsx("greenhouse-dialog", className)}
      wrapClassName={clsx("greenhouse-dialog-wrap", wrapClassName)}
    />
  );
}
