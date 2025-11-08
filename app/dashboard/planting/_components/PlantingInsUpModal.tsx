import type { Greenhouses, Plantings, Zones } from "@/app/generated/prisma";
import { allGreenHouses } from "@/app/lib/services/greenhouse";
import { getgreenHouseZones } from "@/app/lib/services/zones/read";
import { Modal, Form, Input, InputNumber, Select } from "antd";
import { useEffect, useState } from "react";
import { PlantVarietyDTO } from "../../plantvarities/page";
import { getPlantVarieties } from "@/app/lib/services/varities";
import { createPlanting } from "@/app/lib/services/planting/create";
import { getAllPlantings, updatePlanting } from "@/app/lib/services/planting";
import DatePicker from "react-multi-date-picker";
import dayjs from "dayjs";
import persian from "react-date-object/calendars/persian";
import persian_fa from "react-date-object/locales/persian_fa";
import {
  CloseOutlined,
  PlusOutlined,
  EditOutlined,
  CheckCircleOutlined,
  ExclamationCircleOutlined,
} from "@ant-design/icons";
import GreenhouseButton from "@/app/components/UI/GreenhouseButton";
import { SupplierDTO } from "../../suppliers/types";
import { getSuppliers } from "@/app/lib/services/suppliers";

export type PlantingInsUpModalProps = {
  open: boolean;
  onClose?: () => void;
  setMainData?: (props: Plantings[]) => void;
  setMainLoading?: (loading: boolean) => void;
  isInEditing?: boolean;
  initialData?: Plantings | null;
  plantingId?: number;
  ZoneID?: number;
};

