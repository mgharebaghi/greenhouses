"use client";

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

import SeedPackageSelect from "@/features/seed-packages/components/SeedPackageSelect";
import type { SeedPackageDetails } from "@/features/seed-packages/types/details";
import type { z } from "zod";
import { orderInputSchema } from "../schema";
import type { OrderDetails } from "../types/details";

import Modal from "@/shared/components/FormModal";
import { applyFieldErrors } from "@/shared/forms/field-errors";
import { refreshSavedForm, submitForm } from "@/shared/forms/submit";

import { createOrder, updateOrder } from "@/features/orders/actions";
import { getLegacyPersonOptions } from "@/features/people/actions";
import { getAllSeedPackages } from "@/features/seed-packages/actions";
import { getSuppliers } from "@/features/suppliers/actions";
import { supplierName } from "@/features/suppliers/domain/name";

import { CheckCircleOutlined, PlusOutlined } from "@ant-design/icons";

import { useEffect, useState } from "react";

function seedProducer(
  pkg: Pick<SeedPackageDetails, "ProducerCompany" | "Tbl_suppliers">,
) {
  return (
    pkg.ProducerCompany?.trim() ||
    (pkg.Tbl_suppliers ? supplierName(pkg.Tbl_suppliers) : "—")
  );
}

interface OrdersFormModalProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  setLoading: (loading: boolean) => void;
  data?: OrderDetails | null;
  refreshData: () => void | Promise<void>;
}

