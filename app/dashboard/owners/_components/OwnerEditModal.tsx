import { Owner_Observer } from "@/app/generated/prisma";
import { getAllOwners, updateOwner } from "@/app/lib/services/owners";
import { Button, Divider, Form, Input, Modal, Typography } from "antd";
import { useEffect, useState } from "react";

export type OwnerEditModalProps = {
  isOpen: boolean;
  setIsOpen?: (open: boolean) => void;
  record?: Owner_Observer;
  setMainData?: (data: Owner_Observer[]) => void;
  setMainLoading?: (loading: boolean) => void;
};

export default function OwnersEditModal({
  isOpen,
  setIsOpen,
  record,
  setMainData,
  setMainLoading,
}: OwnerEditModalProps) {
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const fields = [
    { name: "FirstName", label: "نام", required: true, placeholder: "نام" },
    { name: "LastName", label: "نام خانوادگی", required: true, placeholder: "نام خانوادگی" },
    { name: "PhoneNumber", label: "شماره تماس", required: true, placeholder: "شماره تماس" },
    { name: "Profesion", label: "تخصص", required: true, placeholder: "تخصص" },
  ];

  const [form] = Form.useForm();

  useEffect(() => {
    setLoading(false);
    if (isOpen && record) {
      form.setFieldsValue(record);
    }
  }, [isOpen, record, form]);

  const handleSubmit = async (values: any) => {
    setMessage("");
    setLoading(true);
    const res = await updateOwner({ id: record?.ID || 0, data: values });
    if (res) {
      setLoading(false);
      setIsOpen && setIsOpen(false);
    } else {
      setLoading(false);
      setMessage("خطایی پیش آمد، دوباره تلاش کنید!");
      return;
    }

    setMainLoading && setMainLoading(true);
    const mainData = await getAllOwners();
    setMainData && setMainData(mainData);
    setMainLoading && setMainLoading(false);
    setIsOpen && setIsOpen(false);
  };

  return (
    <Modal title="افزودن مالک جدید" open={isOpen} onCancel={() => setIsOpen && setIsOpen(false)} footer={null}>
      {record !== undefined ? (
        <Form form={form} className="w-full max-w-md bg-white" style={{ padding: 24 }} onFinish={handleSubmit}>
          <Typography.Title className="text-center">تغییر اطلاعات اشخاص</Typography.Title>
          <Divider />
          {fields.map((field) => (
            <Form.Item
              key={field.name}
              label={field.label}
              name={field.name}
              rules={[{ required: field.required, message: `لطفاً ${field.placeholder} را وارد کنید` }]}
            >
              <Input onChange={() => setMessage("")} type="text" placeholder={field.placeholder} />
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
            {message && <div className="text-sm text-red-500">{message}</div>}
          </div>
        </Form>
      ) : (
        "در حال بارگذاری..."
      )}
    </Modal>
  );
}
