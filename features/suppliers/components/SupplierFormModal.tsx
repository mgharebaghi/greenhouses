import {
  Form,
  FormActions,
  FormGrid,
  FormItem,
  Input,
  Select,
} from "@/shared/components/FormControls";
import {
  createSupplier,
  getSupplierPeople,
  getSuppliers,
  updateSupplier,
} from "@/features/suppliers/actions";
import Modal from "@/shared/components/FormModal";
import { applyFieldErrors } from "@/shared/forms/field-errors";
import { loadFormOptions } from "@/shared/forms/load-options";
import { submitForm } from "@/shared/forms/submit";
import useSavedForm from "@/shared/forms/useSavedForm";
import { validationOptions } from "@/shared/validation/input";

import { useEffect, useState } from "react";
import { supplierName } from "../domain/name";
import { supplierFieldsSchema, type SupplierInput } from "../schema";
import type { SupplierDTO, SupplierPersonOption } from "../types";

type SupplierFormModalProps = {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  record?: SupplierDTO | null;
  setMainData: (data: SupplierDTO[]) => void;
  setMainLoading: (loading: boolean) => void;
};

export default function SupplierFormModal({
  isOpen,
  setIsOpen,
  record,
  setMainData,
  setMainLoading,
}: SupplierFormModalProps) {
  const savedForm = useSavedForm();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{
    status: "ok" | "error";
    message: string;
  } | null>(null);
  const [form] = Form.useForm<SupplierInput>();
  const [people, setPeople] = useState<SupplierPersonOption[]>([]);
  const [peopleLoading, setPeopleLoading] = useState(false);
  const personId = Form.useWatch("People_CompaniesID", form);
  const selectedPerson = people.find((person) => person.ID === personId);
  const originalPerson =
    record && record.People_CompaniesID === personId ? record : null;
  const person = selectedPerson ?? originalPerson;
  const isLegal = person?.Legal === true;

  const isEdit = !!record;

  const fields = [
    {
      name: "CompanyName",
      label: "نام شرکت",
      required: false,
      placeholder: "شرکت...",
    },
    {
      name: "BrandName",
      label: "نام برند",
      required: false,
      placeholder: "برند...",
    },
    // Row 3: Phone + Email
    {
      name: "ContactTel",
      label: "تلفن",
      required: true,
      placeholder: "0912...",
    },
    {
      name: "ContactEmail",
      label: "ایمیل",
      required: false,
      placeholder: "email@...",
    },
    // Row 4: Country + City + License
    {
      name: "SupplierCountry",
      label: "کشور",
      required: false,
      placeholder: "کشور...",
    },
    {
      name: "SupplierCity",
      label: "شهر",
      required: false,
      placeholder: "شهر...",
    },
    {
      name: "LicenseNumber",
      label: "شماره مجوز",
      required: false,
      placeholder: "مجوز...",
    },
    {
      name: "CompanyAddress",
      label: "آدرس",
      required: false,
      placeholder: "آدرس کامل...",
      textArea: true,
    },
  ] satisfies Array<{
    name: keyof SupplierInput;
    label: string;
    required: boolean;
    placeholder: string;
    textArea?: boolean;
  }>;

  useEffect(() => {
    if (!isOpen) return;
    form.resetFields();
    if (record) {
      form.setFieldsValue({
        People_CompaniesID: record.People_CompaniesID ?? undefined,
        CompanyName: record.CompanyName,
        BrandName: record.BrandName,
        SupplierCountry: record.SupplierCountry,
        SupplierCity: record.SupplierCity,
        FirstName: record.Legal ? record.FirstName : null,
        LastName: record.Legal ? record.LastName : null,
        ContactEmail: record.ContactEmail,
        ContactTel: record.ContactTel ?? "",
        CompanyAddress: record.CompanyAddress,
        LicenseNumber: record.LicenseNumber,
      });
    }
    setMessage(null);
    setPeopleLoading(true);
    return loadFormOptions(
      async (isCurrent) => {
        const options = await getSupplierPeople();
        if (isCurrent()) setPeople(options);
      },
      setMessage,
      () => setPeopleLoading(false),
    );
  }, [isOpen, record, form]);

  const handleSubmit = async (values: SupplierInput) => {
    if (loading || savedForm.saved) return;
    await submitForm(
      async () => {
        setMessage(null);
        setLoading(true);

        let result;
        if (isEdit && record) {
          result = await updateSupplier({ id: record.ID, data: values });
        } else {
          result = await createSupplier(values);
        }

        applyFieldErrors(form, result);
        if (result.status === "ok") {
          await savedForm.complete(
            result.message,
            async () => setMainData(await getSuppliers()),
            handleClose,
            setMainLoading,
          );
        } else {
          setMessage({
            status: "error",
            message: result.message,
          });
        }
      },
      (feedback) => setMessage(feedback),
      () => {
        setLoading(false);
      },
    );
  };

  const handleClose = () => {
    setIsOpen(false);
    setMessage(null);
    form.resetFields();
  };

  // Theme configuration based on mode

  const renderField = (field: (typeof fields)[number]) => (
    <FormItem
      key={field.name}
      label={
        <span className="text-xs font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1.5 mb-1">
          {field.label}
          {field.required && (
            <span className="text-rose-500 text-[10px]">*</span>
          )}
        </span>
      }
      name={field.name}
      className={field.textArea ? "record-form-wide" : undefined}
      rules={[
        {
          validator: async (_, value: unknown) => {
            const checked = supplierFieldsSchema.shape[field.name].safeParse(
              value,
              validationOptions,
            );
            if (!checked.success)
              throw new Error(checked.error.issues[0].message);
          },
        },
      ]}
    >
      {field.textArea ? (
        <Input.TextArea
          placeholder={field.placeholder}
          disabled={loading}
          rows={2}
        />
      ) : (
        <Input
          placeholder={field.placeholder}
          disabled={loading}
          type={field.name === "ContactTel" ? "tel" : "text"}
          dir={field.name === "ContactTel" ? "ltr" : undefined}
          className={field.name === "ContactTel" ? "text-right" : undefined}
        />
      )}
    </FormItem>
  );

  return (
    <Modal
      open={isOpen}
      onClose={handleClose}
      busy={loading}
      savedForm={savedForm}
      heading={isEdit ? "ویرایش تامین‌کننده" : "افزودن تامین‌کننده جدید"}
      description={
        isEdit
          ? "اطلاعات تامین‌کننده را ویرایش کنید"
          : "اطلاعات تامین‌کننده را با دقت وارد کنید"
      }
      editing={isEdit}
    >
      <Form
        form={form}
        layout="vertical"
        onFinish={handleSubmit}
        onValuesChange={(changed) => {
          setMessage(null);
          if ("People_CompaniesID" in changed)
            form.setFields([
              { name: "FirstName", value: null, errors: [] },
              { name: "LastName", value: null, errors: [] },
            ]);
        }}
        requiredMark={false}
        actions={
          <FormActions
            message={message}
            onCancel={handleClose}
            loading={loading}
            editing={isEdit}
            submitDisabled={peopleLoading}
          />
        }
      >
        <FormGrid title="شخص مرتبط">
          <FormItem
            name="People_CompaniesID"
            label="شخص حقیقی یا حقوقی *"
            className="record-form-wide"
            rules={[
              { required: true, message: "شخص را از فهرست انتخاب کنید." },
            ]}
          >
            <Select
              showSearch
              optionFilterProp="label"
              placeholder="جست‌وجوی نام یا کد شخص"
              loading={peopleLoading}
              disabled={loading || peopleLoading}
              options={people.map((option) => ({
                value: option.ID,
                label: [
                  supplierName({ ...option, Legal: option.Legal === true }),
                  option.Legal ? "حقوقی" : "حقیقی",
                  option.PersonCode || `شناسه ${option.ID}`,
                ].join(" · "),
              }))}
            />
          </FormItem>
          {person &&
            (["FirstName", "LastName"] as const).map((name) => {
              const label = name === "FirstName" ? "نام" : "نام خانوادگی";
              return isLegal ? (
                <FormItem
                  key={`ceo-${name}`}
                  name={name}
                  label={`${label} مدیرعامل`}
                  preserve={false}
                >
                  <Input disabled={loading} maxLength={150} />
                </FormItem>
              ) : (
                <FormItem key={name} label={label}>
                  <Input value={person[name] ?? ""} disabled />
                </FormItem>
              );
            })}
        </FormGrid>

        <FormGrid title="اطلاعات بازرگانی" columns={3}>
          {fields
            .filter((field) =>
              ["CompanyName", "BrandName", "LicenseNumber"].includes(
                field.name,
              ),
            )
            .map(renderField)}
        </FormGrid>

        <FormGrid title="تماس و نشانی">
          {fields
            .filter(
              (field) =>
                !["CompanyName", "BrandName", "LicenseNumber"].includes(
                  field.name,
                ),
            )
            .map(renderField)}
        </FormGrid>
      </Form>
    </Modal>
  );
}
