"use client";

import type { SeedPackageRecord } from "@/features/seed-packages/types/record";
import type { WarehouseRecord } from "@/features/warehouses/types/record";

import type { FormValues } from "@/shared/forms/types";
import type { z } from "zod";
import { seedWarehousingInputSchema } from "../schema";
import type { WarehouseTransactionDetails } from "../types/details";

import FormFeedback from "@/shared/components/FormFeedback";
import Modal from "@/shared/components/FormModal";
import { applyFieldErrors } from "@/shared/forms/field-errors";
import { submitForm } from "@/shared/forms/submit";

import {
  createSeedWarehousing,
  updateSeedWarehousing,
} from "@/features/seed-warehousing/actions";
import GreenhouseButton from "@/shared/components/GreenhouseButton";
import DatePicker from "@/shared/components/PersianDatePicker";
import {
  CloseOutlined,
  EditOutlined,
  ExperimentOutlined,
} from "@ant-design/icons";
import { Form, Input, InputNumber, Radio, Select } from "antd";
import { useEffect, useState } from "react";
import DateObject from "react-date-object";

interface SeedWarehousingFormModalProps {
  open: boolean;
  onCancel: () => void;
  data?: WarehouseTransactionDetails | null;
  seedPackages: SeedPackageRecord[];
  warehouses: WarehouseRecord[];
  onSuccess: () => void;
}

