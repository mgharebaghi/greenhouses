import type { PlantGrowthStages } from "@/app/generated/prisma";
import { getGrowthStages } from "@/app/lib/services/growthstages";
import { createGrowthStage } from "@/app/lib/services/growthstages/create";
import { updateGrowthStage } from "@/app/lib/services/growthstages/update";
import { getPlantVarieties } from "@/app/lib/services/varities";
import { Button, Col, Divider, Form, Input, InputNumber, Modal, Row, Select } from "antd";
import { useEffect, useState } from "react";

export type GrowthStagesInsUpModalProps = {
  isOpen: boolean;
  onClose?: () => void;
  setMainLoading?: (loading: boolean) => void;
  setMainData?: (data: PlantGrowthStages[]) => void;
  isEditMode?: boolean;
  editData?: PlantGrowthStages;
  StageID?: number;
};

type SelectOption<T> = {
  label: string;
  value: number | string;
};

export default function StagesInsUpModal(props: GrowthStagesInsUpModalProps) {
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();
  const [submitMessage, setSubmitMessage] = useState<string | null>(null);
  const [varityOptions, setVarityOptions] = useState<SelectOption<number>[]>([]);
  const [varityLoading, setVarityLoading] = useState<boolean>(false);
  const stageOrderOptions: SelectOption<number>[] = [
    { label: "مرحله 1", value: 1 },
    { label: "مرحله 2", value: 2 },
    { label: "مرحله 3", value: 3 },
    { label: "مرحله 4", value: 4 },
    { label: "مرحله 5", value: 5 },
    { label: "مرحله 6", value: 6 },
    { label: "مرحله 7", value: 7 },
  ];
  const stageNameOptions: SelectOption<string>[] = [
    { label: "جوانه زنی", value: "جوانه زنی" },
    { label: "نهال", value: "نهال" },
    { label: "رشد رویشی", value: "رشد رویشی" },
    { label: "گلدهی", value: "گلدهی" },
    { label: "میوه دهی", value: "میوه دهی" },
    { label: "رسیدگی میوه", value: "رسیدگی میوه" },
    { label: "برداشت", value: "برداشت" },
    { label: "نشاء", value: "نشاء" },
  ];

  useEffect(() => {
    if (props.isOpen) {
      getVarityOptions();
      if (props.isEditMode) {
        form.setFieldsValue(props.editData);
      }
    }
  }, [props.isOpen]);

  const getVarityOptions = async () => {
    setVarityLoading(true);
    const varities = await getPlantVarieties();
    const options = varities.map((v) => ({ label: v.VarietyName || "", value: v.VarietyID }));
    setVarityOptions(options);
    setVarityLoading(false);
  };

  const fields = [
    { name: "VarietyID", label: "گونه گیاهی", type: "select", required: true, options: varityOptions },
    { name: "StageOrder", label: "مرحله رشد", type: "select", required: true, options: stageOrderOptions },
    { name: "StageName", label: "عنوان مرحله", type: "select", required: true, options: stageNameOptions },
    { name: "EntryCriteria", label: "علایم ورود به این مرحله", type: "textArea", required: true },
    { name: "StartDay", label: "روز مورد انتظار برای ورود به این مرحله", type: "number", required: true },
    { name: "ExitCriteria", label: "علائم خروج از این مرحله", type: "textArea", required: true },
    { name: "EndDay", label: "روز مورد انتظار برای خروج از این مرحله", type: "number", required: true },
  ];

  const handleSubmit = async (values: PlantGrowthStages) => {
    setLoading(true);
    setSubmitMessage(null);
    const res = props.isEditMode
      ? await updateGrowthStage(props?.editData?.StageID || 0, values)
      : await createGrowthStage(values);
    if (res) {
      setLoading(false);
      setSubmitMessage(null);
      props.onClose?.();
      props.setMainLoading?.(true);
      const newData = await getGrowthStages();
      props.setMainData?.(newData);
      props.setMainLoading?.(false);
    }
  };

  return (
    <Modal
      title={props.isEditMode ? "ویرایش مرحله رشد" : "ثبت مرحله رشد جدید"}
      open={props.isOpen}
      onCancel={props.onClose}
      footer={null}
      style={{ minWidth: "70%" }}
    >
      <Divider />
      <Form layout="vertical" onFinish={handleSubmit} form={form}>
        <Row className="w-full" gutter={[16, 16]}>
          {fields.map((field) => (
            <Col key={field.name} xs={24} sm={24} md={12} lg={12}>
              <Form.Item
                key={field.name}
                name={field.name}
                label={field.label}
                rules={[{ required: field.required, message: `لطفا ${field.label} را وارد کنید` }]}
              >
                {field.type === "select" ? (
                  <Select
                    options={field.options}
                    loading={varityLoading}
                    showSearch
                    allowClear
                    optionFilterProp="label"
                  />
                ) : field.type === "textArea" ? (
                  <Input.TextArea placeholder={field.label} style={{ resize: "none" }} />
                ) : field.type === "number" ? (
                  <InputNumber placeholder={field.label} style={{ width: "100%" }} />
                ) : (
                  <Input placeholder={field.label} />
                )}
              </Form.Item>
            </Col>
          ))}
        </Row>
        <Form.Item>
          <Input.TextArea name="Description" placeholder="توضیحات" style={{ resize: "none", height: 150 }} />
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit">
            {loading ? "در حال ارسال..." : <span>{props.isEditMode ? "ویرایش مرحله رشد" : "ثبت مرحله رشد"}</span>}
          </Button>
          {submitMessage && <div className="mt-2 text-red-500">{submitMessage}</div>}
        </Form.Item>
      </Form>
    </Modal>
  );
}
