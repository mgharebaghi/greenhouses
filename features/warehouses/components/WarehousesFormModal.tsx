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
  createWarehouse,
  getWarehouseManagerOptions,
  updateWarehouse,
} from "@/features/warehouses/actions";
import Modal from "@/shared/components/FormModal";
import { applyFieldErrors } from "@/shared/forms/field-errors";
import { loadFormOptions } from "@/shared/forms/load-options";
import { submitForm, type RefreshFormList } from "@/shared/forms/submit";
import useSavedForm from "@/shared/forms/useSavedForm";

import { useEffect, useState } from "react";
import type { z } from "zod";
import { warehouseInputSchema } from "../schema";
import type { WarehouseRecord } from "../types/record";

interface WarehousesInsUpModalProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  data?: WarehouseRecord | null; // If data is provided, it's edit mode
  refreshData: RefreshFormList;
}

export default function WarehousesInsUpModal({
  open,
  setOpen,
  data,
  refreshData,
}: WarehousesInsUpModalProps) {
  const [form] = Form.useForm();
  const savedForm = useSavedForm();
  const [internalLoading, setInternalLoading] = useState(false);
  const [managers, setManagers] = useState<
    Awaited<ReturnType<typeof getWarehouseManagerOptions>>
  >([]);
  const [managersLoading, setManagersLoading] = useState(false);
  const [message, setMessage] = useState<{
    status: "ok" | "error";
    message: string;
  } | null>(null);

  const isEditMode = !!data;

  useEffect(() => {
    if (open) {
      setMessage(null);
      form.resetFields();
      if (isEditMode && data) {
        form.setFieldsValue({
          WarehouseCode: data.WarehouseCode,
          WarehouseName: data.WarehouseName,
          WarehouseLocation: data.WarehouseLocation,
          TemperatureRange: data.TemperatureRange,
          HumidityRange: data.HumidityRange,
          Capacity: data.Capacity,
          WarehouseCreatedAt: data.WarehouseCreatedAt ?? null,
        });
      }
      setManagers([]);
      setManagersLoading(true);
      return loadFormOptions(
        async (isCurrent) => {
          const options = await getWarehouseManagerOptions();
          if (!isCurrent()) return;
          setManagers(options);
          const matches = options.filter(
            (option) => option.name === data?.WarehouseManagerName?.trim(),
          );
          if (matches.length === 1)
            form.setFieldValue("WarehouseManagerID", matches[0].value);
        },
        setMessage,
        () => setManagersLoading(false),
      );
    }
  }, [open, data, isEditMode, form]);

  const handleFinish = async (values: z.input<typeof warehouseInputSchema>) => {
    if (internalLoading || savedForm.saved) return;
    await submitForm(
      async () => {
        setInternalLoading(true);
        setMessage(null);

        let res;
        if (isEditMode && data?.ID) {
          res = await updateWarehouse(data.ID, values);
        } else {
          res = await createWarehouse(values);
        }

        applyFieldErrors(form, res);
        if (res.status === "ok") {
          await savedForm.complete(res.message, refreshData, handleClose);
        } else {
          setMessage({ status: "error", message: res.message });
        }
      },
      (feedback) => setMessage(feedback),
      () => {
        setInternalLoading(false);
      },
    );
  };

  const handleClose = () => {
    setOpen(false);
    setMessage(null);
    if (!isEditMode) {
      form.resetFields();
    }
  };

  // Reusing the same color scheme for now, but keeping the logic if we want to diverge later like planting modal

  // Header colors

  return (
    <Modal
      open={open}
      onClose={handleClose}
      busy={internalLoading}
      savedForm={savedForm}
      destroyOnHidden
      heading={isEditMode ? "ویرایش انبار" : "افزودن انبار جدید"}
      description={
        isEditMode
          ? `ویرایش اطلاعات انبار: ${data?.WarehouseName}`
          : "اطلاعات انبار را با دقت وارد کنید"
      }
      editing={isEditMode}
    >
      <Form
        form={form}
        layout="vertical"
        onFinish={handleFinish}
        requiredMark={false}
        actions={
          <FormActions
            message={message}
            onCancel={handleClose}
            loading={internalLoading}
            editing={isEditMode}
          />
        }
      >
        <FormGrid title="مشخصات انبار">
          <FormItem
            name="WarehouseCode"
            label={
              <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                کد انبار <span className="text-rose-500">*</span>
              </span>
            }
            rules={[{ required: true, message: "لطفا کد انبار را وارد کنید" }]}
            className="mb-0"
          >
            <Input placeholder="مثال: WH-01" />
          </FormItem>

          <FormItem
            name="WarehouseName"
            label={
              <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                نام انبار <span className="text-rose-500">*</span>
              </span>
            }
            rules={[{ required: true, message: "لطفا نام انبار را وارد کنید" }]}
            className="mb-0"
          >
            <Input placeholder="مثال: انبار مرکزی" />
          </FormItem>

          <FormItem
            name="WarehouseLocation"
            label={
              <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                موقعیت مکانی
              </span>
            }
            className="mb-0"
          >
            <Input placeholder="مثال: بخش شمالی گلخانه" />
          </FormItem>

          <FormItem
            name="WarehouseCreatedAt"
            label={
              <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                تاریخ تاسیس
              </span>
            }
            className="mb-0"
          >
            <DatePicker placeholder="انتخاب تاریخ" />
          </FormItem>
        </FormGrid>

        <FormGrid title="شرایط نگهداری و مسئول انبار">
          <FormItem
            name="TemperatureRange"
            label={
              <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                محدوده دمایی
              </span>
            }
            className="mb-0"
          >
            <Input placeholder="مثال: 15-25 درجه" />
          </FormItem>

          <FormItem
            name="HumidityRange"
            label={
              <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                محدوده رطوبت
              </span>
            }
            className="mb-0"
          >
            <Input placeholder="مثال: 40-60 درصد" />
          </FormItem>

          <FormItem
            name="Capacity"
            label={
              <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                ظرفیت
              </span>
            }
            className="mb-0"
          >
            <InputNumber placeholder="عدد" controls={false} />
          </FormItem>

          <FormItem
            name="WarehouseManagerID"
            getValueFromEvent={(value: number | undefined) => value ?? null}
            label={
              <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                مسئول انبار
              </span>
            }
            className="mb-0"
          >
            <Select
              allowClear
              showSearch
              optionFilterProp="label"
              options={managers}
              loading={managersLoading}
              disabled={managersLoading || internalLoading}
              placeholder={
                data?.WarehouseManagerName
                  ? `مسئول فعلی: ${data.WarehouseManagerName}`
                  : "انتخاب شخص حقیقی"
              }
            />
          </FormItem>
        </FormGrid>
      </Form>
    </Modal>
  );
}
