import { validationOptions } from "@/shared/validation/input";
import {
  Form,
  FormActions,
  FormGrid,
  FormItem,
  Input,
  Radio,
  Select,
} from "@/shared/components/FormControls";
import {
  createPerson,
  getPeople,
  getLastPersonCode,
  getPersonsPosts,
  updatePerson,
} from "@/features/people/actions";
import Modal from "@/shared/components/FormModal";
import GreenhouseButton from "@/shared/components/GreenhouseButton";
import { applyFieldErrors } from "@/shared/forms/field-errors";
import { submitForm } from "@/shared/forms/submit";
import { UserAddOutlined } from "@ant-design/icons";

import { useEffect, useState } from "react";
import type { ZodType } from "zod";

import {
  commonPersonFields,
  legalPersonFields,
  LEGAL_PERSON_POST_ID,
  naturalPersonFields,
  type PersonInput,
  type PeopleReadDTO,
} from "../schema";

type PersonFormModalProps = {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  record?: PeopleReadDTO | null;
  setMainData: (data: PeopleReadDTO[]) => void;
  setMainLoading: (loading: boolean) => void;
};

export default function PersonFormModal({
  isOpen,
  setIsOpen,
  record,
  setMainData,
  setMainLoading,
}: PersonFormModalProps) {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{
    status: "ok" | "error";
    message: string;
  } | null>(null);
  const [posts, setPosts] = useState<{ ID: number; PostName: string | null }[]>(
    [],
  );
  const [postsLoading, setPostsLoading] = useState(false);
  const [codeLoading, setCodeLoading] = useState(false);
  const [form] = Form.useForm<PersonInput>();

  const isEdit = !!record;
  const isLegal = Form.useWatch("Legal", form) === true;
  const savedLegalCode = record?.Legal
    ? (record.NationalCode ?? "")
    : undefined;
  const validators: Partial<Record<keyof PersonInput, ZodType>> = {
    ...commonPersonFields,
    ...(isLegal ? legalPersonFields : naturalPersonFields),
  };

  const postOptions = posts
    .filter((post) => (post.ID === LEGAL_PERSON_POST_ID) === isLegal)
    .map((post) => ({ label: post.PostName || "بدون عنوان", value: post.ID }));

  type PersonField = {
    name: keyof PersonInput;
    label: string;
    required: boolean;
    placeholder: string;
    type?: "select";
    disabled?: boolean;
    section?: "company" | "contact";
  };

  const personCode: PersonField = {
    name: "PersonCode",
    label: isLegal ? "کد شخص حقوقی" : "کد شخص حقیقی",
    required: true,
    placeholder: "کد شخص را وارد کنید",
    disabled: true,
  };

  const fields: PersonField[] = [
    {
      name: "FirstName",
      label: "نام",
      required: !isLegal,
      disabled: isLegal,
      placeholder: "نام را وارد کنید",
    },
    {
      name: "LastName",
      label: "نام خانوادگی",
      required: !isLegal,
      disabled: isLegal,
      placeholder: "نام خانوادگی را وارد کنید",
    },
    {
      name: "NationalCode",
      label: "کد ملی (شناسه ملی)",
      required: true,
      placeholder: isLegal
        ? "شناسه ملی شرکت را وارد کنید"
        : "کد ملی را وارد کنید",
      section: isLegal ? "company" : undefined,
    },
    {
      name: "CompanyName",
      label: "نام شرکت",
      required: true,
      placeholder: "نام شرکت را وارد کنید",
      section: "company",
    },
    {
      name: "CompanyEconomicCode",
      label: "کد اقتصادی شرکت",
      required: false,
      placeholder: "کد اقتصادی را وارد کنید",
      section: "company",
    },
    {
      name: "CompanyRegistrationCode",
      label: "شماره ثبت شرکت",
      required: false,
      placeholder: "شماره ثبت را وارد کنید",
      section: "company",
    },
    {
      name: "PhoneNumber",
      label: "شماره تماس",
      required: true,
      placeholder: "09123456789",
      section: "contact",
    },
    {
      name: "EmailAddress",
      label: "ایمیل",
      required: false,
      placeholder: "ایمیل را وارد کنید",
      section: "contact",
    },
    {
      name: "PostID",
      label: "سمت",
      required: true,
      placeholder: "سمت را انتخاب کنید",
      type: "select",
      disabled: isLegal,
      section: isLegal ? "contact" : undefined,
    },
    {
      name: "Profession",
      label: "تخصص",
      required: false,
      placeholder: "تخصص را وارد کنید",
      section: "contact",
    },
  ];

  useEffect(() => {
    if (!isOpen) return;
    let cancelled = false;
    const fetchPosts = async () => {
      setPostsLoading(true);
      try {
        const res = await getPersonsPosts();
        if (!cancelled && res.status === "ok") setPosts(res.dta || []);
      } catch {
        if (!cancelled)
          setMessage({
            status: "error",
            message: "دریافت سمت‌ها انجام نشد. فرم را دوباره باز کنید.",
          });
      } finally {
        if (!cancelled) setPostsLoading(false);
      }
    };

    const fetchLastCode = async () => {
      setCodeLoading(true);
      try {
        const res = await getLastPersonCode();
        const nextCode = (Number.parseInt(res, 10) || 0) + 1;
        if (!cancelled) form.setFieldValue("PersonCode", String(nextCode));
      } catch {
        if (!cancelled)
          setMessage({
            status: "error",
            message: "دریافت کد شخص انجام نشد. فرم را دوباره باز کنید.",
          });
      } finally {
        if (!cancelled) setCodeLoading(false);
      }
    };

    void fetchPosts();
    if (!isEdit) void fetchLastCode();
    else setCodeLoading(false);
    return () => {
      cancelled = true;
    };
  }, [isOpen, isEdit, form]);

  useEffect(() => {
    if (isOpen) {
      if (record) {
        form.setFieldsValue({
          Legal: record.Legal === true,
          FirstName: record.FirstName ?? "",
          LastName: record.LastName ?? "",
          NationalCode: record.NationalCode ?? "",
          EmailAddress: record.EmailAddress ?? "",
          PhoneNumber: record.PhoneNumber ?? "",
          PersonCode: record.PersonCode ?? "",
          Profession: record.Profession ?? "",
          PostID: record.Legal
            ? LEGAL_PERSON_POST_ID
            : (record.PostID ?? undefined),
          CompanyName: record.CompanyName ?? "",
          CompanyEconomicCode: record.CompanyEconomicCode ?? "",
          CompanyRegistrationCode: record.CompanyRegistrationCode ?? "",
        });
      } else {
        form.resetFields();
      }
      setMessage(null);
    }
  }, [isOpen, record, form]);

  const handleSubmit = async (values: PersonInput) => {
    await submitForm(
      async () => {
        setMessage(null);
        setLoading(true);

        try {
          const result =
            isEdit && record
              ? await updatePerson({
                  id: record.ID,
                  data: {
                    ...values,
                    NationalCode:
                      values.Legal && values.NationalCode === savedLegalCode
                        ? undefined
                        : values.NationalCode,
                  },
                })
              : await createPerson(values);
          applyFieldErrors(form, result);
          if (result.status === "error") {
            setMessage({ status: "error", message: result.message });
            return;
          }

          setMessage({ status: "ok", message: result.message });
          setMainLoading(true);
          try {
            const mainData = await getPeople();
            if (mainData.status !== "ok") throw new Error("Refresh failed");
            setMainData(mainData.dta || []);
          } catch {
            setMessage({
              status: "ok",
              message:
                "اطلاعات ذخیره شد؛ برای دیدن فهرست به‌روز، صفحه را تازه کنید.",
            });
          } finally {
            setMainLoading(false);
          }

          if (!isEdit) form.resetFields();

          setTimeout(() => {
            setIsOpen(false);
            setMessage(null);
          }, 1500);
        } catch {
          setMessage({
            status: "error",
            message: "ارتباط با سرور انجام نشد. لطفاً دوباره تلاش کنید.",
          });
        } finally {
          setLoading(false);
        }
      },
      (feedback) => setMessage(feedback),
      () => {
        setLoading(false);
        setMainLoading?.(false);
      },
    );
  };

  const handleClose = () => {
    setIsOpen(false);
    setMessage(null);
    form.resetFields();
  };

  const renderField = (field: PersonField) => (
    <FormItem
      key={field.name}
      label={
        <span className="text-xs font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1.5 ">
          {field.label}
          {field.required && (
            <span className="text-rose-500 text-[10px]">*</span>
          )}
        </span>
      }
      name={field.name}
      rules={
        field.disabled
          ? []
          : [
              {
                validator: async (_, value: unknown) => {
                  if (
                    field.name === "NationalCode" &&
                    isLegal &&
                    savedLegalCode !== undefined &&
                    value === savedLegalCode
                  )
                    return;
                  const result = validators[field.name]?.safeParse(
                    value,
                    validationOptions,
                  );
                  if (result && !result.success)
                    throw new Error(result.error.issues[0].message);
                },
              },
            ]
      }
    >
      {field.type === "select" ? (
        <Select
          loading={postsLoading}
          placeholder={field.placeholder}
          disabled={loading || field.disabled}
          options={postOptions}
        />
      ) : (
        <Input
          onChange={() => setMessage(null)}
          placeholder={field.placeholder}
          disabled={loading || field.disabled}
        />
      )}
    </FormItem>
  );

  return (
    <Modal
      open={isOpen}
      onClose={handleClose}
      heading={isEdit ? "ویرایش اطلاعات شخص" : "افزودن شخص جدید"}
      description={
        isEdit ? "اطلاعات شخص را ویرایش کنید" : "اطلاعات شخص را وارد کنید"
      }
      icon={<UserAddOutlined />}
      editing={isEdit}
    >
      <Form
        form={form}
        layout="vertical"
        onFinish={handleSubmit}
        initialValues={{ Legal: false }}
        onValuesChange={(changed: Partial<PersonInput>) => {
          if (changed.Legal === undefined) return;
          form.setFieldValue(
            "PostID",
            changed.Legal ? LEGAL_PERSON_POST_ID : undefined,
          );
          form.setFields(
            (["FirstName", "LastName", "NationalCode"] as const).map(
              (name) => ({
                name,
                errors: [],
              }),
            ),
          );
        }}
        requiredMark={false}
      >
        <FormGrid title="اطلاعات هویتی">
          <FormItem label="نوع شخص" name="Legal">
            <Radio.Group disabled={loading}>
              <Radio value={false}>حقیقی</Radio>
              <Radio value={true}>حقوقی</Radio>
            </Radio.Group>
          </FormItem>
          {renderField(personCode)}
          {fields.filter((field) => !field.section).map(renderField)}
        </FormGrid>

        {isLegal && (
          <FormGrid title="اطلاعات ثبتی شرکت">
            {fields
              .filter((field) => field.section === "company")
              .map(renderField)}
          </FormGrid>
        )}
        <FormGrid title="اطلاعات تماس و تخصص" columns={isLegal ? 2 : 3}>
          {fields
            .filter((field) => field.section === "contact")
            .map(renderField)}
        </FormGrid>

        <FormActions message={message}>
          <GreenhouseButton
            text="انصراف"
            variant="secondary"
            onClick={handleClose}
            disabled={loading}
          />
          <GreenhouseButton
            text={loading ? "..." : isEdit ? "ویرایش" : "ثبت"}
            variant="primary"
            type="submit"
            loading={loading}
            disabled={codeLoading || postsLoading}
          />
        </FormActions>
      </Form>
    </Modal>
  );
}
