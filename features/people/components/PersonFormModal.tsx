import {
  createPerson,
  getPeople,
  getLastPersonCode,
  getPersonsPosts,
  updatePerson,
} from "@/features/people/actions";
import FormFeedback from "@/shared/components/FormFeedback";
import Modal from "@/shared/components/FormModal";
import GreenhouseButton from "@/shared/components/GreenhouseButton";
import { applyFieldErrors } from "@/shared/forms/field-errors";
import { submitForm } from "@/shared/forms/submit";
import {
  CloseOutlined,
  EditOutlined,
  UserAddOutlined,
} from "@ant-design/icons";
import { Form, Input, Select } from "antd";
import { useEffect, useState } from "react";

import {
  personInputSchema,
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

  const fields: {
    name: keyof PersonInput;
    label: string;
    required: boolean;
    placeholder: string;
    icon: string;
    colSpan: number;
    type?: string;
    disabled?: boolean;
  }[] = [
    {
      name: "FirstName",
      label: "نام",
      required: true,
      placeholder: "نام را وارد کنید",
      icon: "👤",
      colSpan: 1,
    },
    {
      name: "LastName",
      label: "نام خانوادگی",
      required: true,
      placeholder: "نام خانوادگی را وارد کنید",
      icon: "👥",
      colSpan: 1,
    },
    {
      name: "NationalCode",
      label: "کد ملی",
      required: true,
      placeholder: "کد ملی را وارد کنید",
      icon: "👤",
      colSpan: 1,
    },
    {
      name: "EmailAddress",
      label: "ایمیل",
      required: true,
      placeholder: "ایمیل را وارد کنید",
      icon: "📧",
      colSpan: 1,
    },
    {
      name: "PhoneNumber",
      label: "شماره تماس",
      required: true,
      placeholder: "09123456789",
      icon: "📱",
      colSpan: 2,
    },
    {
      name: "PostID",
      label: "سمت",
      required: true,
      placeholder: "سمت را انتخاب کنید",
      icon: "💼",
      colSpan: 2,
      type: "select",
    },
    {
      name: "PersonCode",
      label: "کد شخص",
      required: true,
      placeholder: "کد شخص را وارد کنید",
      icon: "💼",
      colSpan: 2,
      type: "input",
      disabled: true,
    },
    {
      name: "Profesion",
      label: "تخصص",
      required: true,
      placeholder: "تخصص را وارد کنید",
      icon: "💼",
      colSpan: 2,
      type: "input",
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
          FirstName: record.FirstName ?? "",
          LastName: record.LastName ?? "",
          NationalCode: record.NationalCode ?? "",
          EmailAddress: record.EmailAddress ?? "",
          PhoneNumber: record.PhoneNumber ?? "",
          PersonCode: record.PersonCode ?? "",
          Profesion: record.Profesion ?? "",
          PostID: record.Tbl_PeoplePosts?.ID,
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
              ? await updatePerson({ id: record.ID, data: values })
              : await createPerson(values);
          applyFieldErrors(form, result);
          if (result.status === "error") {
            if (result.fieldErrors) {
              form.setFields(
                fields.map(({ name }) => ({
                  name,
                  errors: result.fieldErrors?.[name] ?? [],
                })),
              );
            }
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

  return (
    <Modal
      open={isOpen}
      onCancel={handleClose}
      width={600}
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
    >
      {/* Header */}
      <div
        className={`relative px-6 py-5 bg-gradient-to-br ${theme.gradient} border-b ${theme.border}`}
      >
        <button
          onClick={handleClose}
          className={`absolute top-5 left-5 h-9 w-9 rounded-xl bg-white dark:bg-slate-800 hover:bg-${theme.accent}-50 dark:hover:bg-${theme.accent}-900/20 border border-${theme.accent}-200 dark:border-slate-600 hover:border-${theme.accent}-300 dark:hover:border-${theme.accent}-700 transition-all flex items-center justify-center text-${theme.accent}-600 dark:text-${theme.accent}-500 hover:text-${theme.accent}-700 shadow-sm hover:shadow`}
          aria-label="بستن"
        >
          <CloseOutlined className="text-sm" />
        </button>

        <div className="flex items-center gap-4">
          <div className="relative">
            <div
              className={`h-14 w-14 rounded-2xl bg-gradient-to-br ${theme.iconBg} shadow-lg flex items-center justify-center text-white`}
            >
              {isEdit ? (
                <EditOutlined className="text-2xl" />
              ) : (
                <UserAddOutlined className="text-2xl" />
              )}
            </div>
            <div
              className={`absolute -bottom-1 -right-1 h-5 w-5 rounded-full ${theme.iconDot} border-2 border-white dark:border-slate-800`}
            ></div>
          </div>
          <div>
            <h3 className={`font-bold text-2xl ${theme.textMain}`}>
              {isEdit ? "ویرایش اطلاعات مالک" : "افزودن مالک جدید"}
            </h3>
            <p
              className={`text-sm ${theme.textSub} mt-1 flex items-center gap-1.5`}
            >
              <span
                className={`h-1.5 w-1.5 rounded-full bg-${theme.accent}-400 animate-pulse`}
              ></span>
              {isEdit
                ? "اطلاعات مالک را ویرایش کنید"
                : "اطلاعات مالک را با دقت وارد کنید"}
            </p>
          </div>
        </div>
      </div>

      {/* Body */}
      <div className="px-6 py-6 bg-gradient-to-br from-white to-slate-50/30 dark:from-slate-900 dark:to-slate-950">
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
          requiredMark={false}
        >
          <div className="grid grid-cols-2 gap-x-4 gap-y-2">
            {fields.map((field) => (
              <Form.Item
                key={field.name}
                label={
                  <span className="text-xs font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1.5 mb-1">
                    {field.icon && (
                      <span className="text-sm opacity-80">{field.icon}</span>
                    )}
                    {field.label}
                    {field.required && (
                      <span className="text-rose-500 text-[10px]">*</span>
                    )}
                  </span>
                }
                name={field.name}
                rules={[
                  {
                    validator: async (_, value: unknown) => {
                      if (
                        value === undefined ||
                        value === null ||
                        value === ""
                      ) {
                        throw new Error(`لطفاً ${field.label} را وارد کنید`);
                      }
                      const result =
                        personInputSchema.shape[field.name].safeParse(value);
                      if (!result.success)
                        throw new Error(result.error.issues[0].message);
                    },
                  },
                ]}
                className={`mb-1 ${field.colSpan === 2 ? "col-span-2" : "col-span-2 sm:col-span-1"}`}
              >
                {field.type === "select" ? (
                  <Select
                    loading={postsLoading}
                    placeholder={field.placeholder}
                    className={`w-full rounded-xl transition-all shadow-sm hover:shadow h-10 text-sm`}
                    popupClassName="rounded-xl overflow-hidden"
                    options={posts.map((post) => ({
                      label: post.PostName || "بدون عنوان",
                      value: post.ID,
                    }))}
                    dropdownStyle={{ borderRadius: "0.75rem" }}
                  />
                ) : (
                  <Input
                    onChange={() => setMessage(null)}
                    placeholder={field.placeholder}
                    disabled={loading || field.disabled}
                    className={`rounded-xl border-2 border-slate-200 dark:border-slate-700 ${theme.fieldHover} ${theme.fieldFocus} transition-all shadow-sm hover:shadow dark:bg-slate-800 dark:text-white dark:placeholder-slate-500 h-10 text-sm`}
                  />
                )}
              </Form.Item>
            ))}
          </div>

          <FormFeedback message={message} />

          <div className="flex flex-col-reverse sm:flex-row justify-end gap-3 mt-6 pt-5 border-t border-slate-100 dark:border-slate-800">
            <GreenhouseButton
              text="انصراف"
              variant="secondary"
              onClick={handleClose}
              disabled={loading}
              className="w-full sm:w-auto min-w-[100px] h-10 text-sm"
            />
            <GreenhouseButton
              text={loading ? "..." : isEdit ? "ویرایش" : "ثبت"}
              variant="primary"
              type="submit"
              loading={loading}
              disabled={codeLoading || postsLoading}
              className="w-full sm:w-auto min-w-[100px] h-10 shadow-md hover:shadow-lg text-sm"
            />
          </div>
        </Form>
      </div>
    </Modal>
  );
}
