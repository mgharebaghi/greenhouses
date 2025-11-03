import type { IrrigationEvent } from "@/app/generated/prisma";
import { Modal, Form, Input, InputNumber } from "antd";
import { useEffect, useState } from "react";
import {
  createIrrigationEvent,
  getIrrigationEventsByZoneId,
  updateIrrigationEvent,
} from "@/app/lib/services/irrigation";
import dayjs from "dayjs";
import {
  CloseOutlined,
  PlusOutlined,
  EditOutlined,
  CheckCircleOutlined,
  ExclamationCircleOutlined,
} from "@ant-design/icons";
import GreenhouseButton from "@/app/components/UI/GreenhouseButton";
import DatePicker from "react-multi-date-picker";
import persian from "react-date-object/calendars/persian";
import persian_fa from "react-date-object/locales/persian_fa";
import TimePicker from "react-multi-date-picker/plugins/time_picker";

export type IrrigationInsUpModalProps = {
  open: boolean;
  onClose?: () => void;
  initialData?: IrrigationEvent;
  setMainData?: (data: IrrigationEvent[]) => void;
  setMainLoading?: (loading: boolean) => void;
  isEditing?: boolean;
  zoneId?: number | null;
};

export default function IrrigationInsUpModal(props: IrrigationInsUpModalProps) {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [submitMessage, setSubmitMessage] = useState<{ status: "ok" | "error"; message: string } | null>(null);

  useEffect(() => {
    if (!props.open) return;
    setSubmitMessage(null);
    form.resetFields();

    if (props.isEditing && props.initialData) {
      const castedDatedVersion = {
        ...props.initialData,
        StartTime: props.initialData.StartTime ? new Date(props.initialData.StartTime) : undefined,
        EndTime: props.initialData.EndTime ? new Date(props.initialData.EndTime) : undefined,
      };
      form.setFieldsValue(castedDatedVersion);
    }
  }, [props.open, props.isEditing, props.initialData]); // eslint-disable-line react-hooks/exhaustive-deps

  const fields = [
    {
      name: "StartTime",
      label: "زمان شروع",
      placeholder: "انتخاب زمان شروع",
      type: "datetime",
      required: true,
      icon: "🕐",
    },
    {
      name: "EndTime",
      label: "زمان پایان",
      placeholder: "انتخاب زمان پایان",
      type: "datetime",
      required: false,
      icon: "🕑",
    },
    {
      name: "VolumeLiter",
      label: "حجم کل (لیتر)",
      placeholder: "حجم",
      type: "number",
      required: false,
      icon: "💧",
    },
    {
      name: "ECIn",
      label: "EC ورودی",
      placeholder: "EC",
      type: "number",
      required: false,
      icon: "⚡",
    },
    {
      name: "ECOut",
      label: "EC خروجی",
      placeholder: "EC",
      type: "number",
      required: false,
      icon: "⚡",
    },
    {
      name: "pHIn",
      label: "pH ورودی",
      placeholder: "pH",
      type: "number",
      required: false,
      icon: "🧪",
    },
    {
      name: "pHOut",
      label: "pH خروجی",
      placeholder: "pH",
      type: "number",
      required: false,
      icon: "🧪",
    },
    {
      name: "DrainPct",
      label: "درصد زهکشی",
      placeholder: "درصد",
      type: "number",
      required: false,
      icon: "📊",
    },
    {
      name: "TotalDurationSeconds",
      label: "مدت کل (ثانیه)",
      placeholder: "مدت",
      type: "number",
      required: false,
      icon: "⏱️",
    },
    {
      name: "TriggerType",
      label: "نوع ماشه",
      placeholder: "نوع ماشه",
      type: "text",
      required: false,
      icon: "🎯",
    },
    {
      name: "AvgFlowRate",
      label: "میانگین جریان",
      placeholder: "جریان",
      type: "number",
      required: false,
      icon: "🌊",
    },
  ];

  const handleSubmit = async (values: IrrigationEvent) => {
    setLoading(true);
    setSubmitMessage(null);

    const completedValues: any = {
      ...values,
      ZoneID: Number(props.zoneId),
      StartTime: values.StartTime
        ? new Date(
            dayjs(values.StartTime).year(),
            dayjs(values.StartTime).month(),
            dayjs(values.StartTime).date(),
            dayjs(values.StartTime).hour(),
            dayjs(values.StartTime).minute(),
            dayjs(values.StartTime).second()
          )
        : undefined,
      EndTime: values.EndTime
        ? new Date(
            dayjs(values.EndTime).year(),
            dayjs(values.EndTime).month(),
            dayjs(values.EndTime).date(),
            dayjs(values.EndTime).hour(),
            dayjs(values.EndTime).minute(),
            dayjs(values.EndTime).second()
          )
        : undefined,
    };

    const res = props.isEditing
      ? await updateIrrigationEvent(Number(props.initialData?.EventID), completedValues)
      : await createIrrigationEvent(completedValues);

    if (res) {
      setSubmitMessage({
        status: "ok",
        message: props.isEditing ? "رویداد آبیاری با موفقیت ویرایش شد" : "رویداد آبیاری با موفقیت افزوده شد",
      });
      props.setMainLoading?.(true);
      const mainDataRes: any = await getIrrigationEventsByZoneId(props.zoneId || 0);
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
  };

  return (
    <Modal
      open={props.open}
      onCancel={handleClose}
      footer={null}
      closeIcon={null}
      centered
      width={900}
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
          props.isEditing
            ? "from-amber-50 via-orange-50/80 to-white border-amber-100"
            : "from-emerald-50 via-lime-50/80 to-white border-emerald-100"
        }`}
      >
        <button
          onClick={handleClose}
          className={`absolute top-5 left-5 h-9 w-9 rounded-xl bg-white border transition-all flex items-center justify-center shadow-sm hover:shadow ${
            props.isEditing
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
                props.isEditing
                  ? "from-amber-500 via-amber-600 to-orange-600"
                  : "from-emerald-500 via-emerald-600 to-emerald-700"
              }`}
            >
              {props.isEditing ? <EditOutlined className="text-2xl" /> : <PlusOutlined className="text-2xl" />}
            </div>
            <div
              className={`absolute -bottom-1 -right-1 h-5 w-5 rounded-full border-2 border-white ${
                props.isEditing ? "bg-orange-400" : "bg-lime-400"
              }`}
            ></div>
          </div>
          <div>
            <h3 className={`font-bold text-2xl ${props.isEditing ? "text-amber-900" : "text-emerald-900"}`}>
              {props.isEditing ? "ویرایش رویداد آبیاری" : "افزودن رویداد آبیاری"}
            </h3>
            <p
              className={`text-sm mt-1 flex items-center gap-1.5 ${
                props.isEditing ? "text-amber-600/80" : "text-emerald-600/80"
              }`}
            >
              <span
                className={`h-1.5 w-1.5 rounded-full animate-pulse ${
                  props.isEditing ? "bg-amber-400" : "bg-emerald-400"
                }`}
              ></span>
              {props.isEditing ? "اطلاعات رویداد را ویرایش کنید" : "اطلاعات رویداد را با دقت وارد کنید"}
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
              >
                {field.type === "datetime" ? (
                  <DatePicker
                    calendar={persian}
                    locale={persian_fa}
                    format="YYYY/MM/DD HH:mm"
                    plugins={[<TimePicker key="time" position="bottom" />]}
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
                ) : field.type === "text" ? (
                  <Input
                    placeholder={field.placeholder}
                    disabled={loading}
                    size="large"
                    onChange={() => setSubmitMessage(null)}
                    className={`!w-full rounded-xl border-2 border-slate-200 transition-all shadow-sm hover:shadow ${
                      props.isEditing
                        ? "hover:border-amber-300 focus:border-amber-400"
                        : "hover:border-emerald-300 focus:border-emerald-400"
                    }`}
                    style={{ height: "46px", fontSize: "14px" }}
                  />
                ) : (
                  <InputNumber
                    placeholder={field.placeholder}
                    disabled={loading}
                    size="large"
                    controls={false}
                    onChange={() => setSubmitMessage(null)}
                    className={`!w-full rounded-xl border-2 border-slate-200 transition-all shadow-sm hover:shadow ${
                      props.isEditing
                        ? "hover:border-amber-300 focus:border-amber-400"
                        : "hover:border-emerald-300 focus:border-emerald-400"
                    }`}
                    style={{ width: "100%", height: "46px", fontSize: "14px" }}
                  />
                )}
              </Form.Item>
            ))}
          </div>

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
                  ? props.isEditing
                    ? "در حال ویرایش..."
                    : "در حال ثبت..."
                  : props.isEditing
                  ? "ویرایش رویداد آبیاری"
                  : "افزودن رویداد آبیاری"
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
