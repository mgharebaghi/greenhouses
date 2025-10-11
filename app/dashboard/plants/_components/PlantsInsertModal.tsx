import { Plants } from "@/app/generated/prisma";
import { getPlants } from "@/app/lib/services/plants";
import { createPlant } from "@/app/lib/services/plants/create";
import { Button, Divider, Form, Input, Modal } from "antd";

type PlantsInsrtModalProps = {
  isOpen: boolean;
  setIsOpen?: (open: boolean) => void;
  setMainData?: (data: Plants[]) => void;
  setMainLoading?: (loading: boolean) => void;
};

export default function PlantsInsrtModal({
  isOpen: isOpen,
  setIsOpen,
  setMainData,
  setMainLoading,
}: PlantsInsrtModalProps) {
  const fields = [
    { name: "CommonName", label: "نام رایج", type: "text" },
    { name: "ScientificName", label: "نام علمی", type: "text" },
    { name: "Family", label: "خانواده", type: "text" },
  ];

  const handleSubmit = async (values: Plants) => {
    setIsOpen?.(false);
    setMainLoading?.(true);
    const res = await createPlant(values);
    if (res) {
      const updateData = await getPlants();
      setMainData?.(updateData);
      setMainLoading?.(false);
    }
  };

  return (
    <Modal open={isOpen} onCancel={() => setIsOpen?.(false)} title="افزودن گیاه جدید" footer={null}>
      <Divider />
      <Form layout="vertical" onFinish={handleSubmit}>
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
          <Input.TextArea rows={4}  style={{ resize: "none", minHeight: "150px" }} />
        </Form.Item>
        <Button type="primary" htmlType="submit" className="w-full mt-4">
          ثبت گیاه جدید
        </Button>
      </Form>
    </Modal>
  );
}
