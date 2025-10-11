import type { Greenhouses, Plantings } from "@/app/generated/prisma";
import { allGreenHouses } from "@/app/lib/services/greenhouse";
import { getgreenHouseZones } from "@/app/lib/services/zones/read";
import { Button, Col, Divider, Form, Input, InputNumber, Modal, Row, Select } from "antd";
import { useEffect, useState } from "react";
import { PlantVarietyDTO } from "../../plantvarities/page";
import { getPlantVarieties } from "@/app/lib/services/varities";
import { createPlanting } from "@/app/lib/services/planting/create";
import { getAllPlantings, updatePlanting } from "@/app/lib/services/planting";
import DatePicker from "react-multi-date-picker";
import dayjs from "dayjs";
import persian from "react-date-object/calendars/persian";
import persian_fa from "react-date-object/locales/persian_fa";

export type PlantingInsUpModalProps = {
  open: boolean;
  onClose?: () => void;
  setMainData?: (props: Plantings[]) => void;
  setMainLoading?: (loading: boolean) => void;
  isInEditing?: boolean;
  initialData?: Plantings | null;
  plantingId?: number;
};

type selectOption = {
  label: string | null;
  value: string | number;
};

export default function PlantingInsUpModal({
  open,
  onClose,
  setMainData,
  setMainLoading,
  isInEditing,
  initialData,
  plantingId,
}: PlantingInsUpModalProps) {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState<boolean>(false);
  const [submitMessage, setSubmitMessage] = useState<string>("");

  const [greenHousOptions, setGreenHouseOptions] = useState<selectOption[]>([]);
  const [greenHousLoading, setGreenHouseLoading] = useState<boolean>(false);
  const [greenHousId, setGreenHouseId] = useState<number | null>(null);

  const [zoneOptions, setZoneOptions] = useState<selectOption[]>([]);
  const [zoneLoading, setZoneLoading] = useState<boolean>(false);

  const [varitiesOptions, setVaritiesOptions] = useState<selectOption[]>([]);
  const [varitiesLoading, setVaritiesLoading] = useState<boolean>(false);

  const getGreenHouses = async () => {
    setGreenHouseLoading(true);
    const res: Greenhouses[] = await allGreenHouses();
    if (res) {
      const options = res.map((gh) => ({ label: gh.GreenhouseName, value: gh.GreenhouseID }));
      setGreenHouseOptions(options);
    }
    setGreenHouseLoading(false);
  };

  const getZones = async (greenhouseId: number) => {
    setZoneLoading(true);
    const res = await getgreenHouseZones(greenhouseId);
    if (res) {
      const options = res.map((zone) => ({ label: zone.Name, value: zone.ZoneID }));
      setZoneOptions(options);
    }
    setZoneLoading(false);
  };

  const getVarities = async () => {
    setVaritiesLoading(true);
    const res: PlantVarietyDTO[] = await getPlantVarieties();
    if (res) {
      const options = res.map((v) => ({ label: v.VarietyName, value: v.VarietyID }));
      setVaritiesOptions(options);
    }
    setVaritiesLoading(false);
  };

  useEffect(() => {
    if (!open) return;
    if (form && isInEditing && initialData) {
      form.setFieldsValue({
        ...initialData,
        PlantDate: initialData.PlantDate ? dayjs(initialData.PlantDate) : undefined,
        ExpectedHarvestDate: initialData.ExpectedHarvestDate ? dayjs(initialData.ExpectedHarvestDate) : undefined,
        ActualHarvestDate: initialData.ActualHarvestDate ? dayjs(initialData.ActualHarvestDate) : undefined,
        TransplantDate: initialData.TransplantDate ? dayjs(initialData.TransplantDate) : undefined,
      });
    }
    getGreenHouses();
    getVarities();
  }, [open, form]);

  useEffect(() => {
    if (!open) return;
    if (form && !isInEditing) {
      form.setFieldsValue({
        ZoneId: undefined,
      });
    }
    if (greenHousId) {
      getZones(greenHousId);
    }
  }, [greenHousId, form]);

  const fields = [
    {
      name: "GreenhouseID",
      label: "گلخانه",
      type: "select",
      options: greenHousOptions || [{ label: "بدون داده", value: -1 }],
      required: true,
      loading: greenHousLoading,
    },
    {
      name: "ZoneID",
      label: "سالن",
      type: "select",
      options: zoneOptions || [{ label: "بدون داده", value: -1 }],
      required: true,
      loading: zoneLoading,
    },
    {
      name: "VarietyID",
      label: "گونه گیاهی",
      type: "select",
      options: varitiesOptions || [{ label: "بدون داده", value: -1 }],
      required: true,
      loading: varitiesLoading,
    },
    {
      name: "PlantDate",
      label: "تاریخ کاشت",
      type: "date",
      required: true,
    },
    {
      name: "SourceBatch",
      label: "شماره بچ",
      type: "text",
      required: true,
    },
    {
      name: "NumPlants",
      label: "تعداد گیاهان",
      type: "number",
      required: true,
    },
    {
      name: "PlantsPerM2",
      label: "تعداد گیاه در متر مربع",
      type: "number",
      required: true,
    },
    {
      name: "ExpectedHarvestDate",
      label: "تاریخ برداشت مورد انتظار",
      type: "date",
      required: true,
    },
    {
      name: "ActualHarvestDate",
      label: "تاریخ برداشت واقعی",
      type: "date",
      required: true,
    },
    {
      name: "SeedingMethod",
      label: "روش کاشت",
      type: "text",
      required: true,
    },
    {
      name: "TransplantDate",
      label: "تاریخ نشاء",
      type: "date",
      required: true,
    },
    {
      name: "PlantCountMeasured",
      label: "تعداد گیاهان شمارش شده",
      type: "number",
      required: true,
    },
  ];

  const handleSubmit = async (values: Plantings) => {
    setLoading(true);
    setSubmitMessage("");

    const newValue: any = {
      ...values,
      PlantDate: values.PlantDate
        ? new Date(
            Date.UTC(dayjs(values.PlantDate).year(), dayjs(values.PlantDate).month(), dayjs(values.PlantDate).date())
          )
        : undefined,
      ExpectedHarvestDate: values.ExpectedHarvestDate
        ? new Date(
            Date.UTC(
              dayjs(values.ExpectedHarvestDate).year(),
              dayjs(values.ExpectedHarvestDate).month(),
              dayjs(values.ExpectedHarvestDate).date()
            )
          )
        : undefined,
      ActualHarvestDate: values.ActualHarvestDate
        ? new Date(
            Date.UTC(
              dayjs(values.ActualHarvestDate).year(),
              dayjs(values.ActualHarvestDate).month(),
              dayjs(values.ActualHarvestDate).date()
            )
          )
        : undefined,
      TransplantDate: values.TransplantDate
        ? new Date(
            Date.UTC(
              dayjs(values.TransplantDate).year(),
              dayjs(values.TransplantDate).month(),
              dayjs(values.TransplantDate).date()
            )
          )
        : undefined,
    };

    const res = isInEditing ? await updatePlanting(plantingId || 0, newValue) : await createPlanting(newValue);
    setLoading(false);
    if (res) {
      onClose && onClose();
      setMainLoading && setMainLoading(true);
      const newData: any = await getAllPlantings();
      setMainData && setMainData(newData);
      setMainLoading && setMainLoading(false);
    }
  };

  return (
    <Modal
      open={open}
      onCancel={onClose}
      title={<span>{isInEditing ? "ویرایش بستر کاشت" : "افزودن بستر کاشت جدید"}</span>}
      footer={null}
      style={{ minWidth: "70%" }}
    >
      <Divider />
      <Form form={form} layout="vertical" onFinish={handleSubmit}>
        <Row gutter={[16, 16]} className="w-full">
          {fields.map((field) => (
            <Col key={field.name} xs={24} sm={24} md={12} lg={8}>
              <Form.Item
                name={field.name}
                label={field.label}
                rules={[{ required: field.required, message: `لطفا ${field.label} را وارد کنید` }]}
              >
                {field.type === "select" ? (
                  <Select
                    options={field.options}
                    loading={field.loading}
                    showSearch
                    allowClear
                    optionFilterProp="label"
                    onChange={(value) => (field.name === "GreenhouseID" ? setGreenHouseId(value as number) : null)}
                    disabled={field.name === "ZoneId" && !greenHousId}
                  />
                ) : field.type === "number" ? (
                  <InputNumber style={{ width: "100%" }} />
                ) : field.type === "date" ? (
                  <DatePicker
                    calendar={persian}
                    locale={persian_fa}
                    style={{ width: "100%" }}
                    placeholder="انتخاب تاریخ"
                  />
                ) : (
                  <Input type="text" />
                )}
              </Form.Item>
            </Col>
          ))}
        </Row>
        <Form.Item className="w-full" name="Notes" label="توضیحات">
          <Input.TextArea
            rows={4}
            placeholder="توضیحات"
            style={{ width: "100%", resize: "none", minHeight: "120px" }}
          />
        </Form.Item>
        <Form.Item className="w-full flex">
          <Button type="primary" htmlType="submit" className="px-6">
            {loading ? "در حال ارسال..." : isInEditing ? "ویرایش بستر کاشت" : "افزودن بستر کاشت"}
          </Button>
          <span className="text-red-500 mr-4 self-center">{submitMessage}</span>
        </Form.Item>
      </Form>
    </Modal>
  );
}