type selectOption = {
  label: string | null;
  value: number;
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
  const [submitMessage, setSubmitMessage] = useState<{ status: "ok" | "error"; message: string } | null>(null);

  const [greenHousOptions, setGreenHouseOptions] = useState<selectOption[]>([]);
  const [greenHousLoading, setGreenHouseLoading] = useState<boolean>(false);
  const [greenHousId, setGreenHouseId] = useState<number | null>(null);

  const [zoneOptions, setZoneOptions] = useState<selectOption[]>([]);
  const [zoneLoading, setZoneLoading] = useState<boolean>(false);

  const [varitiesOptions, setVaritiesOptions] = useState<selectOption[]>([]);
  const [varitiesLoading, setVaritiesLoading] = useState<boolean>(false);

  const [suppliersOptions, setSuppliersOptions] = useState<selectOption[]>([]);
  const [suppliersLoading, setSuppliersLoading] = useState<boolean>(false);

  const getGreenHouses = async () => {
    setGreenHouseLoading(true);
    const res: Greenhouses[] = await allGreenHouses();
    if (res) {
      const options = res.map((gh) => ({ label: gh.GreenhouseName, value: Number(gh.GreenhouseID) }));
      setGreenHouseOptions(options);
    }
    setGreenHouseLoading(false);
  };

  const getZones = async (greenhouseId: number) => {
    setZoneLoading(true);
    setZoneOptions([]);
    const res = await getgreenHouseZones(greenhouseId);
    if (res) {
      const options = res.map((zone) => ({ label: zone.Name, value: zone.ZoneID }));
      setZoneOptions(options);
      console.log("zones: ", zoneOptions);
    }
    setZoneLoading(false);
    return zoneOptions;
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

  const getSupliers = async () => {
    setSuppliersLoading(true);
    const res: SupplierDTO[] = await getSuppliers();
    if (res) {
      const options = res.map((s) => ({
        label: s.Legal ? s.CompanyName : s.FirstName + " " + s.LastName,
        value: s.ID,
      }));
      setSuppliersOptions(options);
    }
    setSuppliersLoading(false);
  };

  useEffect(() => {
    if (!open) return;
    getGreenHouses();
    getVarities();
    getSupliers();
    setSubmitMessage(null);
    if (form && isInEditing && initialData) {
      form.setFieldsValue({
        ...initialData,
        PlantDate: initialData.PlantDate ? new Date(initialData.PlantDate) : undefined,
        ExpectedHarvestDate: initialData.ExpectedHarvestDate ? new Date(initialData.ExpectedHarvestDate) : undefined,
        ActualHarvestDate: initialData.ActualHarvestDate ? new Date(initialData.ActualHarvestDate) : undefined,
        TransplantDate: initialData.TransplantDate ? new Date(initialData.TransplantDate) : undefined,
      });
      setZoneOptions([]);
      setGreenHouseId(initialData.GreenhouseID);
      if (initialData.GreenhouseID) getZones(initialData.GreenhouseID);
    }
  }, [open, form, isInEditing, initialData]);

  useEffect(() => {
    if (!open) return;
    if (!isInEditing) form.setFieldsValue({ ZoneID: null });
    if (greenHousId) getZones(greenHousId);
  }, [greenHousId, open, isInEditing, form]);

  const fields = [
    {
      name: "GreenhouseID",
      label: "گلخانه",
      placeholder: "گلخانه را انتخاب کنید",
      type: "select",
      options: greenHousOptions,
      required: true,
      loading: greenHousLoading,
      icon: "🏡",
    },
    {
      name: "ZoneID",
      label: "سالن",
      placeholder: "سالن را انتخاب کنید",
      type: "select",
      options: zoneOptions,
      required: true,
      loading: zoneLoading,
      icon: "🚪",
    },
    {
      name: "VarietyID",
      label: "گونه گیاهی",
      placeholder: "گونه گیاهی را انتخاب کنید",
      type: "select",
      options: varitiesOptions,
      required: true,
      loading: varitiesLoading,
      icon: "🌱",
    },
    { name: "PlantDate", label: "تاریخ کاشت", placeholder: "انتخاب تاریخ", type: "date", required: true, icon: "📅" },
    {
      name: "SupplierID",
      label: "تامین کننده",
      placeholder: "تامین کننده را انتخاب کنید",
      type: "select",
      required: true,
      icon: "🏷️",
      options: suppliersOptions,
      loading: suppliersLoading,
    },
    { name: "NumPlants", label: "تعداد گیاهان", placeholder: "تعداد", type: "number", required: true, icon: "🌿" },
    {
      name: "PlantsPerM2",
      label: "تعداد گیاه در متر مربع",
      placeholder: "تعداد در متر مربع",
      type: "number",
      required: true,
      icon: "📊",
    },
    {
      name: "ExpectedHarvestDate",
      label: "تاریخ برداشت مورد انتظار",
      placeholder: "انتخاب تاریخ",
      type: "date",
      required: true,
      icon: "📅",
    },
    {
      name: "ActualHarvestDate",
      label: "تاریخ برداشت واقعی",
      placeholder: "انتخاب تاریخ",
      type: "date",
      required: false,
      icon: "📅",
    },
    { name: "SeedingMethod", label: "روش کاشت", placeholder: "روش کاشت", type: "text", required: true, icon: "🌾" },
    {
      name: "TransplantDate",
      label: "تاریخ نشاء",
      placeholder: "انتخاب تاریخ",
      type: "date",
      required: false,
      icon: "📅",
    },
    {
      name: "PlantCountMeasured",
      label: "تعداد گیاهان شمارش شده",
      placeholder: "تعداد",
      type: "number",
      required: false,
      icon: "🔢",
    },
  ];

  const handleSubmit = async (values: Plantings) => {
    setLoading(true);
    setSubmitMessage(null);

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

    if (res) {
      setSubmitMessage({
        status: "ok",
        message: isInEditing ? "اطلاعات کاشت با موفقیت ویرایش شد" : "اطلاعات کاشت با موفقیت افزوده شد",
      });
      setMainLoading?.(true);
      const newData: any = await getAllPlantings();
      setMainData?.(newData);
      setMainLoading?.(false);
      form.resetFields();
      setTimeout(() => {
        onClose?.();
        setSubmitMessage(null);
      }, 1500);
    } else {
      setSubmitMessage({ status: "error", message: "خطا در ثبت اطلاعات کاشت!" });
    }
    setLoading(false);
  };

  const handleClose = () => {
    form.resetFields();
    setSubmitMessage(null);
    onClose?.();
  };

  const handleSelectDisable = (fieldName: string) => {
    if (fieldName === "ZoneID" && !greenHousId && !isInEditing) return true;
    if (isInEditing && fieldName === "GreenhouseID") return true;
    return false;
  };

  return (
    <Modal
      open={open}
      onCancel={handleClose}
      footer={null}
      closeIcon={null}
      centered
      width={800}
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
      <div
        className={`relative px-6 py-6 bg-gradient-to-br border-b ${
          isInEditing
            ? "from-amber-50 via-orange-50/80 to-white border-amber-100"
            : "from-emerald-50 via-lime-50/80 to-white border-emerald-100"
        }`}
      >
        <button
          onClick={handleClose}
          className={`absolute top-5 left-5 h-9 w-9 rounded-xl bg-white border transition-all flex items-center justify-center shadow-sm hover:shadow ${
            isInEditing
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
                isInEditing
                  ? "from-amber-500 via-amber-600 to-orange-600"
                  : "from-emerald-500 via-emerald-600 to-emerald-700"
              }`}
            >
              {isInEditing ? <EditOutlined className="text-2xl" /> : <PlusOutlined className="text-2xl" />}
            </div>
            <div
              className={`absolute -bottom-1 -right-1 h-5 w-5 rounded-full border-2 border-white ${
                isInEditing ? "bg-orange-400" : "bg-lime-400"
              }`}
            ></div>
          </div>
          <div>
            <h3 className={`font-bold text-2xl ${isInEditing ? "text-amber-900" : "text-emerald-900"}`}>
              {isInEditing ? "ویرایش اطلاعات کاشت" : "افزودن اطلاعات کاشت جدید"}
            </h3>
            <p
              className={`text-sm mt-1 flex items-center gap-1.5 ${
                isInEditing ? "text-amber-600/80" : "text-emerald-600/80"
              }`}
            >
              <span
                className={`h-1.5 w-1.5 rounded-full animate-pulse ${isInEditing ? "bg-amber-400" : "bg-emerald-400"}`}
              ></span>
              {isInEditing ? "اطلاعات کاشت را ویرایش کنید" : "اطلاعات کاشت را با دقت وارد کنید"}
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
                {field.type === "select" ? (
                  <Select
                    options={field.options}
                    loading={field.loading}
                    showSearch
                    allowClear
                    optionFilterProp="label"
                    placeholder={field.placeholder}
                    disabled={loading || handleSelectDisable(field.name)}
                    size="large"
                    className="rounded-xl"
                    onChange={(value) => {
                      if (field.name === "GreenhouseID") setGreenHouseId(value);
                      setSubmitMessage(null);
                    }}
                  />
                ) : field.type === "number" ? (
                  <InputNumber
                    placeholder={field.placeholder}
                    disabled={loading}
                    size="large"
                    controls={false}
                    onChange={() => setSubmitMessage(null)}
                    className={`!w-full rounded-xl border-2 border-slate-200 transition-all shadow-sm hover:shadow ${
                      isInEditing
                        ? "hover:border-amber-300 focus:border-amber-400"
                        : "hover:border-emerald-300 focus:border-emerald-400"
                    }`}
                    style={{ width: "100%", height: "46px", fontSize: "14px" }}
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
                ) : (
                  <Input
                    placeholder={field.placeholder}
                    disabled={loading}
                    size="large"
                    onChange={() => setSubmitMessage(null)}
                    className={`rounded-xl border-2 border-slate-200 transition-all shadow-sm hover:shadow ${
                      isInEditing
                        ? "hover:border-amber-300 focus:border-amber-400"
                        : "hover:border-emerald-300 focus:border-emerald-400"
                    }`}
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
                isInEditing
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
                  ? isInEditing
                    ? "در حال ویرایش..."
                    : "در حال ثبت..."
                  : isInEditing
                  ? "ویرایش بستر کاشت"
                  : "افزودن بستر کاشت"
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
