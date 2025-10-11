import { Button, Divider, Modal } from "antd";
import { useState } from "react";

export type DeleteModalProps = {
  open: boolean;
  onClose: () => void;
  id?: number;
  name?: string;
  onDelete?: (id: number) => void;
  deleteLoading?: boolean;
};

export default function DeleteModal({ open, onClose, id, name, onDelete, deleteLoading }: DeleteModalProps) {
  return (
    <Modal open={open} onCancel={onClose} title={`حذف ${name}`} footer={null} centered>
      <Divider />
      <p>آیا از حذف {name} اطمینان دارید؟</p>
      <Divider />
      <div className="flex justify-end gap-2">
        <Button onClick={onClose}>انصراف</Button>
        <Button
          danger
          onClick={() => {
            onDelete?.(id!);
          }}
        >
          {deleteLoading ? "در حال حذف..." : "حذف"}
        </Button>
      </div>
    </Modal>
  );
}
