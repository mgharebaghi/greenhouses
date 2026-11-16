import { deletePlant, getPlants } from "@/features/plants/actions";
import type { PlantRecord } from "@/features/plants/types/record";
import { ActionFailure, runDeletion } from "@/shared/forms/delete-record";
import Modal from "@/shared/components/ResponsiveModal";
import { Divider } from "antd";
import GreenhouseButton from "@/shared/components/GreenhouseButton";
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
      <div className="mt-4 flex flex-wrap justify-end gap-2">
        <GreenhouseButton
          text="انصراف"
          variant="secondary"
          onClick={onClose}
          disabled={loading}
        />
        <GreenhouseButton
          text={loading ? "در حال حذف…" : "حذف"}
          variant="danger"
          onClick={handleDelete}
          loading={loading}
        />
      </div>
    </Modal>
  );
}
