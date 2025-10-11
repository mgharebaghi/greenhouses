import { Greenhouses } from "@/app/generated/prisma";
import { allGreenHouses, deleteGreenHouse } from "@/app/lib/services/greenhouse";
import { Button, Divider, Modal } from "antd";
import { useState } from "react";

export type deleteModalType = {
  isOpen: boolean;
  onClose?: () => void;
  data?: Greenhouses;
  setMainLoading?: (loading: boolean) => void;
  setMainData?: (data: Greenhouses[]) => void;
};

export default function GreenHouseDeleteModal(props: deleteModalType) {
  const [loading, setLoading] = useState(false);

  const onDelete = async () => {
    setLoading(true);
    await deleteGreenHouse(props.data?.GreenhouseID!);
    setLoading(false);
    props.onClose && props.onClose();
    props.setMainLoading && props.setMainLoading(true);
    const newData = await allGreenHouses();
    props.setMainData && props.setMainData(newData);
    props.setMainLoading && props.setMainLoading(false);
  };

  return (
    <Modal open={props.isOpen} onCancel={props.onClose} footer={null} className="min-w-[30%]">
      {props.data !== undefined ? (
        <>
          <div className="text-lg font-semibold">حذف گلخانه {props.data.GreenhouseName}</div>
          <Divider />
          <div className="flex justify-end">
            <Button type="primary" danger onClick={onDelete} className="ml-4">
              حذف
            </Button>
            <Button type="default" onClick={props.onClose}>
              انصراف
            </Button>
            {loading && <span className="ml-4">در حال حذف...</span>}
          </div>
        </>
      ) : (
        <div>در حال بارگذاری...</div>
      )}
    </Modal>
  );
}
