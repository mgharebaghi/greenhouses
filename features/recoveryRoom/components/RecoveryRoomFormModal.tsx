"use client";

import { Modal, Form, Input, InputNumber, Select } from "antd";
import { useEffect, useState, useMemo } from "react";
import { createRecoveryRoom } from "@/features/recoveryRoom/services/create";
import { updateRecoveryRoom } from "@/features/recoveryRoom/services/update";
import { getGraftingOperationsForDropdown } from "@/features/recoveryRoom/services/read";
import QRCodeCanvas from "@/shared/components/QRCodeCanvas";
import { CloseOutlined, EditOutlined, PlusOutlined, UserOutlined } from "@ant-design/icons";
import GreenhouseButton from "@/shared/components/GreenhouseButton";
import DatePicker from "react-multi-date-picker";
import DateObject from "react-date-object";
import persian from "react-date-object/calendars/persian";
import persian_fa from "react-date-object/locales/persian_fa";
import { RecoveryRoomListItem, RecoveryGraftingOpDTO } from "../types";

interface RecoveryRoomFormModalProps {
    open: boolean;
    setOpen: (open: boolean) => void;
    setLoading: (loading: boolean) => void;
    data?: RecoveryRoomListItem | null;
    refreshData: () => void;
}

export default function RecoveryRoomFormModal({ open, setOpen, setLoading, data, refreshData }: RecoveryRoomFormModalProps) {
    const [form] = Form.useForm();
    const [internalLoading, setInternalLoading] = useState(false);
    const [message, setMessage] = useState<{ status: "ok" | "error"; message: string } | null>(null);

    const [graftingOps, setGraftingOps] = useState<RecoveryGraftingOpDTO[]>([]);

    // Watch for changes in WorkersLoss to update total in real-time
    const watchedWorkersLoss = Form.useWatch("WorkersLoss", form);
    const totalLoss = useMemo(() => {
        return (watchedWorkersLoss || []).reduce((acc: number, curr: any) => acc + (Number(curr?.LossPerWorker) || 0), 0);
    }, [watchedWorkersLoss]);

    // Details for auto-fill
    const [selectedOpDetails, setSelectedOpDetails] = useState<{
        OrderID: number | null;
        OrderCode: string | number;
        CustomerName: string;
        GraftingDate: string;
        TrayNumber: string | number;
        Workers: any[];
    } | null>(null);

    const isEditMode = !!data;

    useEffect(() => {
        if (open) {
            fetchOptions();
            setMessage(null);
            if (isEditMode && data) {
                const op = data.Tbl_GraftingOperation;
                const customer = op?.Tbl_Orders?.Tbl_People_Tbl_Orders_CustomerIDToTbl_People;
                const customerName = customer ? `${customer.FirstName} ${customer.LastName}` : "—";

                let workersArr = op?.Tbl_GraftWorkers || [];

                form.setFieldsValue({
                    GraftingOperationID: data.GraftingOperationID,
                    RecoveryEntryDate: data.RecoveryEntryDate ? new DateObject(new Date(data.RecoveryEntryDate)).convert(persian, persian_fa) : null,
                    RecoveryExitDate: data.RecoveryExitDate ? new DateObject(new Date(data.RecoveryExitDate)).convert(persian, persian_fa) : null,
                    WorkersLoss: workersArr.map(w => ({
                        ID: w.ID,
                        LossPerWorker: w.LossPerWorker || 0
                    }))
                });

                setSelectedOpDetails({
                    OrderID: op?.OrderID ?? null,
                    OrderCode: op?.Tbl_Orders?.OrderCode || "—",
                    CustomerName: customerName,
                    GraftingDate: op?.GraftingDate ? new Date(op.GraftingDate).toLocaleDateString("fa-IR") : "—",
                    TrayNumber: op?.TrayNumber || "—",
                    Workers: workersArr
                });

            } else {
                form.resetFields();
                setSelectedOpDetails(null);
            }
        }
    }, [open, data, isEditMode, form]);

    const fetchOptions = async () => {
        const ops = await getGraftingOperationsForDropdown();
        // If edit mode and current Op isn't in ops (because it already has a recovery room), we manually inject it
        if (isEditMode && data && data.Tbl_GraftingOperation) {
            const exists = ops.find(o => o.ID === data.GraftingOperationID);
            if (!exists) {
                setGraftingOps([data.Tbl_GraftingOperation, ...ops]);
                return;
            }
        }
        setGraftingOps(ops);
    };

    const handleOpChange = (value: number) => {
        const op = graftingOps.find(o => o.ID === value);
        if (op) {
            const customer = op.Tbl_Orders?.Tbl_People_Tbl_Orders_CustomerIDToTbl_People;
            const customerName = customer ? `${customer.FirstName} ${customer.LastName}` : "—";

            setSelectedOpDetails({
                OrderID: op.OrderID ?? null,
                OrderCode: op.Tbl_Orders?.OrderCode || "—",
                CustomerName: customerName,
                GraftingDate: op.GraftingDate ? new Date(op.GraftingDate).toLocaleDateString("fa-IR") : "—",
                TrayNumber: op.TrayNumber || "—",
                Workers: op.Tbl_GraftWorkers || []
            });

            form.setFieldsValue({
                RecoveryEntryDate: op.GraftingDate ? new DateObject(new Date(op.GraftingDate)).convert(persian, persian_fa) : null,
                WorkersLoss: (op.Tbl_GraftWorkers || []).map(w => ({
                    ID: w.ID,
                    LossPerWorker: 0 // Default to 0 when newly selected
                }))
            });
        } else {
            setSelectedOpDetails(null);
            form.setFieldsValue({ RecoveryEntryDate: null, WorkersLoss: [] });
        }
    };

    const handleFinish = async (values: any) => {
        setInternalLoading(true);
        setLoading(true);
        setMessage(null);

        // Calculate total loss
        const graftedLossCount = (values.WorkersLoss || []).reduce((acc: number, curr: any) => acc + (curr.LossPerWorker || 0), 0);

        const dataToSubmit = {
            GraftingOperationID: values.GraftingOperationID,
            RecoveryEntryDate: values.RecoveryEntryDate instanceof DateObject ? values.RecoveryEntryDate.toDate() : null,
            RecoveryExitDate: values.RecoveryExitDate instanceof DateObject ? values.RecoveryExitDate.toDate() : null,
            WorkersLoss: values.WorkersLoss,
            GraftedLossCount: graftedLossCount
        };

        if (isEditMode && data?.ID) {
            const res = await updateRecoveryRoom(data.ID, dataToSubmit);
            setLoading(false);
            setInternalLoading(false);

            if (res.status === "ok") {
                setMessage({ status: "ok", message: res.message });
                setTimeout(() => {
                    setOpen(false);
                    refreshData();
                }, 1000);
            } else {
                setMessage({ status: "error", message: res.message });
            }
        } else {
            const res = await createRecoveryRoom(dataToSubmit);
            setLoading(false);
            setInternalLoading(false);

            if (res.status === "ok") {
                setMessage({ status: "ok", message: res.message });
                setTimeout(() => {
                    setOpen(false);
                    refreshData();
                    form.resetFields();
                }, 1000);
            } else {
                setMessage({ status: "error", message: res.message });
            }
        }
    };

    const handleClose = () => {
        setOpen(false);
        setMessage(null);
        if (!isEditMode) {
            form.resetFields();
            setSelectedOpDetails(null);
        }
    };

    const opOptions = graftingOps.map(op => ({
        value: op.ID,
        label: op.Tbl_Orders?.OrderCode || `بدون کد (${op.ID})`
    }));

    const inputStyleClass = "rounded-xl border-2 border-slate-200 dark:border-slate-700 transition-all shadow-sm hover:shadow w-full dark:bg-slate-800 dark:text-white hover:border-emerald-300 dark:focus:border-emerald-600";
    const inputStyle = { height: "46px", fontSize: "14px" };
    const readOnlyInputStyle = { ...inputStyle, backgroundColor: "#f8fafc", color: "#64748b" };

    const theme = isEditMode ? {
        gradient: "from-amber-50 via-orange-50/80 to-white dark:from-slate-900 dark:via-slate-800 dark:to-slate-900",
        border: "border-amber-100 dark:border-slate-700",
        iconBg: "from-amber-500 via-amber-600 to-orange-600",
        iconDot: "bg-orange-400",
        textMain: "text-amber-900 dark:text-slate-100",
        textSub: "text-amber-600/80 dark:text-slate-400",
        accent: "amber",
    } : {
        gradient: "from-emerald-50 via-lime-50/80 to-white dark:from-slate-900 dark:via-slate-800 dark:to-slate-900",
        border: "border-emerald-100 dark:border-slate-700",
        iconBg: "from-emerald-500 via-emerald-600 to-emerald-700",
        iconDot: "bg-lime-400",
        textMain: "text-emerald-900 dark:text-slate-100",
        textSub: "text-emerald-600/80 dark:text-slate-400",
        accent: "emerald",
    };

    return (
        <Modal
            open={open}
            onCancel={handleClose}
            footer={null}
            closeIcon={null}
            centered
            destroyOnHidden
            width={850}
            className="!p-0"
            styles={{
                content: {
                    padding: 0,
                    borderRadius: "1.25rem",
                    overflow: "hidden",
                    boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
                },
            }}
        >
            {/* Header */}
            <div className={`relative px-6 py-6 bg-gradient-to-br border-b ${theme.gradient} ${theme.border}`}>
                <button
                    onClick={handleClose}
                    className={`absolute top-5 left-5 h-9 w-9 rounded-xl bg-white dark:bg-slate-800 border transition-all flex items-center justify-center shadow-sm hover:shadow hover:bg-${theme.accent}-50 border-${theme.accent}-200 hover:border-${theme.accent}-300 text-${theme.accent}-600 hover:text-${theme.accent}-700 dark:border-slate-600 dark:hover:border-${theme.accent}-700 dark:hover:bg-${theme.accent}-900/20 dark:text-${theme.accent}-500`}
                    aria-label="بستن"
                >
                    <CloseOutlined className="text-sm" />
                </button>
                <div className="flex items-center gap-4">
                    <div className="relative">
                        <div className={`h-14 w-14 rounded-2xl bg-gradient-to-br shadow-lg flex items-center justify-center text-white ${theme.iconBg}`}>
                            {isEditMode ? <EditOutlined className="text-2xl" /> : <EditOutlined className="text-2xl" />}
                        </div>
                        <div className={`absolute -bottom-1 -right-1 h-5 w-5 rounded-full border-2 border-white dark:border-slate-800 ${theme.iconDot}`}></div>
                    </div>
                    <div>
                        <h3 className={`font-bold text-2xl ${theme.textMain}`}>اتاق ریکاوری</h3>
                        <p className={`text-sm font-medium mt-1 ${theme.textSub}`}>
                            {isEditMode ? "ویرایش گیاه پیوند زده شده" : "ثبت وضعیت گیاه پیوند زده شده"}
                        </p>
                    </div>
                </div>
            </div>

            <div className="px-6 py-6 bg-slate-50/50 dark:bg-slate-950 max-h-[75vh] overflow-y-auto">
                <Form form={form} layout="vertical" onFinish={handleFinish} requiredMark={false}>
                    {/* Row 1 */}
                    <div className="bg-white dark:bg-slate-800 p-5 rounded-2xl border-2 border-slate-100 dark:border-slate-700 shadow-sm mb-6">
                        <div className="flex flex-col-reverse md:flex-row gap-6 items-center">
                            <div className="flex-1 w-full grid grid-cols-1 md:grid-cols-2 gap-4">
                                <Form.Item name="GraftingOperationID" label={<span className="font-semibold px-2">کد سفارش</span>} rules={[{ required: true }]} className="mb-0">
                                    <Select
                                        options={opOptions}
                                        onChange={handleOpChange}
                                        placeholder="انتخاب کنید"
                                        showSearch
                                        optionFilterProp="label"
                                        size="large"
                                        className="w-full"
                                        style={{ height: "46px" }}
                                        disabled={isEditMode}
                                    />
                                </Form.Item>

                                <div className="flex flex-col gap-2">
                                    <span className="font-semibold px-2 text-sm">نام مشتری</span>
                                    <Input value={selectedOpDetails?.CustomerName || ""} readOnly className={inputStyleClass} style={readOnlyInputStyle} />
                                </div>

                                <div className="flex flex-col gap-2">
                                    <span className="font-semibold px-2 text-sm">تاریخ پیوندزنی</span>
                                    <Input value={selectedOpDetails?.GraftingDate || ""} readOnly className={inputStyleClass} style={readOnlyInputStyle} />
                                </div>

                                <div className="flex flex-col gap-2">
                                    <span className="font-semibold px-2 text-sm">تعداد سینی</span>
                                    <Input value={selectedOpDetails?.TrayNumber || ""} readOnly className={inputStyleClass} style={readOnlyInputStyle} />
                                </div>
                            </div>

                            {selectedOpDetails?.OrderID && selectedOpDetails?.OrderCode && selectedOpDetails?.OrderCode !== "—" && (
                                <div className="flex flex-col items-center justify-center bg-slate-50 dark:bg-slate-900 p-3 rounded-2xl border border-slate-100 dark:border-slate-700 shadow-inner min-w-[120px]">
                                    <QRCodeCanvas value={`https://mygreenhouses.ir/public/scan/orders/${selectedOpDetails.OrderID}`} size={80} />
                                    <span className="text-[11px] text-slate-500 mt-2 font-mono break-all text-center max-w-[100px]">{selectedOpDetails.OrderCode}</span>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Row 2 */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                        <Form.Item name="RecoveryEntryDate" label={<span className="font-semibold text-rose-500">تاریخ ورود به اتاق ریکاوری *</span>} rules={[{ required: true }]}>
                            <DatePicker calendar={persian} locale={persian_fa} calendarPosition="bottom-right" inputClass={`${inputStyleClass} !h-[46px] px-3`} containerClassName="w-full" />
                        </Form.Item>

                        <Form.Item name="RecoveryExitDate" label={<span className="font-semibold text-rose-500">تاریخ خروج از اتاق ریکاوری *</span>} rules={[{ required: true }]}>
                            <DatePicker calendar={persian} locale={persian_fa} calendarPosition="bottom-right" inputClass={`${inputStyleClass} !h-[46px] px-3`} containerClassName="w-full" />
                        </Form.Item>
                    </div>

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
                                            const fullName = person ? `${person.FirstName} ${person.LastName}` : "—";
                                            const nationalCode = person?.NationalCode || "—";
                                            const personCode = person?.PersonCode || "—";

                                            return (
                                                <div key={key} className="grid grid-cols-1 md:grid-cols-12 gap-4 md:gap-4 border border-slate-100 dark:border-slate-800 md:border-none p-4 md:p-2 items-center hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-all rounded-2xl">
                                                    <Form.Item
                                                        {...restField}
                                                        name={[name, 'ID']}
                                                        hidden
                                                    >
                                                        <Input />
                                                    </Form.Item>

                                                    <div className="col-span-1 md:col-span-5 flex items-center gap-3">
                                                        <div className="h-11 w-11 rounded-2xl bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-900/20 dark:to-teal-900/20 flex items-center justify-center text-emerald-600 dark:text-emerald-400 flex-shrink-0 shadow-sm border border-emerald-100/50 dark:border-emerald-800/50">
                                                            <UserOutlined className="text-xl" />
                                                        </div>
                                                        <div className="flex flex-col min-w-0">
                                                            <span className="font-bold text-slate-800 dark:text-slate-100 text-[15px] truncate">{fullName}</span>
                                                            <div className="flex items-center gap-1.5 mt-1">
                                                                <span className="text-[10px] text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-800/50 px-2 py-0.5 rounded-md border border-slate-200/60 dark:border-slate-700/60 flex items-center gap-1">
                                                                    <span>کد ملی:</span>
                                                                    <span className="font-bold text-slate-700 dark:text-slate-200 tracking-tight">{nationalCode}</span>
                                                                </span>
                                                            </div>
                                                        </div>
                                                    </div>

                                                    <div className="col-span-1 md:col-span-3 flex justify-between md:justify-center items-center">
                                                        <span className="md:hidden text-xs font-semibold text-slate-400">کد فعالیت:</span>
                                                        <span className="px-4 py-1.5 rounded-xl bg-emerald-50/50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 text-xs font-black border border-emerald-100/50 dark:border-emerald-800/50 shadow-sm min-w-[60px] text-center">
                                                            {personCode}
                                                        </span>
                                                    </div>

                                                    <div className="col-span-1 md:col-span-4 flex justify-between md:justify-end items-center">
                                                        <span className="md:hidden text-xs font-semibold text-rose-500">تعداد تلفات:</span>
                                                        <Form.Item
                                                            {...restField}
                                                            name={[name, 'LossPerWorker']}
                                                            className="mb-0 w-32 md:w-36"
                                                        >
                                                            <InputNumber
                                                                min={0}
                                                                className="!rounded-xl border-2 border-slate-200 dark:border-slate-700 hover:border-rose-300 focus:border-rose-500 transition-all shadow-sm w-full"
                                                                style={{
                                                                    height: "38px",
                                                                    width: "100%",
                                                                    textAlign: "center"
                                                                }}
                                                                controls={false}
                                                                placeholder="وارد کنید"
                                                            />
                                                        </Form.Item>
                                                    </div>
                                                </div>
                                            );
                                        })}

                                        {/* Total Footer */}
                                        {fields.length > 0 && (
                                            <div className="mt-4 pt-4 border-t-2 border-dashed border-emerald-100 dark:border-emerald-900/40 flex justify-between items-center px-4">
                                                <div className="text-base font-bold text-slate-700 dark:text-slate-300">مجموع تلفات</div>
                                                <div className="text-xl font-bold text-rose-500 bg-rose-50 dark:bg-rose-900/30 px-6 py-1 rounded-lg transition-all duration-300">
                                                    {totalLoss}
                                                </div>
                                            </div>
                                        )}
                                        {fields.length === 0 && (
                                            <div className="text-center text-slate-400 py-4">سفارشی انتخاب نشده است</div>
                                        )}
                                    </div>
                                );
                            }}
                        </Form.List>
                    </div>

                    {message && (
                        <div className={`p-4 rounded-xl mb-4 ${message.status === "ok" ? "bg-emerald-100 text-emerald-800" : "bg-rose-100 text-rose-800"}`}>
                            {message.message}
                        </div>
                    )}

                    <div className="flex justify-between items-center pt-4 border-t">
                        <GreenhouseButton text="ثبت" variant="primary" type="submit" loading={internalLoading} className="w-32 bg-emerald-700 hover:bg-emerald-800 border-none" />
                        <GreenhouseButton text="انصراف" variant="secondary" onClick={handleClose} disabled={internalLoading} className="w-32 bg-rose-50 text-rose-600 border-none hover:bg-rose-100" />
                    </div>
                </Form>
            </div>
        </Modal>
    );
}
