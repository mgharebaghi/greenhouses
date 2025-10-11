import { PlantVarities } from "@/app/generated/prisma";
import { deletePlantVariety, getPlantVarieties } from "@/app/lib/services/varities";
import { Button, Modal } from "antd";
import { useState } from "react";
import { PlantVarietyDTO } from "../page";

type PlantVarietiesDeleteProps = {
  isOpen: boolean;
  onClose?: () => void;
  record?: PlantVarietyDTO;
  setMainLoading?: (loading: boolean) => void;
  setMainData?: (data: PlantVarietyDTO[]) => void;
};

export default function PlantVaritiesDeleteModal(props: PlantVarietiesDeleteProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const handleDelete = async () => {
    setLoading(true);
    setError(null);
    const res = await deletePlantVariety(props.record?.VarietyID!);
    if (res) {
      setLoading(false);
      props.setMainLoading?.(true);
      props.onClose?.();
      const newData: any = await getPlantVarieties();
      props.setMainData?.(newData);
      props.setMainLoading?.(false);
    } else {
      setLoading(false);
      setError("خطایی رخ داده است. لطفا دوباره تلاش کنید.");
    }
  };

  return (
    <Modal title="حذف گونه گیاهی" open={props.isOpen} onCancel={props.onClose} footer={null}>
      <div className="py-4">آیا از حذف گونه گیاهی {props.record?.VarietyName} مطمئن هستید؟</div>
      <div className="flex justify-end gap-2">
        <Button type="default" onClick={props.onClose}>
          انصراف
        </Button>
        <Button type="primary" danger onClick={handleDelete} disabled={loading}>
          {loading ? "در حال حذف..." : "حذف"}
        </Button>
      </div>
    </Modal>
  );
}
