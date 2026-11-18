import { loadFormOptions } from "@/shared/forms/load-options";
import {
  DatePicker,
  Form,
  FormActions,
  FormGrid,
  FormItem,
  Input,
  InputNumber,
  Select,
} from "@/shared/components/FormControls";
import {
  getGreenhouses,
  createGreenhouse,
  updateGreenhouse,
} from "@/features/greenhouses/actions";
import { greenhouseInputSchema } from "@/features/greenhouses/schema";
import type { GreenhouseRecord } from "@/features/greenhouses/types/record";
import { getLegacyPersonOptions } from "@/features/people/actions";
import Modal from "@/shared/components/FormModal";

import type { ActionMessage as ModalMsg } from "@/shared/contracts/action-result";
import { applyFieldErrors } from "@/shared/forms/field-errors";
import { submitForm } from "@/shared/forms/submit";
import useSavedForm from "@/shared/forms/useSavedForm";

import { useEffect, useState } from "react";

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
  const savedForm = useSavedForm();
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

  useEffect(() => {
    let cancelOptions: (() => void) | undefined;
    setMounted(true);
    if (modalOpen) {
      setModalMsg(null);
      cancelOptions = loadFormOptions(fetchOwners, setModalMsg, () =>
        setOwnersLoading(false),
      );
      if (record) {
        form.setFieldsValue({
          ...record,
          ConstructionDate: record.ConstructionDate ?? null,
        });
      } else {
        form.resetFields();
      }
    }
    return cancelOptions;
  }, [modalOpen, record, form]);

  const fetchOwners = async (isCurrent: () => boolean) => {
    setOwnersLoading(true);
    const owners = await getLegacyPersonOptions();
    if (isCurrent()) {
      setOwners(
        owners.map((owner) => ({
          value: owner.ID,
          label: owner.FirstName + " " + owner.LastName,
        })),
      );
    }
  };

  const greenHousefields = [
    {
      name: "GreenhouseName",
      label: "نام گلخانه",
      placeholder: "نام گلخانه را وارد کنید",
      required: true,
    },
    {
      name: "GreenhouseType",
      label: "نوع سازه",
      placeholder: "نوع سازه (مثلاً اسپانیایی)",
      required: false,
    },
    {
      name: "AreaSqM",
      label: "متراژ (متر مربع)",
      placeholder: "متراژ کل",
      required: false,
      type: "number",
    },
    {
      name: "ConstructionDate",
      label: "تاریخ احداث",
      placeholder: "تاریخ احداث",
      required: false,
      type: "date",
    },
    {
      name: "OwnerID",
      label: "نام مالک",
      placeholder: "انتخاب مالک",
      required: true,
      type: "select",
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
    },
    {
      name: "GreenhouseAddress",
      label: "آدرس",
      placeholder: "آدرس گلخانه را وارد کنید",
      required: true,
    },
  ];

  const handleSubmit = async (
    values: import("zod").input<typeof greenhouseInputSchema>,
  ) => {
    if (loading || savedForm.saved) return;
    await submitForm(
      async () => {
        setLoading(true);
        setModalMsg(null);

        const res = record
          ? await updateGreenhouse({ id: record.ID, data: values })
          : await createGreenhouse(values);
        applyFieldErrors(form, res);
        if (res.status === "ok") {
          await savedForm.complete(
            res.message,
            async () => setMainData(await getGreenhouses()),
            handleClose,
            setMainLoading,
          );
        } else {
          setModalMsg(res);
        }
      },
      (feedback) => setModalMsg(feedback),
      () => {
        setLoading(false);
      },
    );
  };

  const handleClose = () => {
    setModalOpen(false);
    form.resetFields();
    setModalMsg(null);
  };

  if (!mounted) return null;

  const renderField = (field: (typeof greenHousefields)[number]) => (
    <FormItem
      key={field.name}
      label={
        <span className="text-sm font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-2">
          {field.label}
          {field.required && <span className="text-rose-500 text-xs">*</span>}
        </span>
      }
      name={field.name}
      rules={[
        {
          required: field.required,
          message: `لطفاً ${field.label} را وارد کنید`,
        },
      ]}
      className={
        field.name === "GreenhouseAddress" ? "record-form-wide" : undefined
      }
    >
      {field.type === "select" ? (
        <Select
          showSearch
          placeholder={field.placeholder}
          options={field.name === "OwnerID" ? owners : field.options}
          optionFilterProp="label"
          loading={field.name === "OwnerID" ? ownersLoading : false}
          allowClear

          disabled={loading}
        />
      ) : field.type === "date" ? (
        <DatePicker placeholder={field.placeholder} disabled={loading} />
      ) : field.type === "number" ? (
        <InputNumber
          min={0}
          step={0.01}
          onChange={() => setModalMsg(null)}
          placeholder={field.placeholder}
          disabled={loading}
        />
      ) : (
        <Input
          onChange={() => setModalMsg(null)}
          placeholder={field.placeholder}
          disabled={loading}
        />
      )}
    </FormItem>
  );

  return (
    <Modal
      open={modalOpen}
      onClose={handleClose}
      busy={loading}
      savedForm={savedForm}
      forceRender
      heading={modalTitle}
      description={modalSubTitle}
      editing={isEdit}
    >
      <Form
        form={form}
        layout="vertical"
        onFinish={handleSubmit}
        requiredMark={false}
        actions={
          <FormActions
            message={modalMsg}
            onCancel={handleClose}
            loading={loading}
            editing={isEdit}
          />
        }
      >
        <FormGrid title="مشخصات گلخانه">
          {greenHousefields
            .filter((field) =>
              [
                "GreenhouseName",
                "GreenhouseType",
                "AreaSqM",
                "ConstructionDate",
                "OwnerID",
                "IsActive",
              ].includes(field.name),
            )
            .map(renderField)}
        </FormGrid>

        <FormGrid title="نشانی و توضیحات">
          {greenHousefields
            .filter((field) => field.name === "GreenhouseAddress")
            .map(renderField)}
          <FormItem className="record-form-wide" label="توضیحات" name="Notes">
            <Input.TextArea
              placeholder="توضیحات گلخانه"
              disabled={loading}
              rows={3}
            />
          </FormItem>
        </FormGrid>
      </Form>
    </Modal>
  );
}
