import { Modal, Form, Input, InputNumber, Select } from "antd";
import { PlantVarietyDTO } from "../page";
import { useEffect, useState } from "react";
import { Plants, PlantVarities } from "@/app/generated/prisma";
import { getPlants } from "@/app/lib/services/plants";
import { getPlantVarieties, updatePlantVariety } from "@/app/lib/services/varities";
import { CloseOutlined, EditOutlined, CheckCircleOutlined, ExclamationCircleOutlined } from "@ant-design/icons";
import GreenhouseButton from "@/app/components/UI/GreenhouseButton";

type PlantVaritiesInsertModalProps = {
  isOpen?: boolean;
  onClose?: () => void;
  record?: PlantVarietyDTO;
  setMainLoading?: (loading: boolean) => void;
  setMainData?: (data: PlantVarietyDTO[]) => void;
};

export default function PlantVaritiesEditModal(props: PlantVaritiesInsertModalProps) {
  const [resMessage, setResMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [selectLoading, setSelectLoading] = useState(false);
  const [plantOptions, setPlantOptions] = useState<{ label: string; value: number }[]>([]);
  const [form] = Form.useForm();

  useEffect(() => {
    if (props.isOpen && props.record) {
      form.setFieldsValue(props.record);
      setResMessage("");
      setLoading(false);
    }
    if (props.isOpen) {
      getPlantOptions();
    }
  }, [props.isOpen, props.record, form]);

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
    setResMessage("");
    setLoading(true);
    const newPlantVaritie = await updatePlantVariety({ id: props.record?.VarietyID || 0, data: values });

    if (newPlantVaritie) {
      setResMessage("اطلاعات گونه گیاهی با موفقیت ویرایش شد");
      props.setMainLoading?.(true);
      const newMainData: PlantVarietyDTO[] = await getPlantVarieties();
      props.setMainData?.(newMainData);
      props.setMainLoading?.(false);
      setTimeout(() => {
        props.onClose?.();
        setResMessage("");
      }, 1500);
    } else {
      setResMessage("خطا در ثبت گونه گیاهی!");
    }
    setLoading(false);
  };

  const handleClose = () => {
    props.onClose?.();
    setResMessage("");
    form.resetFields();
  };

  const fields = [
    {
      name: "VarietyName",
      label: "نام گونه",
      placeholder: "نام گونه را وارد کنید",
      type: "text",
      required: true,
      icon: "🌾",
    },
    {
      name: "PlantID",
      label: "نام گیاه",
      placeholder: "گیاه را انتخاب کنید",
      type: "select",
      options: plantOptions,
      required: true,
      icon: "🌱",
    },
    { name: "SeedCompany", label: "شرکت بذر", placeholder: "نام شرکت بذر", type: "text", required: false, icon: "🏢" },
    {
      name: "DaysToGermination",
      label: "روز تا جوانه زنی",
      placeholder: "تعداد روز",
      type: "number",
      required: true,
      icon: "🌱",
    },
    {
      name: "DaysToSprout",
      label: "روز تا رویش",
      placeholder: "تعداد روز",
      type: "number",
      required: true,
      icon: "🌿",
    },
    {
      name: "DaysToSeedling",
      label: "روز تا نشاء",
      placeholder: "تعداد روز",
      type: "number",
      required: true,
      icon: "🪴",
    },
    {
      name: "DaysToMaturity",
      label: "روز تا بلوغ",
      placeholder: "تعداد روز",
      type: "number",
      required: true,
      icon: "🌳",
    },
    {
      name: "TypicalYieldKgPerM2",
      label: "عملکرد (کیلوگرم/متر مربع)",
      placeholder: "عملکرد",
      type: "number",
      required: true,
      icon: "📊",
    },
    {
      name: "IdealTempMin",
      label: "حداقل دمای ایده‌آل",
      placeholder: "درجه سانتیگراد",
      type: "number",
      required: true,
      icon: "🌡️",
    },
    {
      name: "IdealTempMax",
      label: "حداکثر دمای ایده‌آل",
      placeholder: "درجه سانتیگراد",
      type: "number",
      required: true,
      icon: "🌡️",
    },
    {
      name: "IdealHumidityMin",
      label: "حداقل رطوبت ایده‌آل",
      placeholder: "درصد",
      type: "number",
      required: true,
      icon: "💧",
    },
    {
      name: "IdealHumidityMax",
      label: "حداکثر رطوبت ایده‌آل",
      placeholder: "درصد",
      type: "number",
      required: true,
      icon: "💧",
    },
    {
      name: "LightRequirement",
      label: "نیاز نوری",
      placeholder: "نیاز نوری",
      type: "text",
      required: true,
      icon: "☀️",
    },
    {
      name: "GrowthCycleDays",
      label: "دوره رشد (روز)",
      placeholder: "تعداد روز",
      type: "number",
      required: true,
      icon: "🔄",
    },
  ];

  return (
    <Modal
      open={props.isOpen}
      onCancel={handleClose}
      footer={null}
      closeIcon={null}
      centered
      width={780}
      className="!p-0"
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
      <div className="relative px-6 py-6 bg-gradient-to-br from-amber-50 via-orange-50/80 to-white border-b border-amber-100">
        <button
          onClick={handleClose}
          className="absolute top-5 left-5 h-9 w-9 rounded-xl bg-white hover:bg-amber-50 border border-amber-200 hover:border-amber-300 transition-all flex items-center justify-center text-amber-600 hover:text-amber-700 shadow-sm hover:shadow"
          aria-label="بستن"
        >
          <CloseOutlined className="text-sm" />
        </button>

        <div className="flex items-center gap-4">
          <div className="relative">
            <div className="h-14 w-14 rounded-2xl bg-gradient-to-br from-amber-500 via-amber-600 to-orange-600 shadow-lg flex items-center justify-center text-white">
              <EditOutlined className="text-2xl" />
            </div>
            <div className="absolute -bottom-1 -right-1 h-5 w-5 rounded-full bg-orange-400 border-2 border-white"></div>
          </div>
          <div>
            <h3 className="font-bold text-2xl text-amber-900">ویرایش اطلاعات گونه گیاهی</h3>
            <p className="text-sm text-amber-600/80 mt-1 flex items-center gap-1.5">
              <span className="h-1.5 w-1.5 rounded-full bg-amber-400 animate-pulse"></span>
              اطلاعات گونه گیاهی را ویرایش کنید
            </p>
          </div>
        </div>
      </div>

      {/* Body */}
      <div className="px-6 py-6 bg-gradient-to-br from-white to-slate-50/30 max-h-[70vh] overflow-y-auto">
        {props.record !== undefined ? (
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
                  {field.type === "number" ? (
                    <InputNumber
                      onChange={() => setResMessage("")}
                      placeholder={field.placeholder}
                      disabled={loading}
                      size="large"
                      controls={false}
                      className="!w-full rounded-xl border-2 border-slate-200 hover:border-amber-300 focus:border-amber-400 transition-all shadow-sm hover:shadow"
                      style={{ width: "100%", height: "46px", fontSize: "14px" }}
                    />
                  ) : field.type === "select" ? (
                    <Select
                      options={field.options}
                      optionFilterProp="label"
                      showSearch
                      allowClear
                      loading={selectLoading}
                      placeholder={field.placeholder}
                      disabled={loading}
                      size="large"
                      className="rounded-xl"
                      onChange={() => setResMessage("")}
                    />
                  ) : (
                    <Input
                      type={field.type}
                      onChange={() => setResMessage("")}
                      placeholder={field.placeholder}
                      disabled={loading}
                      size="large"
                      className="rounded-xl border-2 border-slate-200 hover:border-amber-300 focus:border-amber-400 transition-all shadow-sm hover:shadow"
                      style={{ height: "46px", fontSize: "14px" }}
                    />
                  )}
                </Form.Item>
              ))}
            </div>

            <Form.Item
              label={
                <span className="text-sm font-semibold text-slate-700 flex items-center gap-2">
                  <span className="text-base">📝</span>
                  یادداشت
                </span>
              }
              name="Notes"
              className="mt-5"
            >
              <Input.TextArea
                placeholder="یادداشت‌های اضافی"
                disabled={loading}
                rows={3}
                className="rounded-xl border-2 border-slate-200 hover:border-amber-300 focus:border-amber-400 transition-all"
                style={{ resize: "none" }}
              />
            </Form.Item>

            {/* Message Display */}
            {resMessage && (
              <div
                className={`mt-5 p-4 rounded-xl border-2 flex items-start gap-3 animate-in fade-in slide-in-from-top-3 duration-300 shadow-sm ${
                  resMessage.includes("موفقیت")
                    ? "bg-gradient-to-br from-emerald-50 to-emerald-100/50 border-emerald-300 text-emerald-900"
                    : "bg-gradient-to-br from-rose-50 to-rose-100/50 border-rose-300 text-rose-900"
                }`}
              >
                <div
                  className={`mt-0.5 p-1.5 rounded-lg ${
                    resMessage.includes("موفقیت") ? "bg-emerald-200/50" : "bg-rose-200/50"
                  }`}
                >
                  {resMessage.includes("موفقیت") ? (
                    <CheckCircleOutlined className="text-lg text-emerald-700" />
                  ) : (
                    <ExclamationCircleOutlined className="text-lg text-rose-700" />
                  )}
                </div>
                <div className="flex-1">
                  <p className="text-sm font-semibold mb-0.5">
                    {resMessage.includes("موفقیت") ? "موفقیت‌آمیز" : "خطا"}
                  </p>
                  <p className="text-sm leading-relaxed opacity-90">{resMessage}</p>
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
                text={loading ? "در حال ویرایش..." : "ویرایش اطلاعات"}
                variant="primary"
                type="submit"
                loading={loading}
                className="w-full sm:w-auto min-w-[140px] h-11 shadow-lg hover:shadow-xl"
              />
            </div>
          </Form>
        ) : (
          <div className="flex items-center justify-center py-12">
            <div className="text-slate-600">در حال بارگذاری...</div>
          </div>
        )}
      </div>
    </Modal>
  );
}
