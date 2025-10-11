import { Plants } from "@/app/generated/prisma";
import { getPlants } from "@/app/lib/services/plants";
import { deletePlant } from "@/app/lib/services/plants/delete";
import { Button, Divider, Modal } from "antd";
import { useState } from "react";

export type PlantsDeleteModalProps = {
  isOpen: boolean;
  onClose?: () => void;
  plant?: Plants;
  setMainData?: (data: Plants[]) => void;
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
    setLoading(true);
    const res = await deletePlant(plant?.PlantID!);
    if (res) {
      setLoading(false);
      onClose?.();
      setMainLoading?.(true);
      const updateData = await getPlants();
      setMainData?.(updateData);
      setMainLoading?.(false);
    }
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
