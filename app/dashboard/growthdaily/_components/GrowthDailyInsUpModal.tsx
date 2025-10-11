import type { Owner_Observer, PlantingGrowthDaily } from "@/app/generated/prisma";
import { getGrowthStages } from "@/app/lib/services/growthstages";
import { getAllOwners } from "@/app/lib/services/owners";
import { Button, Checkbox, Col, Divider, Form, Input, InputNumber, Modal, Row, Select, Spin } from "antd";
import { useEffect, useState } from "react";
import DatePicker from "react-multi-date-picker";
import persian from "react-date-object/calendars/persian";
import persian_fa from "react-date-object/locales/persian_fa";
import { createGrowthDaily } from "@/app/lib/services/growthdaily/create";
import { getGrowthDailyByPlantingId, updateGrowthDaily } from "@/app/lib/services/growthdaily";
import dayjs from "dayjs";

export type GrowthDailyInsUpModalProps = {
  open: boolean;
  onClose?: () => void;
  initialData?: PlantingGrowthDaily;
  setMainData?: (data: PlantingGrowthDaily[]) => void;
  setMainLoading?: (loading: boolean) => void;
  isEdititng?: boolean;
  plantingId?: number | null;
  setPlantingId?: (id: number | null) => void;
};

type ItemOptions = {
  label: string | null;
  value: string | number;
};

