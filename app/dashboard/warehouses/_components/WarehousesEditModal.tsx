"use client";

import { Modal, Form, Input, Select, InputNumber } from "antd";
import { useEffect, useState } from "react";
import { updateWarehouse } from "@/app/lib/services/warehouses";
import { getAllOwners } from "@/app/lib/services/owners";
import { CloseOutlined, ShopOutlined, CheckCircleOutlined, ExclamationCircleOutlined } from "@ant-design/icons";
import GreenhouseButton from "@/app/components/UI/GreenhouseButton";

interface WarehousesEditModalProps {
    open: boolean;
    setOpen: (open: boolean) => void;
    setLoading: (loading: boolean) => void;
    data: any | null;
    refreshData: () => void;
}

export default function WarehousesEditModal({ open, setOpen, setLoading, data, refreshData }: WarehousesEditModalProps) {
    const [form] = Form.useForm();
    const [managers, setManagers] = useState<{ value: number; label: string }[]>([]);
    const [internalLoading, setInternalLoading] = useState(false);
    const [message, setMessage] = useState<{ status: "ok" | "error"; message: string } | null>(null);

    useEffect(() => {
        if (open && data) {
            fetchManagers();
            form.setFieldsValue({
                WarehouseCode: data.WarehouseCode,
                WarehouseName: data.WarehouseName,
                WarehouseLocation: data.WarehouseLocation,
                TemperatureRange: data.TemperatureRange,
                HumidityRange: data.HumidityRange,
                Capacity: data.Capacity,
                WarehouseManagerName: data.WarehouseManagerName,
            });
        } else {
            setMessage(null);
        }
    }, [open, data]);

    const fetchManagers = async () => {
        try {
            const res: any = await getAllOwners();
            if (res) {
                setManagers(res.map((p: any) => ({
                    value: p.ID,
                    label: `${p.FirstName} ${p.LastName}`
                })));
            }
        } catch (e) {
            console.error("Error fetching owners", e);
        }
    };

    const handleFinish = async (values: any) => {
        if (!data?.WarehouseID) return;
        setInternalLoading(true);
        setLoading(true);
        setMessage(null);

        const res = await updateWarehouse(data.WarehouseID, values);

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
    };

    const handleClose = () => {
        setOpen(false);
        setMessage(null);
    };

    const inputStyleClass = "rounded-xl border-2 border-slate-200 dark:border-slate-700 hover:border-emerald-300 dark:hover:border-emerald-700 focus:border-emerald-400 dark:focus:border-emerald-600 transition-all shadow-sm hover:shadow w-full dark:bg-slate-800 dark:text-white dark:placeholder-slate-500";
    const inputStyle = { height: "46px", fontSize: "14px" };

    return (
        <Modal
            open={open}
            onCancel={handleClose}
            footer={null}
            closeIcon={null}
            centered
            destroyOnHidden
            width={800}
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
            <div className="relative px-6 py-6 bg-gradient-to-br from-emerald-50 via-lime-50/80 to-white dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 border-b border-emerald-100 dark:border-slate-700">
                <button
                    onClick={handleClose}
                    className="absolute top-5 left-5 h-9 w-9 rounded-xl bg-white dark:bg-slate-800 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 border border-emerald-200 dark:border-slate-600 hover:border-emerald-300 dark:hover:border-emerald-700 transition-all flex items-center justify-center text-emerald-600 dark:text-emerald-500 hover:text-emerald-700 shadow-sm hover:shadow"
                    aria-label="بستن"
                >
                    <CloseOutlined className="text-sm" />
                </button>

                <div className="flex items-center gap-4">
                    <div className="relative">
                        <div className="h-14 w-14 rounded-2xl bg-gradient-to-br from-emerald-500 via-emerald-600 to-emerald-700 shadow-lg flex items-center justify-center text-white">
                            <ShopOutlined className="text-2xl" />
                        </div>
                        <div className="absolute -bottom-1 -right-1 h-5 w-5 rounded-full bg-lime-400 border-2 border-white dark:border-slate-800"></div>
                    </div>
                    <div>
                        <h3 className="font-bold text-2xl text-emerald-900 dark:text-slate-100">ویرایش انبار</h3>
                        <p className="text-sm text-emerald-600/80 dark:text-slate-400 mt-1 flex items-center gap-1.5">
                            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                            ویرایش اطلاعات انبار: {data?.WarehouseName}
                        </p>
                    </div>
                </div>
            </div>

            {/* Body */}
            <div className="px-6 py-6 bg-gradient-to-br from-white to-slate-50/30 dark:from-slate-900 dark:to-slate-950">
                <Form form={form} layout="vertical" onFinish={handleFinish} requiredMark={false}>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">

                        <Form.Item
                            name="WarehouseCode"
                            label={<span className="text-sm font-semibold text-slate-700 dark:text-slate-300">کد انبار <span className="text-rose-500">*</span></span>}
                            rules={[{ required: true, message: 'لطفا کد انبار را وارد کنید' }]}
                            className="mb-0"
                        >
                            <Input placeholder="مثال: WH-01" size="large" className={inputStyleClass} style={inputStyle} />
                        </Form.Item>

                        <Form.Item
                            name="WarehouseName"
                            label={<span className="text-sm font-semibold text-slate-700 dark:text-slate-300">نام انبار <span className="text-rose-500">*</span></span>}
                            rules={[{ required: true, message: 'لطفا نام انبار را وارد کنید' }]}
                            className="mb-0"
                        >
                            <Input placeholder="مثال: انبار مرکزی" size="large" className={inputStyleClass} style={inputStyle} />
                        </Form.Item>

                        <Form.Item name="WarehouseLocation" label={<span className="text-sm font-semibold text-slate-700 dark:text-slate-300">موقعیت مکانی</span>} className="mb-0 sm:col-span-2">
                            <Input placeholder="مثال: بخش شمالی گلخانه" size="large" className={inputStyleClass} style={inputStyle} />
                        </Form.Item>

                        <Form.Item name="TemperatureRange" label={<span className="text-sm font-semibold text-slate-700 dark:text-slate-300">محدوده دمایی</span>} className="mb-0">
                            <Input placeholder="مثال: 15-25 درجه" size="large" className={inputStyleClass} style={inputStyle} />
                        </Form.Item>

                        <Form.Item name="HumidityRange" label={<span className="text-sm font-semibold text-slate-700 dark:text-slate-300">محدوده رطوبت</span>} className="mb-0">
                            <Input placeholder="مثال: 40-60 درصد" size="large" className={inputStyleClass} style={inputStyle} />
                        </Form.Item>

                        <Form.Item name="Capacity" label={<span className="text-sm font-semibold text-slate-700 dark:text-slate-300">ظرفیت</span>} className="mb-0">
                            <InputNumber
                                className={inputStyleClass}
                                style={{ ...inputStyle, width: "100%", paddingTop: "4px" }}
                                placeholder="عدد"
                                controls={false}
                            />
                        </Form.Item>

                        <Form.Item
                            name="WarehouseManagerName"
                            label={<span className="text-sm font-semibold text-slate-700 dark:text-slate-300">مسئول انبار</span>}
                            className="mb-0"
                        >
                            <Select
                                options={managers}
                                placeholder="انتخاب کنید"
                                showSearch
                                optionFilterProp="label"
                                size="large"
                                className="w-full"
                                style={{ height: "46px" }}
                            />
                        </Form.Item>

                    </div>

                    {message && (
                        <div
                            className={`mt-5 p-4 rounded-xl border-2 flex items-start gap-3 animate-in fade-in slide-in-from-top-3 duration-300 shadow-sm ${message.status === "ok"
                                ? "bg-gradient-to-br from-emerald-50 to-emerald-100/50 dark:from-emerald-900/30 dark:to-emerald-900/10 border-emerald-300 dark:border-emerald-800 text-emerald-900 dark:text-emerald-300"
                                : "bg-gradient-to-br from-rose-50 to-rose-100/50 dark:from-rose-900/30 dark:to-rose-900/10 border-rose-300 dark:border-rose-800 text-rose-900 dark:text-rose-300"
                                }`}
                        >
                            <div className={`mt-0.5 p-1.5 rounded-lg ${message.status === "ok" ? "bg-emerald-200/50 dark:bg-emerald-800/50" : "bg-rose-200/50 dark:bg-rose-800/50"}`}>
                                {message.status === "ok" ? (
                                    <CheckCircleOutlined className="text-lg text-emerald-700 dark:text-emerald-400" />
                                ) : (
                                    <ExclamationCircleOutlined className="text-lg text-rose-700 dark:text-rose-400" />
                                )}
                            </div>
                            <div className="flex-1">
                                <p className="text-sm font-semibold mb-0.5">{message.status === "ok" ? "موفقیت‌آمیز" : "خطا"}</p>
                                <p className="text-sm leading-relaxed opacity-90">{message.message}</p>
                            </div>
                        </div>
                    )}

                    <div className="flex flex-col-reverse sm:flex-row justify-end gap-3 mt-8 pt-6 border-t-2 border-slate-200 dark:border-slate-700">
                        <GreenhouseButton
                            text="انصراف"
                            variant="secondary"
                            onClick={handleClose}
                            disabled={internalLoading}
                            className="w-full sm:w-auto min-w-[140px] h-11"
                            type="button"
                        />
                        <GreenhouseButton
                            text={internalLoading ? "در حال ثبت..." : "ویرایش انبار"}
                            variant="primary"
                            type="submit"
                            loading={internalLoading}
                            className="w-full sm:w-auto min-w-[140px] h-11 shadow-lg hover:shadow-xl"
                        />
                    </div>
                </Form>
            </div>
        </Modal>
    );
}