export default function OrdersFormModal({
  open,
  setOpen,
  setLoading,
  data,
  refreshData,
}: OrdersFormModalProps) {
  const [form] = Form.useForm();
  const [internalLoading, setInternalLoading] = useState(false);
  const [message, setMessage] = useState<{
    status: "ok" | "error";
    message: string;
  } | null>(null);

  const [people, setPeople] = useState<
    { value: number; label: string; nationalCode?: string | null }[]
  >([]);
  const [suppliers, setSuppliers] = useState<
    { value: number; label: string; licenseNumber?: string | null }[]
  >([]);
  const [seedPackages, setSeedPackages] = useState<SeedPackageDetails[]>([]);

  // Derived states for auto-fill logic
  const [rootstockDetails, setRootstockDetails] = useState<{
    plantTitle: string;
    variety: string;
    producer: string;
  } | null>(null);
  const [scionDetails, setScionDetails] = useState<{
    plantTitle: string;
    variety: string;
    producer: string;
  } | null>(null);

  const isEditMode = !!data;

  // Selected item extra info states
  const [selectedCustomer, setSelectedCustomer] = useState<string | null>(null);
  const [selectedManager, setSelectedManager] = useState<string | null>(null);
  const [selectedSupplier, setSelectedSupplier] = useState<string | null>(null);

  useEffect(() => {
    let cancelOptions: (() => void) | undefined;
    if (open) {
      cancelOptions = loadFormOptions(fetchOptions, setMessage);
      setMessage(null);
      if (isEditMode && data) {
        // Populate form
        form.setFieldsValue({
          OrderCode: data.OrderCode,
          CustomerID: data.CustomerID,
          ProjectManager: data.ProjectManager,
          SupplierID: data.SupplierID,
          OrderCount: data.OrderCount,
          OrderDate: data.OrderDate ?? null,
          RootstockID: data.RootstockID,
          ScionID: data.ScionID,
        });

        // Set initial extra info for edit mode
        // Note: We need the lists to be loaded to find the matching codes.
        // Since fetchOptions is async, we doing it here might be too early if relying on 'people' state.
        // However, we can use the 'data' prop if it has relations populated.

        if (data.Tbl_People_Tbl_Orders_CustomerIDToTbl_People) {
          setSelectedCustomer(
            data.Tbl_People_Tbl_Orders_CustomerIDToTbl_People.NationalCode,
          );
        }
        if (data.Tbl_People_Tbl_Orders_ProjectManagerToTbl_People) {
          setSelectedManager(
            data.Tbl_People_Tbl_Orders_ProjectManagerToTbl_People.NationalCode,
          );
        }
        if (data.Tbl_suppliers) {
          setSelectedSupplier(data.Tbl_suppliers.LicenseNumber);
        }

        // Trigger auto-fill logic manually for edit mode
        if (data.Tbl_SeedPackage_Tbl_Orders_RootstockIDToTbl_SeedPackage) {
          const pkg =
            data.Tbl_SeedPackage_Tbl_Orders_RootstockIDToTbl_SeedPackage;
          setRootstockDetails({
            plantTitle: pkg.Tbl_plantVariety?.Tbl_Plants?.CommonName || "—",
            variety: pkg.Tbl_plantVariety?.VarietyName || "—",
            producer: seedProducer(pkg),
          });
        }
        if (data.Tbl_SeedPackage_Tbl_Orders_ScionIDToTbl_SeedPackage) {
          const pkg = data.Tbl_SeedPackage_Tbl_Orders_ScionIDToTbl_SeedPackage;
          setScionDetails({
            plantTitle: pkg.Tbl_plantVariety?.Tbl_Plants?.CommonName || "—",
            variety: pkg.Tbl_plantVariety?.VarietyName || "—",
            producer: seedProducer(pkg),
          });
        }
      } else {
        form.resetFields();
        setRootstockDetails(null);
        setScionDetails(null);
        setSelectedCustomer(null);
        setSelectedManager(null);
        setSelectedSupplier(null);
      }
    }
    return cancelOptions;
  }, [open, data, isEditMode, form]);

  const fetchOptions = async (isCurrent: () => boolean) => {
    const [owners, suppliersData, seedsData] = await Promise.all([
      getLegacyPersonOptions(),
      getSuppliers(),
      getAllSeedPackages(),
    ]);

    if (!isCurrent()) return;
    setPeople(
      owners.map((p) => ({
        value: p.ID,
        label: `${p.FirstName} ${p.LastName}`,
        nationalCode: p.NationalCode,
      })),
    );

    if (suppliersData) {
      setSuppliers(
        suppliersData.map((s) => ({
          value: s.ID,
          label: supplierName(s),
          licenseNumber: s.LicenseNumber,
        })),
      );
    }

    if (seedsData) {
      setSeedPackages(seedsData);
    }
  };

  const handlePersonChange = (value: number, type: "customer" | "manager") => {
    const person = people.find((p) => p.value === value);
    if (type === "customer") {
      setSelectedCustomer(person?.nationalCode || null);
    } else {
      setSelectedManager(person?.nationalCode || null);
    }
  };

  const handleSupplierChange = (value: number) => {
    const supplier = suppliers.find((s) => s.value === value);
    setSelectedSupplier(supplier?.licenseNumber || null);
  };

  const handleRootstockChange = (value: number) => {
    const pkg = availableSeedPackages.get(value);
    if (pkg) {
      setRootstockDetails({
        plantTitle: pkg.Tbl_plantVariety?.Tbl_Plants?.CommonName || "—",
        variety: pkg.Tbl_plantVariety?.VarietyName || "—",
        producer: seedProducer(pkg),
      });
    } else {
      setRootstockDetails(null);
    }
  };

  const handleScionChange = (value: number) => {
    const pkg = availableSeedPackages.get(value);
    if (pkg) {
      setScionDetails({
        plantTitle: pkg.Tbl_plantVariety?.Tbl_Plants?.CommonName || "—",
        variety: pkg.Tbl_plantVariety?.VarietyName || "—",
        producer: seedProducer(pkg),
      });
    } else {
      setScionDetails(null);
    }
  };

  const handleFinish = async (values: z.input<typeof orderInputSchema>) => {
    await submitForm(
      async () => {
        setInternalLoading(true);
        setLoading(true);
        setMessage(null);

        const result =
          isEditMode && data?.ID
            ? await updateOrder(data.ID, values)
            : await createOrder(values);

        applyFieldErrors(form, result);
        if (result.status === "ok") {
          handleClose();
          await refreshSavedForm(refreshData);
        } else {
          setMessage({ status: "error", message: result.message });
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
      setSelectedCustomer(null);
      setSelectedManager(null);
      setSelectedSupplier(null);
    }
  };

  // Seed Package Options for Select
  const availableSeedPackages = new Map(
    seedPackages.map((pkg) => [pkg.ID, pkg]),
  );
  for (const pkg of [
    data?.Tbl_SeedPackage_Tbl_Orders_RootstockIDToTbl_SeedPackage,
    data?.Tbl_SeedPackage_Tbl_Orders_ScionIDToTbl_SeedPackage,
  ]) {
    if (pkg && !availableSeedPackages.has(pkg.ID))
      availableSeedPackages.set(pkg.ID, pkg);
  }
  const packageChoices = Array.from(availableSeedPackages.values());

  const renderInfoCard = (label: string, value: string | null | undefined) => {
    if (!value) return null;
    return (
      <div className="mt-2 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-100 rounded-lg px-3 py-1.5 flex items-center justify-between shadow-sm animate-fadeIn dark:border-sky-800 dark:from-sky-950 dark:to-slate-900">
        <div className="flex items-center gap-2">
          <CheckCircleOutlined className="text-blue-600 text-xs dark:text-sky-300" />
          <span className="text-xs text-blue-700 font-bold dark:text-sky-200">
            {label}
          </span>
        </div>
        <span className="text-sm font-mono font-bold text-slate-700 tracking-wider bg-white/50 px-2 rounded dark:bg-slate-800 dark:text-slate-100">
          {value}
        </span>
      </div>
    );
  };

  const renderSeedSection = (
    title: string,
    formName: string,
    details: { plantTitle: string; variety: string; producer: string } | null,
    onChange: (val: number) => void,
  ) => (
    <FormGrid title={title}>
      {/* Row 1 */}
      <FormItem
        name={formName}
        label={<span className="font-semibold">بسته بذر</span>}
        className="mb-0"
      >
        <SeedPackageSelect packages={packageChoices} onChange={onChange} />
      </FormItem>

      <div className="flex flex-col gap-1">
        <span className="record-form-label">عنوان گیاه</span>
        <Input value={details?.plantTitle || "—"} readOnly />
      </div>

      {/* Row 2 */}
      <div className="flex flex-col gap-1">
        <span className="record-form-label">واریته - رقم</span>
        <Input value={details?.variety || "—"} readOnly />
      </div>

      <div className="flex flex-col gap-1">
        <span className="record-form-label">کمپانی تولید کننده</span>
        <Input value={details?.producer || "—"} readOnly />
      </div>
    </FormGrid>
  );

  return (
    <Modal
      open={open}
      onClose={handleClose}
      destroyOnHidden
      heading={isEditMode ? "ویرایش سفارش" : "ثبت سفارش جدید"}
      description={"اطلاعات سفارش را با دقت وارد کنید"}
      icon={<PlusOutlined />}
      editing={isEditMode}
    >
      <Form
        form={form}
        layout="vertical"
        onFinish={handleFinish}
        requiredMark={false}
      >
        {/* General Info */}
        <FormGrid title="مشخصات سفارش" columns={3}>
          <FormItem
            name="OrderCode"
            label={<span className="font-semibold">کد سفارش</span>}
            rules={[{ required: true }]}
          >
            <Input placeholder="ORD-XXXX" />
          </FormItem>

          <FormItem
            name="OrderCount"
            label={<span className="font-semibold">تعداد سفارش</span>}
            rules={[{ required: true }]}
          >
            <InputNumber placeholder="0" controls={false} />
          </FormItem>

          <FormItem
            name="OrderDate"
            label={<span className="font-semibold">تاریخ ثبت سفارش</span>}
          >
            <DatePicker />
          </FormItem>
        </FormGrid>

        <FormGrid title="اشخاص و تأمین‌کننده" columns={3}>
          <div className="flex flex-col">
            <FormItem
              name="CustomerID"
              label={<span className="font-semibold">نام مشتری</span>}
              rules={[{ required: true }]}
              className="mb-0"
            >
              <Select
                options={people}
                onChange={(val) => handlePersonChange(val, "customer")}
                placeholder="انتخاب کنید"
                showSearch
                optionFilterProp="label"
              />
            </FormItem>
            {renderInfoCard("کد ملی مشتری", selectedCustomer)}
          </div>

          <div className="flex flex-col">
            <FormItem
              name="ProjectManager"
              label={<span className="font-semibold">مدیر پروژه</span>}
              rules={[{ required: true }]}
              className="mb-0"
            >
              <Select
                options={people}
                onChange={(val) => handlePersonChange(val, "manager")}
                placeholder="انتخاب کنید"
                showSearch
                optionFilterProp="label"
              />
            </FormItem>
            {renderInfoCard("کد ملی مدیر", selectedManager)}
          </div>

          <div className="flex flex-col">
            <FormItem
              name="SupplierID"
              label={<span className="font-semibold">نام مجری</span>}
              rules={[{ required: true }]}
              className="mb-0"
            >
              <Select
                options={suppliers}
                onChange={handleSupplierChange}
                placeholder="انتخاب کنید"
                showSearch
                optionFilterProp="label"
              />
            </FormItem>
            {renderInfoCard("شناسه", selectedSupplier)}
          </div>
        </FormGrid>

        {renderSeedSection(
          "بذر پایه Rootstock",
          "RootstockID",
          rootstockDetails,
          handleRootstockChange,
        )}
        {renderSeedSection(
          "بذر پیوندک Scion",
          "ScionID",
          scionDetails,
          handleScionChange,
        )}

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
