import FormModalHeader from "@/shared/components/FormModalHeader";
import {
  getGreenhouses,
  createGreenhouse,
  updateGreenhouse,
} from "@/features/greenhouses/actions";
import { greenhouseInputSchema } from "@/features/greenhouses/schema";
import type { GreenhouseRecord } from "@/features/greenhouses/types/record";
import { getPeople } from "@/features/people/actions";
import { PeopleReadDTO } from "@/features/people/schema";
import type { PersonActionResponse } from "@/features/people/types";
import FormFeedback from "@/shared/components/FormFeedback";
import Modal from "@/shared/components/FormModal";
import GreenhouseButton from "@/shared/components/GreenhouseButton";
import DatePicker from "@/shared/components/PersianDatePicker";
import type { ActionMessage as ModalMsg } from "@/shared/contracts/action-result";
import { toDate } from "@/shared/forms/date-value";
import { applyFieldErrors } from "@/shared/forms/field-errors";
import { submitForm } from "@/shared/forms/submit";
import type { FormValues } from "@/shared/forms/types";
import { EditOutlined, HomeOutlined } from "@ant-design/icons";
import { Form, Input, Select } from "antd";
import { useEffect, useState } from "react";
import { z } from "zod";

export type SelectOptions = {
  value: number | string | boolean;
  label: string;
};

