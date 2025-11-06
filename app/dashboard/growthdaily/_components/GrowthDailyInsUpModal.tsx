import type { Owner_Observer, PlantingGrowthDaily } from "@/app/generated/prisma";
import { getGrowthStagesByVariety } from "@/app/lib/services/growthstages";
import { getAllOwners } from "@/app/lib/services/owners";
import { Modal, Form, Input, InputNumber, Select, Checkbox } from "antd";
import { useEffect, useState } from "react";
import DatePicker from "react-multi-date-picker";
import persian from "react-date-object/calendars/persian";
import persian_fa from "react-date-object/locales/persian_fa";
import { createGrowthDaily } from "@/app/lib/services/growthdaily/create";
import { getGrowthDailyByPlantingId, updateGrowthDaily } from "@/app/lib/services/growthdaily";
import dayjs from "dayjs";
import {
  CloseOutlined,
  PlusOutlined,
  EditOutlined,
  CheckCircleOutlined,
  ExclamationCircleOutlined,
} from "@ant-design/icons";
import GreenhouseButton from "@/app/components/UI/GreenhouseButton";
import { getSamples } from "@/app/lib/services/plantingsamples";

export type GrowthDailyInsUpModalProps = {
  open: boolean;
  onClose?: () => void;
  initialData?: PlantingGrowthDaily;
  setMainData?: (data: PlantingGrowthDaily[]) => void;
  setMainLoading?: (loading: boolean) => void;
  isEdititng?: boolean;
  plantingId?: number | null;
  setPlantingId?: (id: number | null) => void;
  varietyID?: number | null;
};

type ItemOptions = {
  label: string | null;
  value: string | number;
};

