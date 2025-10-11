import { Owner_Observer } from "@/app/generated/prisma";
import { getAllOwners, deleteOwner } from "@/app/lib/services/owners";
import { Button, Divider, Modal } from "antd";
import { useState } from "react";

export type OwnerDeleteModalProps = {
  isOpen: boolean;
  setIsOpen?: () => void;
  record?: Owner_Observer;
  setMainData?: (data: Owner_Observer[]) => void;
  setMainLoading?: (loading: boolean) => void;
};

export default function OwnerDeleteModal(props: OwnerDeleteModalProps) {
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleDelete = async () => {
    setMessage("");
    setLoading(true);
    if (props.record?.ID) {
      const response = await deleteOwner(props.record.ID);
      if (response) {
        setLoading(false);
        props.setIsOpen && props.setIsOpen();
      } else {
        setLoading(false);
        setMessage("خطایی پیش آمد، دوباره تلاش کنید!");
        props.setIsOpen && props.setIsOpen();
        return;
      }
    }

    props.setMainLoading && props?.setMainLoading(true);
    const newData: Owner_Observer[] = await getAllOwners();
    props.setMainData && props.setMainData(newData);
    props.setMainLoading && props.setMainLoading(false);
  };

  return (
    <Modal
      open={props.isOpen}
      onCancel={props.setIsOpen}
      title={
        <span>
          حذف {props.record?.FirstName} {props.record?.LastName}
        </span>
      }
      footer={null}
    >
      <div className="text-sm">آیا از حذف این شخص اطمینان دارید؟</div>
      <Divider />
      <div className="flex gap-2">
        <Button onClick={props.setIsOpen}>انصراف</Button>
        <Button type="primary" danger onClick={handleDelete}>
          حذف
        </Button>
        {loading && <div className="text-sm text-gray-500">در حال حذف...</div>}
        {message && <div className="text-sm text-red-500">{message}</div>}
      </div>
    </Modal>
  );
}
