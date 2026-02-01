import type { ClimateDaily, Owner_Observer } from "@/app/generated/prisma";
import { getAllOwners } from "@/app/lib/services/owners";
import { Modal, Form, Input, InputNumber, Select } from "antd";
import { useEffect, useState } from "react";
import DatePicker from "react-multi-date-picker";
import persian from "react-date-object/calendars/persian";
import persian_fa from "react-date-object/locales/persian_fa";
import TimePicker from "react-multi-date-picker/plugins/time_picker";
import {
  createClimateDaily,
  getClimateDailyByZoneId,
  getClimateData,
  updateClimateDaily,
} from "@/app/lib/services/climatedaily";
import dayjs from "dayjs";
import {
  CloseOutlined,
  PlusOutlined,
  EditOutlined,
  CheckCircleOutlined,
  ExclamationCircleOutlined,
} from "@ant-design/icons";
import GreenhouseButton from "@/app/components/UI/GreenhouseButton";

export type ClimateDailyInsUpModalProps = {
  open: boolean;
  onClose?: () => void;
  initialData?: ClimateDaily;
  setMainData?: (data: ClimateDaily[]) => void;
  setMainLoading?: (loading: boolean) => void;
  isEditing?: boolean;
  zoneId?: number | null;
};

type ItemOptions = {
  label: string | null;
  value: string | number;
};

