import { loadFormOptions } from "@/shared/forms/load-options";
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
  Switch,
} from "@/shared/components/FormControls";
import { getPlantVarieties } from "@/features/plant-varieties/actions";
import {
  createSeedPackage,
  getSeedPackageExpiration,
  updateSeedPackage,
} from "@/features/seed-packages/actions";
import { getSuppliers } from "@/features/suppliers/actions";
import { supplierName } from "@/features/suppliers/domain/name";
import Modal from "@/shared/components/FormModal";
import { applyFieldErrors } from "@/shared/forms/field-errors";
import { refreshSavedForm, submitForm } from "@/shared/forms/submit";
import { PlusOutlined } from "@ant-design/icons";
import {
  pickerDateToISO,
  toCalendarDate,
  type DateCalendar,
} from "@/shared/dates/calendar";

import { useEffect, useState } from "react";
import type { z } from "zod";
import { seedPackageInputSchema } from "../schema";
import type { SeedPackageDetails } from "../types/details";

interface SeedPackageInsUpModalProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  setLoading: (loading: boolean) => void;
  data?: SeedPackageDetails | null; // If data is provided, it's edit mode
  refreshData: () => void;
}

export default function SeedPackageInsUpModal({
  open,
  setOpen,
  setLoading,
  data,
  refreshData,
}: SeedPackageInsUpModalProps) {
  const [form] = Form.useForm();
  const [internalLoading, setInternalLoading] = useState(false);
  const [calendarSystem, setCalendarSystem] = useState<DateCalendar>("persian");
  const [productionCalendar, setProductionCalendar] =
    useState<DateCalendar>("persian");
  const [expirationLoading, setExpirationLoading] = useState(false);
  const [message, setMessage] = useState<{
    status: "ok" | "error";
    message: string;
  } | null>(null);

  const [suppliers, setSuppliers] = useState<
    { value: number; label: string }[]
  >([]);
  const [varieties, setVarieties] = useState<
    { value: number; label: string }[]
  >([]);

  const isEditMode = !!data;
  const productionDate = Form.useWatch("ProductionDate", form);
  const productionDay = pickerDateToISO(toCalendarDate(productionDate));
  const savedProduction = pickerDateToISO(toCalendarDate(data?.ProductionDate));
  const savedExpiration = pickerDateToISO(toCalendarDate(data?.ExpirationDate));

  useEffect(() => {
    let cancelOptions: (() => void) | undefined;
    if (open) {
      setCalendarSystem("persian");
      setProductionCalendar("persian");
      cancelOptions = loadFormOptions(fetchOptions, setMessage);
      setMessage(null);
      if (isEditMode && data) {
        form.setFieldsValue({
          SupplierID: data.SupplierID,
          ProducerCompany: data.ProducerCompany,
          CropVariety: data.CropVariety,
          GerminationRate: data.GerminationRate,
          PurityPercent: data.PurityPercent,
          ProductionDate: data.ProductionDate ?? null,
          ExpirationDate: data.ExpirationDate ?? null,
          QualityGrade: data.QualityGrade,
          SerialNumber: data.SerialNumber,
          PackageType: data.PackageType,
          SeedCount: data.SeedCount,
          WeightGram: data.WeightGram,
          PackagingDate: data.PackagingDate ?? null,
          PackageNumber: data.PackageNumber,
          IsCertified: data.IsCertified,
        });
      } else {
        form.resetFields();
      }
    }
    return cancelOptions;
  }, [open, data, isEditMode, form]);

  useEffect(() => {
    if (!open) return;
    if (productionDay === savedProduction && savedExpiration) {
      form.setFieldValue("ExpirationDate", savedExpiration);
      setExpirationLoading(false);
      return;
    }
    form.setFieldValue("ExpirationDate", null);
    if (!productionDay) {
      setExpirationLoading(false);
      return;
    }

    let current = true;
    setExpirationLoading(true);
    void getSeedPackageExpiration({
      ProductionDate: productionDay,
      ProductionCalendar: productionCalendar,
    })
      .then((expiration) => {
        if (current) form.setFieldValue("ExpirationDate", expiration);
      })
      .catch(() => {
        if (current)
          setMessage({
            status: "error",
            message:
              "محاسبهٔ تاریخ انقضا انجام نشد. تاریخ تولید را بررسی کنید.",
          });
      })
      .finally(() => {
        if (current) setExpirationLoading(false);
      });
    return () => {
      current = false;
    };
  }, [
    open,
    form,
    productionDay,
    productionCalendar,
    savedProduction,
    savedExpiration,
  ]);

  const fetchOptions = async (isCurrent: () => boolean) => {
    const [suppliersData, varietiesData] = await Promise.all([
      getSuppliers(),
      getPlantVarieties(),
    ]);

    if (suppliersData) {
      if (!isCurrent()) return;
      setSuppliers(
        suppliersData.map((s) => ({
          value: s.ID,
          label: supplierName(s),
        })),
      );
    }

    if (varietiesData) {
      setVarieties(
        varietiesData.map((v) => ({
          value: v.ID,
          label: v.VarietyName || `Variety ${v.ID}`,
        })),
      );
    }
  };

  const handleFinish = async (
    values: z.input<typeof seedPackageInputSchema>,
  ) => {
    await submitForm(
      async () => {
        setInternalLoading(true);
        setLoading(true);
        setMessage(null);

        const input = { ...values, ProductionCalendar: productionCalendar };
        let res;
        if (isEditMode && data?.ID) {
          res = await updateSeedPackage(data.ID, input);
        } else {
          res = await createSeedPackage(input);
        }

        setLoading(false);
        setInternalLoading(false);

        applyFieldErrors(form, res);
        if (res.status === "ok") {
          setMessage({ status: "ok", message: res.message });
          setTimeout(() => {
            setOpen(false);
            void refreshSavedForm(refreshData);
            if (!isEditMode) {
              form.resetFields();
            }
          }, 1000);
        } else {
          setMessage({ status: "error", message: res.message });
        }
      },
      (feedback) => setMessage(feedback),
      () => {
        setInternalLoading(false);
        setLoading(false);
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

  // Header colors

  return (
    <Modal
      open={open}
      onClose={handleClose}
      destroyOnHidden
      heading={isEditMode ? "ویرایش بسته بذر" : "افزودن بسته بذر جدید"}
      description={
        isEditMode
          ? `ویرایش اطلاعات بسته: ${data?.SerialNumber}`
          : "اطلاعات بسته را با دقت وارد کنید"
      }
      icon={<PlusOutlined />}
      editing={isEditMode}
    >
      <Form
        form={form}
        layout="vertical"
        onFinish={handleFinish}
        requiredMark={false}
      >
        <FormGrid title="هویت بسته و تأمین‌کننده" columns={3}>
          <FormItem
            name="SupplierID"
            label={
              <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                تأمین کننده
              </span>
            }
            className="mb-0"
          >
            <Select
              options={suppliers}
              placeholder="انتخاب کنید"
              showSearch
              optionFilterProp="label"

              loading={suppliers.length === 0}
            />
          </FormItem>

          <FormItem
            name="ProducerCompany"
            label={
              <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                شرکت تولید کننده
              </span>
            }
            className="mb-0"
          >
            <Input placeholder="نام شرکت" />
          </FormItem>

          <FormItem
            name="CropVariety"
            label={
              <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                واریته
              </span>
            }
            className="mb-0"
          >
            <Select
              options={varieties}
              placeholder="انتخاب کنید"
              showSearch
              optionFilterProp="label"

              loading={varieties.length === 0}
            />
          </FormItem>

          <FormItem
            name="SerialNumber"
            label={
              <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                شماره سریال <span className="text-rose-500">*</span>
              </span>
            }
            rules={[
              { required: true, message: "لطفا شماره سریال را وارد کنید" },
            ]}
            className="mb-0"
          >
            <Input placeholder="مثال: PKG-1001" />
          </FormItem>

          <FormItem
            name="PackageNumber"
            label={
              <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                تعداد بسته ها
              </span>
            }
            className="mb-0"
          >
            <InputNumber placeholder="عدد" controls={false} />
          </FormItem>

          <FormItem
            name="PackageType"
            label={
              <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                نوع بسته‌بندی
              </span>
            }
            className="mb-0"
          >
            <Input placeholder="مثال: پاکت, قوطی..." />
          </FormItem>
        </FormGrid>

        <FormGrid title="مقدار و کیفیت بذر" columns={3}>
          <FormItem
            name="SeedCount"
            label={
              <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                تعداد بذر در هر بسته
              </span>
            }
            className="mb-0"
          >
            <InputNumber placeholder="عدد" controls={false} />
          </FormItem>

          <FormItem
            name="WeightGram"
            label={
              <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                وزن هر بسته (گرم)
              </span>
            }
            className="mb-0"
          >
            <InputNumber placeholder="گرم" controls={false} />
          </FormItem>

          <FormItem
            name="GerminationRate"
            label={
              <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                نرخ جوانه زنی (%)
              </span>
            }
            className="mb-0"
          >
            <InputNumber placeholder="%" controls={false} max={100} min={0} />
          </FormItem>

          <FormItem
            name="PurityPercent"
            label={
              <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                درصد خلوص (%)
              </span>
            }
            className="mb-0"
          >
            <InputNumber placeholder="%" controls={false} max={100} min={0} />
          </FormItem>

          <FormItem
            name="QualityGrade"
            label={
              <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                درجه کیفی
              </span>
            }
            className="mb-0"
          >
            <Input placeholder="مثال: A, B, Grade 1" />
          </FormItem>

          <FormItem
            name="IsCertified"
            label={
              <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                گواهی تضمین کیفیت دارد؟
              </span>
            }
            valuePropName="checked"
            className="mb-0 flex flex-col justify-end pb-3"
          >
            <Switch />
          </FormItem>
        </FormGrid>

        <FormGrid title="تاریخ‌های تولید و بسته‌بندی" columns={3}>
          <div className="record-form-wide flex justify-end">
            <Radio.Group
              size="small"
              optionType="button"
              buttonStyle="solid"
              aria-label="تقویم تاریخ‌های بسته بذر"
              value={calendarSystem}
              onChange={(event) => setCalendarSystem(event.target.value)}
              options={[
                { label: "شمسی", value: "persian" },
                { label: "میلادی", value: "gregorian" },
              ]}
            />
          </div>
          <FormItem
            name="ProductionDate"
            label={
              <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                تاریخ تولید
              </span>
            }
            className="mb-0"
          >
            <DatePicker
              calendarSystem={calendarSystem}
              placeholder="انتخاب تاریخ"
              onChange={() => {
                setProductionCalendar(calendarSystem);
                setMessage(null);
              }}
            />
          </FormItem>

          <FormItem
            name="PackagingDate"
            label={
              <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                تاریخ بسته‌بندی
              </span>
            }
            className="mb-0"
          >
            <DatePicker
              calendarSystem={calendarSystem}
              placeholder="انتخاب تاریخ"
            />
          </FormItem>

          <FormItem
            name="ExpirationDate"
            label={
              <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                تاریخ انقضا
              </span>
            }
            className="mb-0"
          >
            <DatePicker
              calendarSystem={calendarSystem}
              disabled
              placeholder={
                expirationLoading
                  ? "در حال محاسبه…"
                  : "از تاریخ تولید محاسبه می‌شود"
              }
            />
          </FormItem>
        </FormGrid>

        <FormActions
          message={message}
          onCancel={handleClose}
          loading={internalLoading}
          editing={isEditMode}
        />
      </Form>
    </Modal>
  );
}
