"use client";

import {
  DatePicker,
  Form,
  FormActions,
  FormGrid,
  FormItem,
  Input,
  InputNumber,
  Radio,
  Select,
} from "@/shared/components/FormControls";

import SeedPackageSelect from "@/features/seed-packages/components/SeedPackageSelect";
import type { SeedPackageDetails } from "@/features/seed-packages/types/details";
import type { WarehouseRecord } from "@/features/warehouses/types/record";

import type { z } from "zod";
import { seedWarehousingInputSchema } from "../schema";
import type { WarehouseTransactionDetails } from "../types/details";

import Modal from "@/shared/components/FormModal";
import { applyFieldErrors } from "@/shared/forms/field-errors";
import { submitForm } from "@/shared/forms/submit";

import {
  createSeedWarehousing,
  updateSeedWarehousing,
} from "@/features/seed-warehousing/actions";
import GreenhouseButton from "@/shared/components/GreenhouseButton";

import { ExperimentOutlined } from "@ant-design/icons";

import { useEffect, useState } from "react";

interface SeedWarehousingFormModalProps {
  open: boolean;
  onCancel: () => void;
  data?: WarehouseTransactionDetails | null;
  seedPackages: SeedPackageDetails[];
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
  const savedPackage = data?.Tbl_SeedPackage;
  const packageChoices =
    savedPackage && !seedPackages.some((pkg) => pkg.ID === savedPackage.ID)
      ? [...seedPackages, savedPackage]
      : seedPackages;

  useEffect(() => {
    if (open) {
      if (data) {
        form.setFieldsValue({
          ...data,
          TransactionDate: data.TransactionDate ?? null,
        });
      } else {
        form.resetFields();
      }
      setMessage(null);
    }
  }, [open, data, form]);

  const handleFinish = async (
    values: z.input<typeof seedWarehousingInputSchema>,
  ) => {
    await submitForm(
      async () => {
        setLoading(true);
        setMessage(null);

        let result;
        if (isEdit) {
          result = await updateSeedWarehousing(data.ID, values);
        } else {
          result = await createSeedWarehousing(values);
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

  return (
    <Modal
      open={open}
      onClose={handleClose}
      destroyOnHidden
      heading={isEdit ? "ویرایش تراکنش" : "ثبت تراکنش جدید"}
      description={
        isEdit
          ? "ویرایش اطلاعات تراکنش انبار"
          : "اطلاعات ورود و خروج بذر را وارد کنید"
      }
      icon={<ExperimentOutlined />}
      editing={isEdit}
    >
      <Form
        form={form}
        layout="vertical"
        onFinish={handleFinish}
        initialValues={{ TransactionType: true }}
      >
        <FormGrid title="بسته و انبار">
          <FormItem
            name="SeedPackageID"
            label={
              <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                بسته بذر <span className="text-rose-500">*</span>
              </span>
            }
            rules={[
              { required: true, message: "لطفا بسته بذر را انتخاب کنید" },
            ]}
          >
            <SeedPackageSelect packages={packageChoices} />
          </FormItem>

          <FormItem
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

              options={warehouses.map((wh) => ({
                label: wh.WarehouseName,
                value: wh.ID,
              }))}
            />
          </FormItem>
        </FormGrid>

        <FormGrid title="جزئیات تراکنش">
          <FormItem
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
            <Radio.Group>
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
          </FormItem>

          <FormItem
            name="PackageQuantity"
            label={
              <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                تعداد بسته <span className="text-rose-500">*</span>
              </span>
            }
            rules={[{ required: true, message: "لطفا تعداد را وارد کنید" }]}
            className="mb-0"
          >
            <InputNumber min={0} placeholder="تعداد" controls={false} />
          </FormItem>

          <FormItem
            name="TransactionDate"
            label={
              <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                تاریخ تراکنش
              </span>
            }
            className="mb-0"
          >
            <DatePicker kind="timestamp" />
          </FormItem>

          <FormItem
            name="DestinationType"
            label={
              <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                مقصد/منبع
              </span>
            }
            className="mb-0"
          >
            <Input placeholder="مثال: کاشت در گلخانه ۱" />
          </FormItem>

          <FormItem
            name="RecordedBy"
            label={
              <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                ثبت کننده
              </span>
            }
            className="mb-0"
          >
            <Input placeholder="نام شخص ثبت کننده" />
          </FormItem>
        </FormGrid>

        <FormActions message={message}>
          <GreenhouseButton
            text="انصراف"
            variant="secondary"
            onClick={handleClose}
            disabled={loading}

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
          />
        </FormActions>
      </Form>
    </Modal>
  );
}