export default function GrowthDailyInsUpModal(props: GrowthDailyInsUpModalProps) {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [submitMessage, setSubmitMessage] = useState<{ status: "ok" | "error"; message: string } | null>(null);

  const [ownersOptions, setOwnersOptions] = useState<ItemOptions[]>([]);
  const [ownersLoading, setOwnersLoading] = useState(false);

  const [stagesLoading, setStagesLoading] = useState(false);
  const [stagesOptions, setStagesOptions] = useState<ItemOptions[]>([]);

  const [plantingSamplesLoading, setPlantingSamplesLoading] = useState(false);
  const [plantingSamplesOptions, setPlantingSamplesOptions] = useState<ItemOptions[]>([]);

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
    const res = await getGrowthStagesByVariety(props.varietyID!);
    if (res) {
      setStagesLoading(false);
      const options = res.map((stage) => ({
        label: stage.StageName,
        value: stage.StageID,
      }));
      setStagesOptions(options);
    }
  };

  const getPlantingSamples = async () => {
    if (!props.plantingId) {
      setPlantingSamplesOptions([]);
      return;
    }
    setPlantingSamplesLoading(true);
    const res = await getSamples(props.plantingId);
    if (res) {
      setPlantingSamplesLoading(false);
      const options = res.map((sample: any) => ({
        label: sample.SerialID,
        value: Number(sample.ID),
      }));
      setPlantingSamplesOptions(options);
    } else {
      setPlantingSamplesLoading(false);
    }
  };

  useEffect(() => {
    getStagesOptions();
  }, [props.varietyID]);

  useEffect(() => {
    getOwnersOptions();
  }, []);

  useEffect(() => {
    getPlantingSamples();
  }, [props.plantingId]);

  useEffect(() => {
    if (!props.open) return;
    setSubmitMessage(null);
    form.resetFields();

    if (props.isEdititng && props.initialData) {
      const castedDatedVersion = {
        ...props.initialData,
        RecordDate: props.initialData.RecordDate ? new Date(props.initialData.RecordDate) : undefined,
      };
      form.setFieldsValue(castedDatedVersion);
      setIsEstimatedChecked(!!props.initialData.IsEstimated);
      setPestObservedChecked(!!props.initialData.PestObserved);
    } else {
      setIsEstimatedChecked(false);
      setPestObservedChecked(false);
    }
  }, [props.open, props.isEdititng, props.initialData, form]);

  const fields = [
    {
      name: "ObserverID",
      label: "مشاهده کننده",
      placeholder: "مشاهده کننده را انتخاب کنید",
      type: "select",
      options: ownersOptions,
      required: true,
      loading: ownersLoading,
      icon: "👤",
    },
    {
      name: "SampleID",
      label: "نمونه کاشت",
      placeholder: "نمونه کاشت را انتخاب کنید",
      type: "select",
      options: plantingSamplesOptions,
      required: true,
      loading: plantingSamplesLoading,
      icon: "🆔",
    },
    {
      name: "StageID",
      label: "مرحله رشد",
      placeholder: "مرحله رشد را انتخاب کنید",
      type: "select",
      options: stagesOptions,
      required: true,
      loading: stagesLoading,
      icon: "🌱",
    },
    { name: "RecordDate", label: "تاریخ ثبت", placeholder: "انتخاب تاریخ", type: "date", required: true, icon: "📅" },
    {
      name: "HeightCm",
      label: "ارتفاع (سانتی‌متر)",
      placeholder: "ارتفاع",
      type: "number",
      required: true,
      icon: "📏",
    },
    { name: "LeafCount", label: "تعداد برگ‌ها", placeholder: "تعداد", type: "number", required: true, icon: "🍃" },
    { name: "FlowerCount", label: "تعداد گل‌ها", placeholder: "تعداد", type: "number", required: true, icon: "🌸" },
    { name: "FruitCount", label: "تعداد میوه‌ها", placeholder: "تعداد", type: "number", required: true, icon: "🍎" },
    {
      name: "RootLength",
      label: "طول ریشه (سانتی‌متر)",
      placeholder: "طول",
      type: "number",
      required: true,
      icon: "🌿",
    },
    {
      name: "Rootdiameter",
      label: "قطر ریشه (میلی‌متر)",
      placeholder: "قطر",
      type: "number",
      required: true,
      icon: "⭕",
    },
    {
      name: "HealthScore",
      label: "امتیاز سلامت (1-10)",
      placeholder: "امتیاز",
      type: "number",
      required: true,
      icon: "💚",
    },
    { name: "IsEstimated", label: "آیا اطلاعات تخمینی است؟", type: "checkbox", required: false, icon: "❓" },
    { name: "PestObserved", label: "آفت مشاهده شد؟", type: "checkbox", required: false, icon: "🐛" },
  ];

  const handleSubmit = async (values: PlantingGrowthDaily) => {
    setLoading(true);
    setSubmitMessage(null);
    const completedValues: any = {
      ...values,
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
      setSubmitMessage({
        status: "ok",
        message: props.isEdititng ? "پایش روزانه با موفقیت ویرایش شد" : "پایش روزانه با موفقیت افزوده شد",
      });
      props.setMainLoading?.(true);
      const mainDataRes: any = await getGrowthDailyByPlantingId(props.plantingId!);
      props.setMainData?.(mainDataRes);
      props.setMainLoading?.(false);
      form.resetFields();
      setTimeout(() => {
        props.onClose?.();
        setSubmitMessage(null);
      }, 1500);
    } else {
      setSubmitMessage({ status: "error", message: "خطا در ثبت اطلاعات، لطفا مجددا تلاش کنید" });
    }
    setLoading(false);
  };

  const handleClose = () => {
    props.onClose?.();
    setSubmitMessage(null);
    form.resetFields();
    setIsEstimatedChecked(false);
    setPestObservedChecked(false);
  };

  return (
    <Modal
      open={props.open}
      onCancel={handleClose}
      footer={null}
      closeIcon={null}
      centered
      width={780}
      className="!p-0"
      destroyOnHidden
      styles={{
        content: {
          padding: 0,
          borderRadius: "1.25rem",
          overflow: "hidden",
          boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
        },
      }}
    >
      {/* Header */}
      <div
        className={`relative px-6 py-6 bg-gradient-to-br border-b ${
          props.isEdititng
            ? "from-amber-50 via-orange-50/80 to-white border-amber-100"
            : "from-emerald-50 via-lime-50/80 to-white border-emerald-100"
        }`}
      >
        <button
          onClick={handleClose}
          className={`absolute top-5 left-5 h-9 w-9 rounded-xl bg-white border transition-all flex items-center justify-center shadow-sm hover:shadow ${
            props.isEdititng
              ? "hover:bg-amber-50 border-amber-200 hover:border-amber-300 text-amber-600 hover:text-amber-700"
              : "hover:bg-emerald-50 border-emerald-200 hover:border-emerald-300 text-emerald-600 hover:text-emerald-700"
          }`}
          aria-label="بستن"
        >
          <CloseOutlined className="text-sm" />
        </button>

        <div className="flex items-center gap-4">
          <div className="relative">
            <div
              className={`h-14 w-14 rounded-2xl bg-gradient-to-br shadow-lg flex items-center justify-center text-white ${
                props.isEdititng
                  ? "from-amber-500 via-amber-600 to-orange-600"
                  : "from-emerald-500 via-emerald-600 to-emerald-700"
              }`}
            >
              {props.isEdititng ? <EditOutlined className="text-2xl" /> : <PlusOutlined className="text-2xl" />}
            </div>
            <div
              className={`absolute -bottom-1 -right-1 h-5 w-5 rounded-full border-2 border-white ${
                props.isEdititng ? "bg-orange-400" : "bg-lime-400"
              }`}
            ></div>
          </div>
          <div>
            <h3 className={`font-bold text-2xl ${props.isEdititng ? "text-amber-900" : "text-emerald-900"}`}>
              {props.isEdititng ? "ویرایش پایش روزانه رشد" : "افزودن پایش روزانه رشد"}
            </h3>
            <p
              className={`text-sm mt-1 flex items-center gap-1.5 ${
                props.isEdititng ? "text-amber-600/80" : "text-emerald-600/80"
              }`}
            >
              <span
                className={`h-1.5 w-1.5 rounded-full animate-pulse ${
                  props.isEdititng ? "bg-amber-400" : "bg-emerald-400"
                }`}
              ></span>
              {props.isEdititng ? "اطلاعات پایش را ویرایش کنید" : "اطلاعات پایش را با دقت وارد کنید"}
            </p>
          </div>
        </div>
      </div>

      {/* Body */}
      <div className="px-6 py-6 bg-gradient-to-br from-white to-slate-50/30 max-h-[70vh] overflow-y-auto">
        <Form form={form} layout="vertical" onFinish={handleSubmit} requiredMark={false}>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {fields.map((field) => (
              <Form.Item
                key={field.name}
                label={
                  <span className="text-sm font-semibold text-slate-700 flex items-center gap-2">
                    <span className="text-base">{field.icon}</span>
                    {field.label}
                    {field.required && <span className="text-rose-500 text-xs">*</span>}
                  </span>
                }
                name={field.name}
                rules={[{ required: field.required, message: `لطفاً ${field.label} را وارد کنید` }]}
                className="mb-0"
                valuePropName={field.type === "checkbox" ? "checked" : "value"}
              >
                {field.type === "select" ? (
                  <Select
                    options={field.options}
                    loading={field.loading}
                    showSearch
                    allowClear
                    optionFilterProp="label"
                    placeholder={field.placeholder}
                    disabled={loading}
                    size="large"
                    className="rounded-xl"
                    onChange={() => setSubmitMessage(null)}
                  />
                ) : field.type === "date" ? (
                  <DatePicker
                    calendar={persian}
                    locale={persian_fa}
                    disabled={loading}
                    placeholder={field.placeholder}
                    containerStyle={{ width: "100%" }}
                    style={{
                      width: "100%",
                      height: "46px",
                      fontSize: "14px",
                      borderRadius: "0.75rem",
                      border: "2px solid #e2e8f0",
                      padding: "0 1rem",
                    }}
                    onChange={() => setSubmitMessage(null)}
                  />
                ) : field.type === "checkbox" ? (
                  <Checkbox
                    checked={field.name === "IsEstimated" ? isEstimatedChecked : pestObservedChecked}
                    onChange={(e) => {
                      if (field.name === "IsEstimated") {
                        setIsEstimatedChecked(e.target.checked);
                      } else {
                        setPestObservedChecked(e.target.checked);
                      }
                      setSubmitMessage(null);
                    }}
                    disabled={loading}
                  >
                    <span className="text-sm text-slate-600">{field.label}</span>
                  </Checkbox>
                ) : (
                  <InputNumber
                    placeholder={field.placeholder}
                    disabled={loading}
                    size="large"
                    controls={false}
                    onChange={() => setSubmitMessage(null)}
                    className={`!w-full rounded-xl border-2 border-slate-200 transition-all shadow-sm hover:shadow ${
                      props.isEdititng
                        ? "hover:border-amber-300 focus:border-amber-400"
                        : "hover:border-emerald-300 focus:border-emerald-400"
                    }`}
                    style={{ width: "100%", height: "46px", fontSize: "14px" }}
                  />
                )}
              </Form.Item>
            ))}
          </div>

          <Form.Item
            label={
              <span className="text-sm font-semibold text-slate-700 flex items-center gap-2">
                <span className="text-base">📝</span>
                توضیحات
              </span>
            }
            name="Notes"
            className="mt-5"
          >
            <Input.TextArea
              placeholder="توضیحات اضافی"
              disabled={loading}
              rows={3}
              className={`rounded-xl border-2 border-slate-200 transition-all ${
                props.isEdititng
                  ? "hover:border-amber-300 focus:border-amber-400"
                  : "hover:border-emerald-300 focus:border-emerald-400"
              }`}
              style={{ resize: "none" }}
            />
          </Form.Item>

          {/* Message Display */}
          {submitMessage && (
            <div
              className={`mt-5 p-4 rounded-xl border-2 flex items-start gap-3 animate-in fade-in slide-in-from-top-3 duration-300 shadow-sm ${
                submitMessage.status === "ok"
                  ? "bg-gradient-to-br from-emerald-50 to-emerald-100/50 border-emerald-300 text-emerald-900"
                  : "bg-gradient-to-br from-rose-50 to-rose-100/50 border-rose-300 text-rose-900"
              }`}
            >
              <div
                className={`mt-0.5 p-1.5 rounded-lg ${
                  submitMessage.status === "ok" ? "bg-emerald-200/50" : "bg-rose-200/50"
                }`}
              >
                {submitMessage.status === "ok" ? (
                  <CheckCircleOutlined className="text-lg text-emerald-700" />
                ) : (
                  <ExclamationCircleOutlined className="text-lg text-rose-700" />
                )}
              </div>
              <div className="flex-1">
                <p className="text-sm font-semibold mb-0.5">{submitMessage.status === "ok" ? "موفقیت‌آمیز" : "خطا"}</p>
                <p className="text-sm leading-relaxed opacity-90">{submitMessage.message}</p>
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="flex flex-col-reverse sm:flex-row justify-end gap-3 mt-8 pt-6 border-t-2 border-slate-200">
            <GreenhouseButton
              text="انصراف"
              variant="secondary"
              onClick={handleClose}
              disabled={loading}
              className="w-full sm:w-auto min-w-[140px] h-11"
            />
            <GreenhouseButton
              text={
                loading
                  ? props.isEdititng
                    ? "در حال ویرایش..."
                    : "در حال ثبت..."
                  : props.isEdititng
                  ? "ویرایش پایش روزانه"
                  : "افزودن پایش روزانه"
              }
              variant="primary"
              type="submit"
              loading={loading}
              className="w-full sm:w-auto min-w-[140px] h-11 shadow-lg hover:shadow-xl"
            />
          </div>
        </Form>
      </div>
    </Modal>
  );
}
