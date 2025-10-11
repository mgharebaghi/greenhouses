import { Button, Col, Form, Input, InputNumber, Modal, Row, Select, Spin } from "antd";
import { PlantVarietyDTO } from "../page";
import { useEffect, useState } from "react";
import { Plants, PlantVarities } from "@/app/generated/prisma";
import { getPlants } from "@/app/lib/services/plants";
import { getPlantVarieties, updatePlantVariety } from "@/app/lib/services/varities";

type PlantVaritiesInsertModalProps = {
  isOpen?: boolean;
  onClose?: () => void;
  record?: PlantVarietyDTO;
  setMainLoading?: (loading: boolean) => void;
  setMainData?: (data: PlantVarietyDTO[]) => void;
};

export default function PlantVaritiesEditModal(props: PlantVaritiesInsertModalProps) {
  const [resMessage, setResMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [selectLoading, setSelectLoading] = useState(false);
  const [plantOptions, setPlantOptions] = useState<{ label: string; value: number }[]>([]);

  const [form] = Form.useForm();

  useEffect(() => {
    if (props.record) {
      form.setFieldsValue(props.record);
    }
    getPlantOptions();
  }, [props.isOpen]);

  const getPlantOptions = async () => {
    setSelectLoading(true);
    const plants: Plants[] = await getPlants();
    if (plants && plants.length > 0) {
      const options = plants.map((plant) => ({ label: plant.CommonName || "بدون نام", value: plant.PlantID }));
      setPlantOptions(options);
      setSelectLoading(false);
    }
  };

  const handleSubmit = async (values: PlantVarities) => {
    setResMessage(null);
    setLoading(true);
    const newPlantVaritie = await updatePlantVariety({ id: props.record?.VarietyID || 0, data: values });
    if (newPlantVaritie) {
      setLoading(false);
      props.setMainLoading && props.setMainLoading(true);
      props.onClose && props.onClose();
      const newMainData: PlantVarietyDTO[] = await getPlantVarieties();
      props.setMainData && props.setMainData(newMainData);
      props.setMainLoading && props.setMainLoading(false);
    } else {
      setLoading(false);
      setResMessage("خطا در ثبت گونه گیاهی!");
    }
  };

  const fields = [
    { name: "VarietyName", label: "نام گونه", type: "text", required: true },
    { name: "PlantID", label: "نام گیاه", type: "select", options: plantOptions, required: true },
    { name: "SeedCompany", label: "شرکت بذر", type: "text", required: false },
    { name: "DaysToGermination", label: "روز تا جوانه زنی", type: "number", required: true },
    { name: "DaysToSprout", label: "روز تا رویش", type: "number", required: true },
    { name: "DaysToSeedling", label: "روز تا نشاء", type: "number", required: true },
    { name: "DaysToMaturity", label: "روز تا بلوغ", type: "number", required: true },
    { name: "TypicalYieldKgPerM2", label: "عملکرد معمول کیلوگرم بر متر مربع", type: "number", required: true },
    { name: "IdealTempMin", label: "حداقل دمای ایده آل ", type: "number", required: true },
    { name: "IdealTempMax", label: "حداکثر دمای ایده آل", type: "number", required: true },
    { name: "IdealHumidityMin", label: "حداقل رطوبت ایده آل", type: "number", required: true },
    { name: "IdealHumidityMax", label: "حداکثر رطوبت ایده آل", type: "number", required: true },
    { name: "LightRequirement", label: "نیاز نوری", type: "text", required: true },
    { name: "GrowthCycleDays", label: "دوره رشد (روز)", type: "number", required: true },
  ];

  return (
    <Modal open={props.isOpen} title="افزودن گونه گیاهی" onCancel={props.onClose} footer={null} className="min-w-[60%]">
      <Form form={form} layout="vertical" onFinish={handleSubmit}>
        <Row gutter={[16, 16]}>
          {fields.map((field) => (
            <Col xs={24} sm={24} md={12} lg={8} key={field.name}>
              <Form.Item
                key={field.name}
                name={field.name}
                label={field.label}
                rules={[{ required: field.required, message: `لطفا ${field.label} را وارد کنید` }]}
              >
                {field.type === "number" ? (
                  <InputNumber style={{ width: "100%" }} />
                ) : field.type === "select" ? (
                  <Select
                    options={field.options}
                    optionFilterProp="label"
                    showSearch
                    allowClear
                    loading={selectLoading}
                  />
                ) : (
                  <Input type={field.type} />
                )}
              </Form.Item>
            </Col>
          ))}
        </Row>
        <Row>
          <Col span={24} className="flex justify-end">
            <Form.Item name="Notes" label="یادداشت">
              <Input.TextArea
                rows={4}
                placeholder="یادداشت‌ها"
                style={{ width: "100%", resize: "none", minHeight: "120px" }}
              />
            </Form.Item>
          </Col>
        </Row>
        <Row>
          <Col span={12} className="flex justify-end">
            <Button type="primary" htmlType="submit">
              اعمال تغییرات
            </Button>
          </Col>
          <Col span={12} className="flex justify-start">
            {loading && <Spin size="default" />}
            {resMessage && <span className="text-red-500">{resMessage}</span>}
          </Col>
        </Row>
      </Form>
    </Modal>
  );
}