export default function ClimateDailyInsUpModal(props: ClimateDailyInsUpModalProps) {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [submitMessage, setSubmitMessage] = useState<{ status: "ok" | "error"; message: string } | null>(null);

  const [ownersOptions, setOwnersOptions] = useState<ItemOptions[]>([]);
  const [ownersLoading, setOwnersLoading] = useState(false);

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

  useEffect(() => {
    getOwnersOptions();
  }, []);

  useEffect(() => {
    if (!props.open) return;
    setSubmitMessage(null);
    form.resetFields();

    if (props.isEditing && props.initialData) {
      const castedDatedVersion = {
        ...props.initialData,
        RecordDate: props.initialData.RecordDate ? new Date(props.initialData.RecordDate) : undefined,
        RecordTime: props.initialData.RecordTime ? new Date(props.initialData.RecordTime) : undefined,
      };
      form.setFieldsValue(castedDatedVersion);
    }
  }, [props.open, props.isEditing, props.initialData, form]);

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
    { name: "RecordDate", label: "تاریخ ثبت", placeholder: "انتخاب تاریخ", type: "date", required: true, icon: "📅" },
    { name: "RecordTime", label: "زمان ثبت", placeholder: "انتخاب زمان", type: "time", required: true, icon: "🕐" },
    {
      name: "ExternalTemp",
      label: "دمای خارجی (°C)",
      placeholder: "دما",
      type: "number",
      required: false,
      icon: "🌡️",
    },
    {
      name: "ExternalHumidity",
      label: "رطوبت خارجی (%)",
      placeholder: "رطوبت",
      type: "number",
      required: false,
      icon: "💧",
    },
    {
      name: "ExternalPressure",
      label: "فشار هوا (hPa)",
      placeholder: "فشار",
      type: "number",
      required: false,
      icon: "🌐",
    },
    {
      name: "ExternalRainfallMM",
      label: "میازن بارش (mm)",
      placeholder: "میزان بارش",
      type: "number",
      required: false,
      icon: "🌧️",
    },
    {
      name: "InternalTemp",
      label: "دمای داخلی (°C)",
      placeholder: "دما",
      type: "number",
      required: false,
      icon: "🌡️",
    },
    {
      name: "InternalHumidity",
      label: "رطوبت داخلی (%)",
      placeholder: "رطوبت",
      type: "number",
      required: false,
      icon: "💧",
    },
    {
      name: "CO2ppm",
      label: "CO2 (ppm)",
      placeholder: "غلظت CO2",
      type: "number",
      required: false,
      icon: "💨",
    },
    {
      name: "ExternalPAR",
      label: "PAR خارجی",
      placeholder: "PAR",
      type: "number",
      required: false,
      icon: "☀️",
    },
    {
      name: "ExternalDLI",
      label: "DLI خارجی",
      placeholder: "DLI",
      type: "number",
      required: false,
      icon: "🌅",
    },
    {
      name: "InternalPAR",
      label: "PAR داخلی",
      placeholder: "PAR",
      type: "number",
      required: false,
      icon: "💡",
    },
    {
      name: "InternalDLI",
      label: "DLI داخلی",
      placeholder: "DLI",
      type: "number",
      required: false,
      icon: "🔆",
    },
    {
      name: "WindSpeed",
      label: "سرعت باد (m/s)",
      placeholder: "سرعت",
      type: "number",
      required: false,
      icon: "🌬️",
    },
    {
      name: "WindDirection",
      label: "جهت باد (درجه)",
      placeholder: "جهت",
      type: "number",
      required: false,
      icon: "🧭",
    },
    {
      name: "VentOpenPct",
      label: "باز شدن دریچه (%)",
      placeholder: "درصد",
      type: "number",
      required: false,
      icon: "🪟",
    },
    {
      name: "VentErrorCount",
      label: "تعداد خطاهای دریچه",
      placeholder: "تعداد",
      type: "number",
      required: false,
      icon: "⚠️",
    },
    {
      name: "VPD",
      label: "VPD (kPa)",
      placeholder: "VPD",
      type: "number",
      required: false,
      icon: "📊",
    },
  ];

  const handleSubmit = async (values: ClimateDaily) => {
    setLoading(true);
    setSubmitMessage(null);

    const completedValues: any = {
      ...values,
      ZoneID: Number(props.zoneId),
      RecordDate: values.RecordDate
        ? new Date(
          Date.UTC(dayjs(values.RecordDate).year(), dayjs(values.RecordDate).month(), dayjs(values.RecordDate).date())
        )
        : undefined,
      RecordTime: values.RecordTime
        ? new Date(
          Date.UTC(
            1970,
            0,
            1,
            dayjs(values.RecordTime).hour(),
            dayjs(values.RecordTime).minute(),
            dayjs(values.RecordTime).second()
          )
        )
        : undefined,
    };

    const res = props.isEditing
      ? await updateClimateDaily(Number(props.initialData?.ClimateDailyID), completedValues)
      : await createClimateDaily(completedValues);

    if (res) {
      setSubmitMessage({
        status: "ok",
        message: props.isEditing ? "پایش آب و هوا با موفقیت ویرایش شد" : "پایش آب و هوا با موفقیت افزوده شد",
      });
      props.setMainLoading?.(true);
      const mainDataRes: any = await getClimateDailyByZoneId(props.zoneId || 0);
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
        className={`relative px-6 py-6 bg-gradient-to-br border-b ${props.isEditing
          ? "from-amber-50 via-orange-50/80 to-white border-amber-100 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 dark:border-slate-700"
          : "from-emerald-50 via-lime-50/80 to-white border-emerald-100 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 dark:border-slate-700"
          }`}
      >
        <button
          onClick={handleClose}
          className={`absolute top-5 left-5 h-9 w-9 rounded-xl bg-white dark:bg-slate-800 border transition-all flex items-center justify-center shadow-sm hover:shadow ${props.isEditing
            ? "hover:bg-amber-50 border-amber-200 hover:border-amber-300 text-amber-600 hover:text-amber-700 dark:border-slate-600 dark:hover:border-amber-700 dark:hover:bg-amber-900/20 dark:text-amber-500"
            : "hover:bg-emerald-50 border-emerald-200 hover:border-emerald-300 text-emerald-600 hover:text-emerald-700 dark:border-slate-600 dark:hover:border-emerald-700 dark:hover:bg-emerald-900/20 dark:text-emerald-500"
            }`}
          aria-label="بستن"
        >
          <CloseOutlined className="text-sm" />
        </button>

        <div className="flex items-center gap-4">
          <div className="relative">
            <div
              className={`h-14 w-14 rounded-2xl bg-gradient-to-br shadow-lg flex items-center justify-center text-white ${props.isEditing
                ? "from-amber-500 via-amber-600 to-orange-600"
                : "from-emerald-500 via-emerald-600 to-emerald-700"
                }`}
            >
              {props.isEditing ? <EditOutlined className="text-2xl" /> : <PlusOutlined className="text-2xl" />}
            </div>
            <div
              className={`absolute -bottom-1 -right-1 h-5 w-5 rounded-full border-2 border-white dark:border-slate-800 ${props.isEditing ? "bg-orange-400" : "bg-lime-400"
                }`}
            ></div>
          </div>
          <div>
            <h3 className={`font-bold text-2xl ${props.isEditing ? "text-amber-900 dark:text-slate-100" : "text-emerald-900 dark:text-slate-100"}`}>
              {props.isEditing ? "ویرایش پایش آب و هوا" : "افزودن پایش آب و هوا"}
            </h3>
            <p
              className={`text-sm mt-1 flex items-center gap-1.5 ${props.isEditing ? "text-amber-600/80 dark:text-slate-400" : "text-emerald-600/80 dark:text-slate-400"
                }`}
            >
              <span
                className={`h-1.5 w-1.5 rounded-full animate-pulse ${props.isEditing ? "bg-amber-400" : "bg-emerald-400"
                  }`}
              ></span>
              {props.isEditing ? "اطلاعات پایش را ویرایش کنید" : "اطلاعات پایش را با دقت وارد کنید"}
            </p>
          </div>
        </div>
      </div>

      {/* Body */}
      <div className="px-6 py-6 bg-gradient-to-br from-white to-slate-50/30 dark:from-slate-900 dark:to-slate-950 max-h-[70vh] overflow-y-auto">
        <Form form={form} layout="vertical" onFinish={handleSubmit} requiredMark={false}>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {fields.map((field) => (
              <Form.Item
                key={field.name}
                label={
                  <span className="text-sm font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-2">
                    <span className="text-base">{field.icon}</span>
                    {field.label}
                    {field.required && <span className="text-rose-500 text-xs">*</span>}
                  </span>
                }
                name={field.name}
                rules={[{ required: field.required, message: `لطفاً ${field.label} را وارد کنید` }]}
                className="mb-0"
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
                      border: "2px solid #e2e8f0", // We need to override this in CSS or handle it separately since inline styles override classes. 
                      // actually let's try to remove inline border and use class
                      padding: "0 1rem",
                    }}
                    inputClass={`!w-full !h-full bg-transparent outline-none dark:text-white dark:bg-slate-800 rounded-xl border-2 border-slate-200 dark:border-slate-700 ${props.isEditing ? "hover:border-amber-300 focus:border-amber-400 dark:hover:border-amber-700 dark:focus:border-amber-600" : "hover:border-emerald-300 focus:border-emerald-400 dark:hover:border-emerald-700 dark:focus:border-emerald-600"}`}
                    onChange={() => setSubmitMessage(null)}
                  />
                ) : field.type === "time" ? (
                  <DatePicker
                    disableDayPicker
                    format="HH:mm:ss"
                    plugins={[<TimePicker key="time" hideSeconds={false} />]}
                    disabled={loading}
                    placeholder={field.placeholder}
                    containerStyle={{ width: "100%" }}
                    style={{
                      width: "100%",
                      height: "46px",
                      fontSize: "14px",
                      borderRadius: "0.75rem",
                      border: "2px solid #e2e8f0", // We need to override this in CSS or handle it separately since inline styles override classes. 
                      // actually let's try to remove inline border and use class
                      padding: "0 1rem",
                    }}
                    inputClass={`!w-full !h-full bg-transparent outline-none dark:text-white dark:bg-slate-800 rounded-xl border-2 border-slate-200 dark:border-slate-700 ${props.isEditing ? "hover:border-amber-300 focus:border-amber-400 dark:hover:border-amber-700 dark:focus:border-amber-600" : "hover:border-emerald-300 focus:border-emerald-400 dark:hover:border-emerald-700 dark:focus:border-emerald-600"}`}
                    onChange={() => setSubmitMessage(null)}
                  />
                ) : (
                  <InputNumber
                    placeholder={field.placeholder}
                    disabled={loading}
                    size="large"
                    controls={false}
                    onChange={() => setSubmitMessage(null)}
                    className={`!w-full rounded-xl border-2 border-slate-200 dark:border-slate-700 dark:bg-slate-800 dark:text-white dark:placeholder-slate-500 transition-all shadow-sm hover:shadow ${props.isEditing
                      ? "hover:border-amber-300 focus:border-amber-400 dark:hover:border-amber-700 dark:focus:border-amber-600"
                      : "hover:border-emerald-300 focus:border-emerald-400 dark:hover:border-emerald-700 dark:focus:border-emerald-600"
                      }`}
                    style={{ width: "100%", height: "46px", fontSize: "14px" }}
                  />
                )}
              </Form.Item>
            ))}
          </div>

          <Form.Item
            label={
              <span className="text-sm font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-2">
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
              className={`rounded-xl border-2 border-slate-200 dark:border-slate-700 dark:bg-slate-800 dark:text-white dark:placeholder-slate-500 transition-all ${props.isEditing
                ? "hover:border-amber-300 focus:border-amber-400 dark:hover:border-amber-700 dark:focus:border-amber-600"
                : "hover:border-emerald-300 focus:border-emerald-400 dark:hover:border-emerald-700 dark:focus:border-emerald-600"
                }`}
              style={{ resize: "none" }}
            />
          </Form.Item>

          {/* Message Display */}
          {submitMessage && (
            <div
              className={`mt-5 p-4 rounded-xl border-2 flex items-start gap-3 animate-in fade-in slide-in-from-top-3 duration-300 shadow-sm ${submitMessage.status === "ok"
                ? "bg-gradient-to-br from-emerald-50 to-emerald-100/50 dark:from-emerald-900/30 dark:to-emerald-900/10 border-emerald-300 dark:border-emerald-800 text-emerald-900 dark:text-emerald-300"
                : "bg-gradient-to-br from-rose-50 to-rose-100/50 dark:from-rose-900/30 dark:to-rose-900/10 border-rose-300 dark:border-rose-800 text-rose-900 dark:text-rose-300"
                }`}
            >
              <div
                className={`mt-0.5 p-1.5 rounded-lg ${submitMessage.status === "ok" ? "bg-emerald-200/50 dark:bg-emerald-800/50" : "bg-rose-200/50 dark:bg-rose-800/50"
                  }`}
              >
                {submitMessage.status === "ok" ? (
                  <CheckCircleOutlined className="text-lg text-emerald-700 dark:text-emerald-400" />
                ) : (
                  <ExclamationCircleOutlined className="text-lg text-rose-700 dark:text-rose-400" />
                )}
              </div>
              <div className="flex-1">
                <p className="text-sm font-semibold mb-0.5">{submitMessage.status === "ok" ? "موفقیت‌آمیز" : "خطا"}</p>
                <p className="text-sm leading-relaxed opacity-90">{submitMessage.message}</p>
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="flex flex-col-reverse sm:flex-row justify-end gap-3 mt-8 pt-6 border-t-2 border-slate-200 dark:border-slate-700">
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
                    ? "ویرایش پایش آب و هوا"
                    : "افزودن پایش آب و هوا"
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
