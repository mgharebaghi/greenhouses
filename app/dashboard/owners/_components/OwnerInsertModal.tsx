import { Owner_Observer } from "@/app/generated/prisma";
import { createOwner, OwnerResponse } from "@/app/lib/services/owners";
import { getAllOwners } from "@/app/lib/services/owners/read";
import { Button, Divider, Form, Input, Modal, Typography } from "antd";
import { useState } from "react";

type OwnerInsertModalProps = {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  setMainData: (data: Owner_Observer[]) => void;
  setMainLoading: (loading: boolean) => void;
};

export default function OwnersInsertModal({ isOpen, setIsOpen, setMainData, setMainLoading }: OwnerInsertModalProps) {
  const [message, setMessage] = useState<OwnerResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const fields = [
    { name: "FirstName", label: "نام", required: true, placeholder: "نام" },
    { name: "LastName", label: "نام خانوادگی", required: true, placeholder: "نام خانوادگی" },
    { name: "PhoneNumber", label: "شماره تماس", required: true, placeholder: "شماره تماس" },
    { name: "Profesion", label: "تخصص", required: true, placeholder: "تخصص" },
  ];

  const handleSubmit = async (values: Owner_Observer) => {
    setMessage(null);
    setLoading(true);
    const res: OwnerResponse = await createOwner(values);
    if (res.status === "ok") {
      setLoading(false);
      setMessage(res);
      setIsOpen(false);
    } else {
      setLoading(false);
      setMessage(res);
      return;
    }

    setMainLoading(true);
    const mainData = await getAllOwners();
    setMainData(mainData);
    setMainLoading(false);
    setIsOpen(false);
  };

  return (
    <Modal title="افزودن مالک جدید" open={isOpen} onCancel={() => setIsOpen(false)} footer={null}>
      <Form className="w-full max-w-md bg-white" style={{ padding: 24 }} onFinish={handleSubmit}>
        <Typography.Title className="text-2xl font-bold text-center">ثبت اطلاعات اشخاص</Typography.Title>
        <Divider />
        {fields.map((field) => (
          <Form.Item
            key={field.name}
            label={field.label}
            name={field.name}
            rules={[{ required: field.required, message: `لطفاً ${field.placeholder} را وارد کنید` }]}
          >
            <Input onChange={() => setMessage(null)} type="text" placeholder={field.placeholder} />
          </Form.Item>
        ))}
        <Divider />
        <Form.Item className="w-full flex justify-center">
          <Button type="primary" htmlType="submit">
            ثبت اطلاعات
          </Button>
        </Form.Item>
        <div className="w-full text-center">
          {loading && "در حال ثبت اطلاعات..."}
          {message && message.status === "ok"
            ? message.message
            : message && message.status === "error"
            ? message.message
            : null}
        </div>
      </Form>
    </Modal>
  );
}