export default function SeedWarehousingFormModal({
  open,
  onCancel,
  data,
  seedPackages,
  warehouses,
  onSuccess,
}: SeedWarehousingFormModalProps) {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{
    status: "ok" | "error";
    message: string;
  } | null>(null);

  const isEdit = !!data;

  useEffect(() => {
    if (open) {
      if (data) {
        form.setFieldsValue({
          ...data,
          TransactionDate: data.TransactionDate
            ? new Date(data.TransactionDate)
            : null,
        });
      } else {
        form.resetFields();
      }
      setMessage(null);
    }
  }, [open, data, form]);

  const handleFinish = async (
    values: FormValues<z.infer<typeof seedWarehousingInputSchema>>,
  ) => {
    await submitForm(
      async () => {
        setLoading(true);
        setMessage(null);

        try {
          const payload = {
            ...values,
            TransactionDate:
              values.TransactionDate instanceof DateObject
                ? values.TransactionDate.toDate()
                : isEdit
                  ? values.TransactionDate
                  : new Date(),
            PackageQuantity: Number(values.PackageQuantity),
          };

          let result;
          if (isEdit) {
            result = await updateSeedWarehousing(data.ID, payload);
          } else {
            result = await createSeedWarehousing(payload);
          }

          applyFieldErrors(form, result);
          if (result.status === "ok") {
            setMessage({
              status: "ok",
              message: isEdit
                ? "تراکنش با موفقیت ویرایش شد"
                : "تراکنش با موفقیت ثبت شد",
            });
            setTimeout(() => {
              onSuccess();
              onCancel();
            }, 1000);
          } else {
            setMessage({
              status: "error",
              message: result.message || "خطای ناشناخته",
            });
          }
        } catch (error) {
          console.error("Form submit failed:", error);
          setMessage({ status: "error", message: "خطایی رخ داد" });
        } finally {
          setLoading(false);
        }
      },
      (feedback) => setMessage(feedback),
      () => {
        setLoading(false);
      },
    );
  };

  const handleClose = () => {
    onCancel();
    setMessage(null);
  };

  const inputStyleClass =
    "rounded-xl border-2 border-slate-200 hover:border-emerald-300 focus:border-emerald-400 transition-all shadow-sm hover:shadow w-full";
  const inputStyle = { height: "46px", fontSize: "14px" };

  const theme = isEdit
    ? {
        gradient:
          "from-emerald-50 via-lime-50/80 to-white dark:from-slate-900 dark:via-slate-800 dark:to-slate-900",
        iconBg: "from-blue-500 via-blue-600 to-blue-700",
        dotBg: "bg-blue-400",
        title: "ویرایش تراکنش",
        subtitle: "ویرایش اطلاعات تراکنش انبار",
      }
    : {
        gradient:
          "from-emerald-50 via-lime-50/80 to-white dark:from-emerald-950 dark:via-emerald-900/50 dark:to-slate-900",
        iconBg: "from-emerald-500 via-emerald-600 to-emerald-700",
        dotBg: "bg-lime-400",
        title: "ثبت تراکنش جدید",
        subtitle: "اطلاعات ورود و خروج بذر را وارد کنید",
      };

  return (
    <Modal
      open={open}
      onCancel={handleClose}
      destroyOnHidden
      width={800}
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
        className={`relative px-6 py-6 bg-gradient-to-br ${theme.gradient} border-b border-emerald-100 dark:border-slate-700`}
      >
        <button
          onClick={handleClose}
          className="absolute top-5 left-5 h-9 w-9 rounded-xl bg-white dark:bg-slate-800 hover:bg-emerald-50 dark:hover:bg-emerald-900/50 border border-emerald-200 dark:border-emerald-700/50 hover:border-emerald-300 transition-all flex items-center justify-center text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 shadow-sm hover:shadow"
          aria-label="بستن"
          type="button"
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
                <ExperimentOutlined className="text-2xl" />
              )}
            </div>
            <div
              className={`absolute -bottom-1 -right-1 h-5 w-5 rounded-full ${theme.dotBg} border-2 border-white dark:border-slate-800`}
            ></div>
          </div>
          <div>
            <h3 className="font-bold text-2xl text-emerald-900 dark:text-emerald-100">
              {theme.title}
            </h3>
            <p className="text-sm text-emerald-600/80 dark:text-emerald-400/80 mt-1 flex items-center gap-1.5">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
              {theme.subtitle}
            </p>
          </div>
        </div>
      </div>

      {/* Body */}
      <div className="px-6 py-6 bg-gradient-to-br from-white to-slate-50/30 dark:from-slate-900 dark:to-slate-950">
        <Form
          form={form}
          layout="vertical"
          onFinish={handleFinish}
          initialValues={{ TransactionType: true }}
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <Form.Item
              name="SeedPackageID"
              label={
                <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                  بسته بذر <span className="text-rose-500">*</span>
                </span>
              }
              rules={[
                { required: true, message: "لطفا بسته بذر را انتخاب کنید" },
              ]}
              className="mb-0"
            >
              <Select
                placeholder="انتخاب بسته بذر"
                showSearch
                optionFilterProp="label"
                size="large"
                className="w-full"
                style={{ height: "46px" }}
                options={seedPackages.map((pkg) => ({
                  label: `${pkg.SerialNumber} - ${pkg.PackageType}`,
                  value: pkg.ID,
                }))}
              />
            </Form.Item>

            <Form.Item
              name="WarehouseID"
              label={
                <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                  انبار <span className="text-rose-500">*</span>
                </span>
              }
              rules={[{ required: true, message: "لطفا انبار را انتخاب کنید" }]}
              className="mb-0"
            >
              <Select
                placeholder="انتخاب انبار"
                size="large"
                className="w-full"
                style={{ height: "46px" }}
                options={warehouses.map((wh) => ({
                  label: wh.WarehouseName,
                  value: wh.ID,
                }))}
              />
            </Form.Item>

            <Form.Item
              name="TransactionType"
              label={
                <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                  نوع تراکنش <span className="text-rose-500">*</span>
                </span>
              }
              rules={[
                { required: true, message: "لطفا نوع تراکنش را مشخص کنید" },
              ]}
              className="mb-0"
            >
              <Radio.Group className="w-full flex h-[46px]">
                <Radio.Button
                  value={true}
                  className="flex-1 text-center flex items-center justify-center h-full rounded-r-xl border-2 border-l-0 border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-500 dark:text-slate-400 hover:text-emerald-600 dark:hover:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 hover:border-emerald-200 dark:hover:border-emerald-700 transition-all [&.ant-radio-button-wrapper-checked]:bg-emerald-50 dark:[&.ant-radio-button-wrapper-checked]:bg-emerald-900/30 [&.ant-radio-button-wrapper-checked]:text-emerald-600 dark:[&.ant-radio-button-wrapper-checked]:text-emerald-400 [&.ant-radio-button-wrapper-checked]:border-emerald-500 dark:[&.ant-radio-button-wrapper-checked]:border-emerald-600 [&.ant-radio-button-wrapper-checked]:border-l-2 [&.ant-radio-button-wrapper-checked]:z-10 shadow-sm"
                >
                  ورودی
                </Radio.Button>
                <Radio.Button
                  value={false}
                  className="flex-1 text-center flex items-center justify-center h-full rounded-l-xl border-2 border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-500 dark:text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-900/20 hover:border-rose-200 dark:hover:border-rose-700 transition-all [&.ant-radio-button-wrapper-checked]:bg-rose-50 dark:[&.ant-radio-button-wrapper-checked]:bg-rose-900/30 [&.ant-radio-button-wrapper-checked]:text-rose-600 dark:[&.ant-radio-button-wrapper-checked]:text-rose-400 [&.ant-radio-button-wrapper-checked]:border-rose-500 dark:[&.ant-radio-button-wrapper-checked]:border-rose-600 [&.ant-radio-button-wrapper-checked]:z-10 shadow-sm"
                >
                  خروجی
                </Radio.Button>
              </Radio.Group>
            </Form.Item>

            <Form.Item
              name="PackageQuantity"
              label={
                <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                  تعداد بسته <span className="text-rose-500">*</span>
                </span>
              }
              rules={[{ required: true, message: "لطفا تعداد را وارد کنید" }]}
              className="mb-0"
            >
              <InputNumber
                className={`${inputStyleClass} dark:bg-slate-800 dark:border-slate-700 dark:text-white dark:placeholder-slate-500`}
                style={{ ...inputStyle, width: "100%", paddingTop: "4px" }}
                min={1}
                placeholder="تعداد"
                controls={false}
              />
            </Form.Item>

            <Form.Item
              name="TransactionDate"
              label={
                <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                  تاریخ تراکنش
                </span>
              }
              className="mb-0"
            >
              <DatePicker
                inputClass={`${inputStyleClass} !h-[46px] dark:bg-slate-800 dark:border-slate-700 dark:text-white`}
                containerClassName="w-full"
              />
            </Form.Item>

            <Form.Item
              name="DestinationType"
              label={
                <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                  مقصد/منبع
                </span>
              }
              className="mb-0"
            >
              <Input
                placeholder="مثال: کاشت در گلخانه ۱"
                size="large"
                className={`${inputStyleClass} dark:bg-slate-800 dark:border-slate-700 dark:text-white dark:placeholder-slate-500`}
                style={inputStyle}
              />
            </Form.Item>

            <Form.Item
              name="RecordedBy"
              label={
                <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                  ثبت کننده
                </span>
              }
              className="mb-0 sm:col-span-2"
            >
              <Input
                placeholder="نام شخص ثبت کننده"
                size="large"
                className={`${inputStyleClass} dark:bg-slate-800 dark:border-slate-700 dark:text-white dark:placeholder-slate-500`}
                style={inputStyle}
              />
            </Form.Item>
          </div>

          <FormFeedback message={message} />

          <div className="flex flex-col-reverse sm:flex-row justify-end gap-3 mt-8 pt-6 border-t-2 border-slate-200 dark:border-slate-700">
            <GreenhouseButton
              text="انصراف"
              variant="secondary"
              onClick={handleClose}
              disabled={loading}
              className="w-full sm:w-auto min-w-[140px] h-11"
              type="button"
            />
            <GreenhouseButton
              text={
                loading
                  ? isEdit
                    ? "در حال ذخیره..."
                    : "در حال ثبت..."
                  : isEdit
                    ? "ذخیره تغییرات"
                    : "ثبت تراکنش"
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
