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

import { formatPersianDate } from "@/shared/dates/calendar";

import { recoveryRoomSchema } from "../schema";

import { publicOrderUrl } from "@/shared/config/public-urls";

import Modal from "@/shared/components/FormModal";
import { applyFieldErrors } from "@/shared/forms/field-errors";
import { submitForm, type RefreshFormList } from "@/shared/forms/submit";
import useSavedForm from "@/shared/forms/useSavedForm";

import {
  createRecoveryRoom,
  getGraftingOperationsForDropdown,
  updateRecoveryRoom,
} from "@/features/recovery-rooms/actions";

import QRCodeCanvas from "@/shared/components/QRCodeCanvas";
import { UserOutlined } from "@ant-design/icons";

import { useEffect, useMemo, useState } from "react";
import { RecoveryGraftingOpDTO, RecoveryRoomListItem } from "../types";

interface RecoveryRoomFormModalProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  data?: RecoveryRoomListItem | null;
  refreshData: RefreshFormList;
}

export default function RecoveryRoomFormModal({
  open,
  setOpen,
  data,
  refreshData,
}: RecoveryRoomFormModalProps) {
  const [form] = Form.useForm();
  const savedForm = useSavedForm();
  const [internalLoading, setInternalLoading] = useState(false);
  const [message, setMessage] = useState<{
    status: "ok" | "error";
    message: string;
  } | null>(null);

  const [graftingOps, setGraftingOps] = useState<RecoveryGraftingOpDTO[]>([]);

  // Watch for changes in WorkersLoss to update total in real-time
  const watchedWorkersLoss = Form.useWatch("WorkersLoss", form);
  const totalLoss = useMemo(() => {
    return (watchedWorkersLoss || []).reduce(
      (acc: number, curr: { LossPerWorker?: number }) =>
        acc + (Number(curr?.LossPerWorker) || 0),
      0,
    );
  }, [watchedWorkersLoss]);

  // Details for auto-fill
  const [selectedOpDetails, setSelectedOpDetails] = useState<{
    OrderID: number | null;
    OrderCode: string | number;
    CustomerName: string;
    GraftingDate: string;
    TrayNumber: string | number;
    Workers: RecoveryGraftingOpDTO["Tbl_GraftWorkers"];
  } | null>(null);

  const isEditMode = !!data;

  useEffect(() => {
    let cancelOptions: (() => void) | undefined;
    const fetchOptions = async (isCurrent: () => boolean) => {
      const ops = await getGraftingOperationsForDropdown();
      if (!isCurrent()) return;
      // If edit mode and current Op isn't in ops (because it already has a recovery room), we manually inject it
      if (isEditMode && data && data.Tbl_GraftingOperation) {
        const exists = ops.find((o) => o.ID === data.GraftingOperationID);
        if (!exists) {
          setGraftingOps([data.Tbl_GraftingOperation, ...ops]);
          return;
        }
      }
      setGraftingOps(ops);
    };

    if (open) {
      cancelOptions = loadFormOptions(fetchOptions, setMessage);
      setMessage(null);
      if (isEditMode && data) {
        const op = data.Tbl_GraftingOperation;
        const customer =
          op?.Tbl_Orders?.Tbl_People_Tbl_Orders_CustomerIDToTbl_People;
        const customerName = customer
          ? `${customer.FirstName} ${customer.LastName}`
          : "—";

        const workersArr = op?.Tbl_GraftWorkers || [];

        form.setFieldsValue({
          GraftingOperationID: data.GraftingOperationID,
          RecoveryEntryDate: data.RecoveryEntryDate ?? null,
          RecoveryExitDate: data.RecoveryExitDate ?? null,
          WorkersLoss: workersArr.map((w) => ({
            ID: w.ID,
            LossPerWorker: w.LossPerWorker || 0,
          })),
        });

        setSelectedOpDetails({
          OrderID: op?.OrderID ?? null,
          OrderCode: op?.Tbl_Orders?.OrderCode || "—",
          CustomerName: customerName,
          GraftingDate: op?.GraftingDate
            ? formatPersianDate(op.GraftingDate)
            : "—",
          TrayNumber: op?.TrayNumber || "—",
          Workers: workersArr,
        });
      } else {
        form.resetFields();
        setSelectedOpDetails(null);
      }
    }
    return cancelOptions;
  }, [open, data, isEditMode, form]);

  const handleOpChange = (value: number) => {
    const op = graftingOps.find((o) => o.ID === value);
    if (op) {
      const customer =
        op.Tbl_Orders?.Tbl_People_Tbl_Orders_CustomerIDToTbl_People;
      const customerName = customer
        ? `${customer.FirstName} ${customer.LastName}`
        : "—";

      setSelectedOpDetails({
        OrderID: op.OrderID ?? null,
        OrderCode: op.Tbl_Orders?.OrderCode || "—",
        CustomerName: customerName,
        GraftingDate: formatPersianDate(op.GraftingDate),
        TrayNumber: op.TrayNumber || "—",
        Workers: op.Tbl_GraftWorkers || [],
      });

      form.setFieldsValue({
        RecoveryEntryDate: op.GraftingDate ?? null,
        WorkersLoss: (op.Tbl_GraftWorkers || []).map((w) => ({
          ID: w.ID,
          LossPerWorker: 0, // Default to 0 when newly selected
        })),
      });
    } else {
      setSelectedOpDetails(null);
      form.setFieldsValue({ RecoveryEntryDate: null, WorkersLoss: [] });
    }
  };

  const handleFinish = async (
    values: import("zod").input<typeof recoveryRoomSchema>,
  ) => {
    if (internalLoading || savedForm.saved) return;
    await submitForm(
      async () => {
        setInternalLoading(true);
        setMessage(null);

        // Calculate total loss
        const graftedLossCount = (values.WorkersLoss || []).reduce(
          (acc: number, curr: { LossPerWorker?: number }) =>
            acc + (curr.LossPerWorker || 0),
          0,
        );

        const dataToSubmit = {
          GraftingOperationID: values.GraftingOperationID,
          RecoveryEntryDate: values.RecoveryEntryDate ?? null,
          RecoveryExitDate: values.RecoveryExitDate ?? null,
          WorkersLoss: values.WorkersLoss,
          GraftedLossCount: graftedLossCount,
        };

        const result =
          isEditMode && data?.ID
            ? await updateRecoveryRoom(data.ID, dataToSubmit)
            : await createRecoveryRoom(dataToSubmit);
        applyFieldErrors(form, result);
        if (result.status === "ok") {
          await savedForm.complete(result.message, refreshData, handleClose);
        } else {
          setMessage(result);
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
      setSelectedOpDetails(null);
    }
  };

  const opOptions = graftingOps.map((op) => ({
    value: op.ID,
    label: op.Tbl_Orders?.OrderCode || `بدون کد (${op.ID})`,
  }));

  return (
    <Modal
      open={open}
      onClose={handleClose}
      busy={internalLoading}
      savedForm={savedForm}
      destroyOnHidden
      heading={"اتاق ریکاوری"}
      description={
        isEditMode
          ? "ویرایش گیاه پیوند زده شده"
          : "ثبت وضعیت گیاه پیوند زده شده"
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
        {/* Row 1 */}
        <div className="bg-white dark:bg-slate-800 p-5 rounded-2xl border-2 border-slate-100 dark:border-slate-700 shadow-sm mb-6">
          <div className="flex flex-col-reverse md:flex-row gap-6 items-center">
            <div className="flex-1 w-full grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormItem
                name="GraftingOperationID"
                label={<span className="font-semibold px-2">کد سفارش</span>}
                rules={[{ required: true }]}
                className="mb-0"
              >
                <Select
                  options={opOptions}
                  onChange={handleOpChange}
                  placeholder="انتخاب کنید"
                  showSearch
                  optionFilterProp="label"

                  disabled={isEditMode}
                />
              </FormItem>

              <div className="flex flex-col gap-2">
                <span className="font-semibold px-2 text-sm">نام مشتری</span>
                <Input value={selectedOpDetails?.CustomerName || ""} readOnly />
              </div>

              <div className="flex flex-col gap-2">
                <span className="font-semibold px-2 text-sm">
                  تاریخ پیوندزنی
                </span>
                <Input value={selectedOpDetails?.GraftingDate || ""} readOnly />
              </div>

              <div className="flex flex-col gap-2">
                <span className="font-semibold px-2 text-sm">تعداد سینی</span>
                <Input value={selectedOpDetails?.TrayNumber || ""} readOnly />
              </div>
            </div>

            {selectedOpDetails?.OrderID &&
              selectedOpDetails?.OrderCode &&
              selectedOpDetails?.OrderCode !== "—" && (
                <div className="flex flex-col items-center justify-center bg-slate-50 dark:bg-slate-900 p-3 rounded-2xl border border-slate-100 dark:border-slate-700 shadow-inner min-w-[120px]">
                  <QRCodeCanvas
                    value={publicOrderUrl(selectedOpDetails.OrderID)}
                    size={80}
                  />
                  <span className="text-[11px] text-slate-600 mt-2 dark:text-slate-300 font-mono break-all text-center max-w-[100px]">
                    {selectedOpDetails.OrderCode}
                  </span>
                </div>
              )}
          </div>
        </div>

        {/* Row 2 */}
        <FormGrid title="زمان‌بندی ریکاوری" className="mb-4">
          <FormItem
            name="RecoveryEntryDate"
            label={
              <span className="font-semibold text-rose-500">
                تاریخ ورود به اتاق ریکاوری *
              </span>
            }
            rules={[{ required: true }]}
          >
            <DatePicker />
          </FormItem>

          <FormItem
            name="RecoveryExitDate"
            label={
              <span className="font-semibold text-rose-500">
                تاریخ خروج از اتاق ریکاوری *
              </span>
            }
            rules={[{ required: true }]}
          >
            <DatePicker />
          </FormItem>
        </FormGrid>

        {/* Section 3: Workers Loss */}
        <div className="border-2 border-emerald-100 dark:border-emerald-900/40 rounded-2xl p-4 bg-white dark:bg-slate-900 mb-6 relative">
          {/* Headers */}
          <div className="hidden md:grid grid-cols-12 gap-4 mb-4 px-4 text-[13px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
            <div className="col-span-5">نام و کد ملی پیوندزن</div>
            <div className="col-span-3 text-center">کد افراد</div>
            <div className="col-span-4 text-left pl-4">میزان تلفات</div>
          </div>

          {/* Workers List */}
          <Form.List name="WorkersLoss">
            {(fields) => {
              return (
                <div className="flex flex-col gap-2">
                  {fields.map(({ key, name, ...restField }, idx) => {
                    const workerData = selectedOpDetails?.Workers?.[idx];
                    const person = workerData?.Tbl_People;
                    const fullName = person
                      ? `${person.FirstName} ${person.LastName}`
                      : "—";
                    const nationalCode = person?.NationalCode || "—";
                    const personCode = person?.PersonCode || "—";

                    return (
                      <div
                        key={key}
                        className="grid grid-cols-1 md:grid-cols-12 gap-4 md:gap-4 border border-slate-100 dark:border-slate-800 md:border-none p-4 md:p-2 items-center hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-all rounded-2xl"
                      >
                        <FormItem {...restField} name={[name, "ID"]} hidden>
                          <Input />
                        </FormItem>

                        <div className="col-span-1 md:col-span-5 flex items-center gap-3">
                          <div className="h-11 w-11 rounded-2xl bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-900/20 dark:to-teal-900/20 flex items-center justify-center text-emerald-600 dark:text-emerald-400 flex-shrink-0 shadow-sm border border-emerald-100/50 dark:border-emerald-800/50">
                            <UserOutlined className="text-xl" />
                          </div>
                          <div className="flex flex-col min-w-0">
                            <span className="font-bold text-slate-800 dark:text-slate-100 text-[15px] truncate">
                              {fullName}
                            </span>
                            <div className="flex items-center gap-1.5 mt-1">
                              <span className="text-[10px] text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-800/50 px-2 py-0.5 rounded-md border border-slate-200/60 dark:border-slate-700/60 flex items-center gap-1">
                                <span>کد ملی:</span>
                                <span className="font-bold text-slate-700 dark:text-slate-200 tracking-tight">
                                  {nationalCode}
                                </span>
                              </span>
                            </div>
                          </div>
                        </div>

                        <div className="col-span-1 md:col-span-3 flex justify-between md:justify-center items-center">
                          <span className="md:hidden text-xs font-semibold text-slate-600 dark:text-slate-300">
                            کد فعالیت:
                          </span>
                          <span className="px-4 py-1.5 rounded-xl bg-emerald-50/50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 text-xs font-black border border-emerald-100/50 dark:border-emerald-800/50 shadow-sm min-w-[60px] text-center">
                            {personCode}
                          </span>
                        </div>

                        <div className="col-span-1 md:col-span-4 flex justify-between md:justify-end items-center">
                          <span className="md:hidden text-xs font-semibold text-rose-500">
                            تعداد تلفات:
                          </span>
                          <FormItem
                            {...restField}
                            name={[name, "LossPerWorker"]}
                            className="mb-0 w-32 md:w-36"
                          >
                            <InputNumber
                              min={0}

                              controls={false}
                              placeholder="وارد کنید"
                            />
                          </FormItem>
                        </div>
                      </div>
                    );
                  })}

                  {/* Total Footer */}
                  {fields.length > 0 && (
                    <div className="mt-4 pt-4 border-t-2 border-dashed border-emerald-100 dark:border-emerald-900/40 flex justify-between items-center px-4">
                      <div className="text-base font-bold text-slate-700 dark:text-slate-300">
                        مجموع تلفات
                      </div>
                      <div className="text-xl font-bold text-rose-500 bg-rose-50 dark:bg-rose-900/30 px-6 py-1 rounded-lg transition-all duration-300">
                        {totalLoss}
                      </div>
                    </div>
                  )}
                  {fields.length === 0 && (
                    <div className="text-center text-slate-600 py-4 dark:text-slate-300">
                      سفارشی انتخاب نشده است
                    </div>
                  )}
                </div>
              );
            }}
          </Form.List>
        </div>
      </Form>
    </Modal>
  );
}