export default function GrowthDailyInsUpModal(props: GrowthDailyInsUpModalProps) {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [submitMessage, setSubmitMessage] = useState("");

  const [ownersOptions, setOwnersOptions] = useState<ItemOptions[]>([]);
  const [ownersLoading, setOwnersLoading] = useState(false);
  const [stagesLoading, setStagesLoading] = useState(false);
  const [stagesOptions, setStagesOptions] = useState<ItemOptions[]>([]);

  const [isEstimatedChecked, setIsEstimatedChecked] = useState(false);
  const [pestObservedChecked, setPestObservedChecked] = useState(false);

  const getOwnersOptions = async () => {
    setOwnersLoading(true);

    const ownersRes: Owner_Observer[] = await getAllOwners();
    if (ownersRes) {
      setOwnersLoading(false);
      const options = ownersRes.map((owner) => ({
        label: owner.FirstName + " " + owner.LastName,
        value: owner.ID,
      }));
      setOwnersOptions(options);
    }
  };

  const getStagesOptions = async () => {
    setStagesLoading(true);
    const res = await getGrowthStages();
    if (res) {
      setStagesLoading(false);
      const options = res.map((stage) => ({
        label: stage.StageName,
        value: stage.StageID,
      }));
      setStagesOptions(options);
    }
  };

  useEffect(() => {
    getOwnersOptions();
    getStagesOptions();
  }, []);

  useEffect(() => {
    if (!props.open) return;

    form.resetFields();

    if (props.isEdititng && props.initialData) {
      const castedDatedVersion = {
        ...props.initialData,
        RecordDate: props.initialData.RecordDate ? dayjs(props.initialData.RecordDate) : undefined,
      };

      // set form values
      form.setFieldsValue(castedDatedVersion);
    } else {
      form.resetFields();
    }
  }, [props.open, props.isEdititng, props.initialData, form]);

  const fields = [
    {
      name: "ObserverID",
      label: "مشاهده کننده",
      type: "select",
      options: ownersOptions,
      required: true,
      loading: ownersLoading,
    },
    {
      name: "StageID",
      label: "مرحله رشد",
      type: "select",
      options: stagesOptions,
      required: true,
      loading: stagesLoading,
    },
    { name: "RecordDate", label: "تاریخ ثبت", type: "date", required: true },
    { name: "HeightCm", label: "ارتفاع (سانتی‌متر)", type: "number", required: true },
    { name: "LeafCount", label: "تعداد برگ‌ها", type: "number", required: true },
    { name: "FlowerCount", label: "تعداد گل‌ها", type: "number", required: true },
    { name: "FruitCount", label: "تعداد میوه‌ها", type: "number", required: true },
    { name: "RootLength", label: "طول ریشه (سانتی‌متر)", type: "number", required: true },
    { name: "Rootdiameter", label: "قطر ریشه (میلی‌متر)", type: "number", required: true },
    {
      name: "IsEstimated",
      label: "آیا اصلاعات تخمینی است؟",
      type: "checkbox",
      required: false,
      isChecked: isEstimatedChecked,
      setChecked: () => setIsEstimatedChecked(!isEstimatedChecked),
    },
    { name: "HealthScore", label: "امتیاز سلامت (1-10)", type: "number", required: true },
    {
      name: "PestObserved",
      label: "آفت مشاهده شد؟",
      type: "checkbox",
      required: false,
      isChecked: pestObservedChecked,
      setChecked: () => setPestObservedChecked(!pestObservedChecked),
    },
  ];

  const handleSubmit = async (values: PlantingGrowthDaily) => {
    setLoading(true);
    setSubmitMessage("");
    const completedValues: any = {
      ...values,
      PlantingID: Number(props.plantingId),
      IsEstimated: isEstimatedChecked,
      PestObserved: pestObservedChecked,
      RecordDate: values.RecordDate
        ? new Date(
            Date.UTC(dayjs(values.RecordDate).year(), dayjs(values.RecordDate).month(), dayjs(values.RecordDate).date())
          )
        : undefined,
    };
    const res = props.isEdititng
      ? await updateGrowthDaily(Number(props.initialData?.PlantGrowthDailyID), completedValues)
      : await createGrowthDaily(completedValues);
    if (res) {
      setLoading(false);
      props.onClose?.();
      props.setMainLoading?.(true);
      const mainDataRes: any = await getGrowthDailyByPlantingId(props.plantingId!);
      props.setMainData?.(mainDataRes);
      props.setMainLoading?.(false);
    } else {
      setLoading(false);
      setSubmitMessage("خطا در ثبت اطلاعات، لطفا مجددا تلاش کنید");
    }
  };

  return (
    <Modal
      title={props.isEdititng ? "ویرایش پایش روزانه رشد گیاه" : "افزودن پایش روزانه رشد گیاه"}
      open={props.open}
      onCancel={props.onClose}
      footer={null}
      style={{ minWidth: "70%" }}
      destroyOnHidden
    >
      <Divider />
      <Form form={form} layout="vertical" onFinish={handleSubmit}>
        <Row gutter={[16, 16]} style={{ width: "100%" }}>
          {fields.map((field) => (
            <Col xs={24} sm={12} md={8} lg={8} key={field.name}>
              <Form.Item
                key={field.name}
                label={field.label}
                name={field.name}
                rules={[{ required: field.required, message: `لطفا ${field.label} را وارد کنید` }]}
              >
                {field.type === "select" ? (
                  <Select
                    options={field.options}
                    loading={field.loading}
                    onChange={() => {
                      setLoading(false);
                      setSubmitMessage("");
                    }}
                  />
                ) : field.type === "date" ? (
                  <DatePicker
                    calendar={persian}
                    locale={persian_fa}
                    style={{ width: "100%", minHeight: "32px" }}
                    placeholder="انتخاب تاریخ"
                    onChange={() => {
                      setLoading(false);
                      setSubmitMessage("");
                    }}
                  />
                ) : field.type === "checkbox" ? (
                  <Checkbox checked={field.isChecked} onChange={field.setChecked} />
                ) : (
                  <InputNumber
                    style={{ width: "100%" }}
                    onChange={() => {
                      setLoading(false);
                      setSubmitMessage("");
                    }}
                  />
                )}
              </Form.Item>
            </Col>
          ))}

          <Form.Item name="Notes" label="توضیحات" style={{ width: "100%" }}>
            <Input.TextArea placeholder="توضیحات" style={{ width: "100%", resize: "none", minHeight: "120px" }} />
          </Form.Item>
          <Row>
            <Col span={24}>
              <Button type="primary" htmlType="submit">
                {props.isEdititng ? "ویرایش پایش روزانه" : "افزودن پایش روزانه"}
              </Button>
              {loading && <Spin size="default" />}
              <span className="text-red-500 mr-4">{submitMessage}</span>
            </Col>
          </Row>
        </Row>
      </Form>
    </Modal>
  );
}
