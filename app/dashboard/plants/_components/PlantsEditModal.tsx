import { Plants } from "@/app/generated/prisma";
import { getPlants } from "@/app/lib/services/plants";
import { updatePlant } from "@/app/lib/services/plants/update";
import { Button, Divider, Form, Input, Modal } from "antd";
import { useEffect } from "react";

export type PlantsEditModalProps = {
  isOpen: boolean;
  onClose?: () => void;
  plant?: Plants;
  setMainData?: (data: Plants[]) => void;
  setMainLoading?: (loading: boolean) => void;
};

export default function PlantsEditModal({ isOpen, plant, setMainData, setMainLoading, onClose }: PlantsEditModalProps) {
  const fields = [
    { name: "CommonName", label: "نام رایج", type: "text" },
    { name: "ScientificName", label: "نام علمی", type: "text" },
    { name: "Family", label: "خانواده", type: "text" },
  ];

  const [form] = Form.useForm();

  useEffect(() => {
    if (isOpen) {
      form.setFieldsValue(plant);
    }
  }, [isOpen, plant]);

  const handleSubmit = async (values: Plants) => {
    onClose?.();
    setMainLoading?.(true);
    const res = await updatePlant({ id: plant?.PlantID || 0, data: values });
    if (res) {
      const updateData = await getPlants();
      setMainData?.(updateData);
      setMainLoading?.(false);
    }
  };

  return (
    <Modal open={isOpen} onCancel={() => onClose?.()} title="تغییر گیاه" footer={null}>
      <Divider />
      <Form form={form} layout="vertical" onFinish={handleSubmit}>
        {fields.map((field) => (
          <Form.Item
            key={field.name}
            name={field.name}
            label={field.label}
            rules={[{ required: true, message: `لطفا ${field.label} را وارد کنید` }]}
          >
            <Input type={field.type} />
          </Form.Item>
        ))}
        <Form.Item name="Notes" label="توضیحات">
          <Input.TextArea rows={4} style={{ resize: "none", minHeight: "150px" }} />
        </Form.Item>
        <Button type="primary" htmlType="submit" className="w-full mt-4">
          ثبت تغییرات
        </Button>
      </Form>
    </Modal>
  );
}
