"use client";

import { Modal, type ModalProps } from "antd";

/** Shared modal defaults; feature-specific headers and fields stay in the feature. */
export default function FormModal(props: ModalProps) {
  return <Modal footer={null} closeIcon={null} centered {...props} />;
}
