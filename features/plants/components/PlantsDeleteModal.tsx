import { deletePlant, getPlants } from "@/features/plants/actions";
import type { PlantRecord } from "@/features/plants/types/record";
import { ActionFailure, runDeletion } from "@/shared/forms/delete-record";
import { Button, Divider, Modal } from "antd";
import { useState } from "react";

export type PlantsDeleteModalProps = {
  isOpen: boolean;
  onClose?: () => void;
  plant?: PlantRecord;
  setMainData?: (data: PlantRecord[]) => void;
  setMainLoading?: (loading: boolean) => void;
};

export default function PlantsDeleteModal({
  isOpen,
  onClose,
  plant,
  setMainData,
  setMainLoading,
}: PlantsDeleteModalProps) {
  const [loading, setLoading] = useState(false);

  const handleDelete = async () => {
    await runDeletion(
      async () => {
        if (!plant) return;

        setLoading(true);
        const res = await deletePlant(plant.ID);
        if (res.status !== "ok") throw new ActionFailure(res.message);
        {
          setLoading(false);
          onClose?.();
          setMainLoading?.(true);
          const updateData = await getPlants();
          setMainData?.(updateData);
          setMainLoading?.(false);
        }
      },
      () => {
        setLoading(false);
        setMainLoading?.(false);
      },
    );
  };

  return (
    <Modal open={isOpen} onCancel={onClose} title="حذف گیاه" footer={null}>
      <Divider />
      <p>آیا از حذف {plant?.CommonName} اطمینان دارید؟</p>
      <Button type="primary" danger onClick={handleDelete}>
        حذف
      </Button>
      <Button onClick={onClose} className="mr-4">
        انصراف
      </Button>
      {loading && <p className="mt-2 text-sm text-gray-500">در حال حذف...</p>}
    </Modal>
  );
}