export default function GreenhouseFormModal({
  modalOpen,
  setModalOpen,
  setMainData,
  setMainLoading,
  record,
}: {
  modalOpen: boolean;
  setModalOpen: (open: boolean) => void;
  setMainData: (data: GreenhouseRecord[]) => void;
  setMainLoading: (loading: boolean) => void;
  record?: GreenhouseRecord | null;
}) {
  const [loading, setLoading] = useState(false);
  const [modalMsg, setModalMsg] = useState<ModalMsg | null>(null);
  const [owners, setOwners] = useState<SelectOptions[]>([]);
  const [ownersLoading, setOwnersLoading] = useState(false);
  const [form] = Form.useForm();
  const [mounted, setMounted] = useState(false);

  const isEdit = !!record;
  const modalTitle = isEdit ? "ویرایش اطلاعات گلخانه" : "افزودن گلخانه جدید";
  const modalSubTitle = isEdit
    ? "اطلاعات گلخانه را ویرایش کنید"
    : "اطلاعات گلخانه را وارد کنید";
  const icon = isEdit ? (
    <EditOutlined className="text-2xl" />
  ) : (
    <HomeOutlined className="text-2xl" />
  );

  const theme = isEdit
    ? {
        gradient:
          "from-amber-50 via-orange-50/80 to-white dark:from-slate-900 dark:via-slate-800 dark:to-slate-900",
        border: "border-amber-100 dark:border-slate-700",
        iconBg: "from-amber-500 via-amber-600 to-orange-600",
        iconDot: "bg-orange-400",
        textMain: "text-amber-900 dark:text-slate-100",
        textSub: "text-amber-600/80 dark:text-slate-400",
        fieldFocus: "focus:border-amber-400 dark:focus:border-amber-600",
        fieldHover: "hover:border-amber-300 dark:hover:border-amber-700",
        accent: "amber",
      }
    : {
        gradient:
          "from-emerald-50 via-lime-50/80 to-white dark:from-slate-900 dark:via-slate-800 dark:to-slate-900",
        border: "border-emerald-100 dark:border-slate-700",
        iconBg: "from-emerald-500 via-emerald-600 to-emerald-700",
        iconDot: "bg-lime-400",
        textMain: "text-emerald-900 dark:text-slate-100",
        textSub: "text-emerald-600/80 dark:text-slate-400",
        fieldFocus: "focus:border-emerald-400 dark:focus:border-emerald-600",
        fieldHover: "hover:border-emerald-300 dark:hover:border-emerald-700",
        accent: "emerald",
      };

  useEffect(() => {
    setMounted(true);
    if (modalOpen) {
      setModalMsg(null);
      fetchOwners();
      if (record) {
        form.setFieldsValue({
          ...record,
          ConstructionDate: record.ConstructionDate
            ? new Date(record.ConstructionDate)
            : null,
        });
      } else {
        form.resetFields();
      }
    }
  }, [modalOpen, record, form]);

  const fetchOwners = async () => {
    setOwnersLoading(true);
    const res: PersonActionResponse = await getPeople();
    if (res.status === "ok" && res.dta) {
      setOwners(
        res.dta.map((owner: PeopleReadDTO) => ({
          value: owner.ID,
          label: owner.FirstName + " " + owner.LastName,
        })),
      );
    }
    setOwnersLoading(false);
  };

  const greenHousefields = [
    {
      name: "GreenhouseName",
      label: "نام گلخانه",
      placeholder: "نام گلخانه را وارد کنید",
      required: true,
      icon: "🏡",
    },
    {
      name: "GreenhouseType",
      label: "نوع سازه",
      placeholder: "نوع سازه (مثلاً اسپانیایی)",
      required: false,
      icon: "🏗️",
    },
    {
      name: "AreaSqM",
      label: "متراژ (متر مربع)",
      placeholder: "متراژ کل",
      required: false,
      type: "number",
      icon: "📐",
    },
    {
      name: "ConstructionDate",
      label: "تاریخ احداث",
      placeholder: "تاریخ احداث",
      required: false,
      icon: "📅",
      type: "date",
    },
    {
      name: "OwnerID",
      label: "نام مالک",
      placeholder: "انتخاب مالک",
      required: true,
      type: "select",
      icon: "👤",
    },
    {
      name: "IsActive",
      label: "وضعیت",
      placeholder: "وضعیت را انتخاب کنید",
      required: true,
      type: "select",
      options: [
        { label: "فعال", value: true },
        { label: "غیرفعال", value: false },
      ],
      icon: "⚡",
    },
    {
      name: "GreenhouseAddress",
      label: "آدرس",
      placeholder: "آدرس گلخانه را وارد کنید",
      required: true,
      icon: "📍",
    },
  ];

  const handleSubmit = async (
    values: FormValues<import("zod").infer<typeof greenhouseInputSchema>>,
  ) => {
    await submitForm(
      async () => {
        setLoading(true);
        setModalMsg(null);

        const dataToSubmit = {
          ...values,
          ConstructionDate: values.ConstructionDate
            ? toDate(values.ConstructionDate)
            : null,
        };

        let res: { status: string; message?: string };

        if (isEdit && record) {
          res = await updateGreenhouse({ id: record.ID, data: dataToSubmit });
        } else {
          res = await createGreenhouse(
            dataToSubmit as z.infer<typeof greenhouseInputSchema>,
          );
        }

        setModalMsg({
          status: res.status as "ok" | "error",
          message: res.message || "",
        });

        applyFieldErrors(form, res);
        if (res.status === "ok") {
          setTimeout(async () => {
            handleClose();
          }, 1500);
        }
        setLoading(false);
      },
      (feedback) => setModalMsg(feedback),
      () => {
        setLoading(false);
        setMainLoading?.(false);
      },
    );
  };

  const handleClose = async () => {
    setModalOpen(false);
    setMainLoading(true);
    const newData = await getGreenhouses();
    setMainData(newData);
    setMainLoading(false);
    form.resetFields();
    setModalMsg(null);
  };

  if (!mounted) return null;

  return (
    <Modal
      open={modalOpen}
      onCancel={handleClose}
      width={680}
      className="!p-0"
      styles={{
        content: {
          padding: 0,
          borderRadius: "1.25rem",
          overflow: "hidden",
          boxShadow:
            "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
        },
      }}
      forceRender
    >
      {/* Header */}
      <FormModalHeader
        theme={theme}
        icon={icon}
        modalTitle={modalTitle}
        modalSubTitle={modalSubTitle}
        onClose={handleClose}
        padding="relative px-6 py-6"
      />

      {/* Body */}
      <div className="px-6 py-6 bg-gradient-to-br from-white to-slate-50/30 dark:from-slate-900 dark:to-slate-950 max-h-[70vh] overflow-y-auto">
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
          requiredMark={false}
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {greenHousefields.map((field) => (
              <Form.Item
                key={field.name}
                label={
                  <span className="text-sm font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-2">
                    <span className="text-base">{field.icon}</span>
                    {field.label}
                    {field.required && (
                      <span className="text-rose-500 text-xs">*</span>
                    )}
                  </span>
                }
                name={field.name}
                rules={[
                  {
                    required: field.required,
                    message: `لطفاً ${field.label} را وارد کنید`,
                  },
                ]}
                className={`mb-0 ${field.name === "GreenhouseAddress" || field.name === "GreenhouseName" ? "sm:col-span-2" : ""}`}
              >
                {field.type === "select" ? (
                  <Select
                    showSearch
                    placeholder={field.placeholder}
                    options={field.name === "OwnerID" ? owners : field.options}
                    optionFilterProp="label"
                    loading={field.name === "OwnerID" ? ownersLoading : false}
                    allowClear
                    size="large"
                    className="rounded-xl"
                    disabled={loading}
                  />
                ) : field.type === "date" ? (
                  <DatePicker
                    containerClassName="w-full"
                    inputClass={`w-full ant-input ant-input-lg rounded-xl border-2 border-slate-200 hover:border-${theme.accent}-300 focus:border-${theme.accent}-400 transition-all shadow-sm hover:shadow !h-[46px] !text-sm`}
                    placeholder={field.placeholder}
                    disabled={loading}
                  />
                ) : (
                  <Input
                    type={field.type || "text"}
                    onChange={() => setModalMsg(null)}
                    placeholder={field.placeholder}
                    disabled={loading}
                    size="large"
                    className={`rounded-xl border-2 border-slate-200 dark:border-slate-700 hover:border-${theme.accent}-300 dark:hover:border-${theme.accent}-700 focus:border-${theme.accent}-400 dark:focus:border-${theme.accent}-600 transition-all shadow-sm hover:shadow dark:bg-slate-800 dark:text-white dark:placeholder-slate-500`}
                    style={{ height: "46px", fontSize: "14px" }}
                  />
                )}
              </Form.Item>
            ))}
          </div>

          <Form.Item
            label={
              <span className="text-sm font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-2">
                <span>📝</span>توضیحات
              </span>
            }
            name="Notes"
            className="mt-5"
          >
            <Input.TextArea
              placeholder="توضیحات گلخانه"
              disabled={loading}
              rows={3}
              className={`rounded-xl border-2 border-slate-200 dark:border-slate-700 hover:border-${theme.accent}-300 dark:hover:border-${theme.accent}-700 focus:border-${theme.accent}-400 dark:focus:border-${theme.accent}-600 transition-all dark:bg-slate-800 dark:text-white`}
              style={{ resize: "none" }}
            />
          </Form.Item>

          <FormFeedback message={modalMsg} />

          <div className="flex justify-end mt-6">
            <GreenhouseButton
              text={
                loading
                  ? "در حال ثبت..."
                  : isEdit
                    ? "ویرایش گلخانه"
                    : "ثبت گلخانه"
              }
              variant="primary"
              type="submit"
              loading={loading}
              className="min-w-[160px] h-11 shadow-lg hover:shadow-xl"
            />
          </div>
        </Form>
      </div>
    </Modal>
  );
}
