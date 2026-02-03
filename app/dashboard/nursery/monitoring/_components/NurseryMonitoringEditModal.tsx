"use client";

import { Modal, Form, Select, DatePicker as AntDatePicker, InputNumber, Switch, Input } from "antd";
import DatePicker from "react-multi-date-picker";
import { useEffect, useState } from "react";
import DateObject from "react-date-object";
import persian from "react-date-object/calendars/persian";
import persian_fa from "react-date-object/locales/persian_fa";
import { updateCareLog } from "@/app/lib/services/nursery/monitoring/update";
import { CloseOutlined, MonitorOutlined, CheckCircleOutlined, ExclamationCircleOutlined, ExperimentOutlined } from "@ant-design/icons";
import GreenhouseButton from "@/app/components/UI/GreenhouseButton";

interface NurseryMonitoringEditModalProps {
    open: boolean;
    setOpen: (open: boolean) => void;
    setLoading: (loading: boolean) => void;
    data: any;
    nurserySeeds: any[];
    refreshData: () => void;
}

export default function NurseryMonitoringEditModal({
    open,
    setOpen,
    setLoading,
    data,
    nurserySeeds,
    refreshData
}: NurseryMonitoringEditModalProps) {
    const [form] = Form.useForm();
    const [internalLoading, setInternalLoading] = useState(false);
    const [message, setMessage] = useState<{ status: "ok" | "error"; message: string } | null>(null);
    const [selectedSeed, setSelectedSeed] = useState<any>(null);

    useEffect(() => {
        if (open && data) {
            form.setFieldsValue({
                ...data,
                CareDate: new DateObject({ date: data.CareDate, calendar: persian, locale: persian_fa }),
                NurserySeedID: data.NurserySeedID
            });

            // Find and set selected seed for preview
            const seed = nurserySeeds.find(s => s.NurserySeedID === data.NurserySeedID);
            setSelectedSeed(seed || data.NurserySeed); // Fallback to nested object if in data

            setMessage(null);
        }
    }, [open, data, form, nurserySeeds]);

    const handleSeedChange = (value: number) => {
        const seed = nurserySeeds.find(s => s.NurserySeedID === value);
        setSelectedSeed(seed);
    };

    const handleFinish = async (values: any) => {
        setInternalLoading(true);
        setLoading(true);
        setMessage(null);

        // Date conversion
        if (values.CareDate instanceof DateObject) {
            values.CareDate = values.CareDate.toDate();
        }

        const res = await updateCareLog({
            ...values,
            CareLogID: data.CareLogID
        });

        setLoading(false);
        setInternalLoading(false);

        if (res.success) {
            setMessage({ status: "ok", message: "گزارش پایش با موفقیت ویرایش شد" });
            refreshData();
            setTimeout(() => {
                setOpen(false);
            }, 1000);
        } else {
            setMessage({ status: "error", message: res.error || "خطایی رخ داد" });
        }
    };

    const handleClose = () => {
        setOpen(false);
        setMessage(null);
    };

    // Shared input style
    const inputStyleClass = "rounded-xl border-2 border-slate-200 dark:border-slate-700 hover:border-amber-300 dark:hover:border-amber-700 focus:border-amber-400 dark:focus:border-amber-600 transition-all shadow-sm hover:shadow w-full dark:bg-slate-800 dark:text-white dark:placeholder-slate-500";

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
            <div className="relative px-6 py-6 bg-gradient-to-br from-amber-50 via-orange-50/80 to-white dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 border-b border-amber-100 dark:border-slate-700">
                <button
                    onClick={handleClose}
                    className="absolute top-5 left-5 h-9 w-9 rounded-xl bg-white dark:bg-slate-800 hover:bg-amber-50 dark:hover:bg-amber-900/20 border border-amber-200 dark:border-slate-600 hover:border-amber-300 dark:hover:border-amber-700 transition-all flex items-center justify-center text-amber-600 dark:text-amber-500 hover:text-amber-700 shadow-sm hover:shadow"
                    aria-label="بستن"
                >
                    <CloseOutlined className="text-sm" />
                </button>

                <div className="flex items-center gap-4">
                    <div className="relative">
                        <div className="h-14 w-14 rounded-2xl bg-gradient-to-br from-amber-500 via-amber-600 to-amber-700 shadow-lg flex items-center justify-center text-white">
                            <MonitorOutlined className="text-2xl" />
                        </div>
                        <div className="absolute -bottom-1 -right-1 h-5 w-5 rounded-full bg-blue-400 border-2 border-white dark:border-slate-800"></div>
                    </div>
                    <div>
                        <h3 className="font-bold text-2xl text-amber-900 dark:text-slate-100">ویرایش پایش</h3>
                        <p className="text-sm text-amber-600/80 dark:text-slate-400 mt-1 flex items-center gap-1.5">
                            <span className="h-1.5 w-1.5 rounded-full bg-amber-400 animate-pulse"></span>
                            بروزرسانی اطلاعات ثبت شده
                        </p>
                    </div>
                </div>
            </div>

            {/* Body */}
            <div className="px-6 py-6 bg-gradient-to-br from-white to-slate-50/30 dark:from-slate-900 dark:to-slate-950">
                <Form form={form} layout="vertical" onFinish={handleFinish} requiredMark={false}>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                        {/* Seed Selection */}
                        <div className="md:col-span-2 flex flex-col gap-2">
                            <Form.Item
                                name="NurserySeedID"
                                label={<span className="text-sm font-semibold text-slate-700 dark:text-slate-300">انتخاب نشاء <span className="text-rose-500">*</span></span>}
                                rules={[{ required: true, message: 'لطفا نشاء را انتخاب کنید' }]}
                                className="mb-0"
                            >
                                <Select
                                    placeholder="شماره سریال، گونه یا بچ کد را جستجو کنید..."
                                    onChange={handleSeedChange}
                                    showSearch
                                    optionFilterProp="children"
                                    size="large"
                                    className="w-full"
                                    style={{ height: "46px" }}
                                >
                                    {nurserySeeds.map(item => (
                                        <Select.Option key={item.NurserySeedID} value={item.NurserySeedID}>
                                            #{item.NurserySeedID} - {item.SeedPackage?.SeedBatch?.PlantVarities?.VarietyName} ({item.SeedPackage?.SerialNumber})
                                        </Select.Option>
                                    ))}
                                </Select>
                            </Form.Item>

                            {/* Selected Seed Info Preview */}
                            {selectedSeed && (
                                <div className="mt-2 relative overflow-hidden rounded-xl border border-amber-100 dark:border-amber-800 bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-950/40 dark:to-orange-950/40 p-3 transition-all animate-in fade-in slide-in-from-top-1">
                                    <div className="flex gap-3 items-center">
                                        <div className="h-10 w-10 bg-white dark:bg-slate-800 rounded-lg flex items-center justify-center text-amber-500 shadow-sm">
                                            <ExperimentOutlined />
                                        </div>
                                        <div className="flex flex-col">
                                            <span className="text-xs text-slate-500 dark:text-slate-400">بچ کد: {selectedSeed.SeedPackage?.SeedBatch?.BatchCode}</span>
                                            <span className="text-sm font-bold text-slate-700 dark:text-slate-200">{selectedSeed.SeedPackage?.SeedBatch?.PlantVarities?.VarietyName}</span>
                                            <span className="text-xs text-slate-500">اتاق: {selectedSeed.NurseryRoom?.NurseryRoomName}</span>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Care Type & Date */}
                        <Form.Item name="CareType" label={<span className="text-sm font-semibold text-slate-700 dark:text-slate-300">نوع مراقبت <span className="text-rose-500">*</span></span>} rules={[{ required: true, message: 'الزامی' }]} className="mb-0">
                            <Select size="large" className="w-full" style={{ height: "46px" }} placeholder="انتخاب کنید...">
                                <Select.Option value="Watering">آبیاری</Select.Option>
                                <Select.Option value="Fertilization">کوددهی</Select.Option>
                                <Select.Option value="PestControl">آفت‌کشی</Select.Option>
                                <Select.Option value="Pruning">هرس</Select.Option>
                                <Select.Option value="Inspection">بازرسی دوره ای</Select.Option>
                                <Select.Option value="Other">سایر</Select.Option>
                            </Select>
                        </Form.Item>

                        <Form.Item name="CareDate" label={<span className="text-sm font-semibold text-slate-700 dark:text-slate-300">تاریخ انجام <span className="text-rose-500">*</span></span>} rules={[{ required: true, message: 'الزامی' }]} className="mb-0">
                            <DatePicker
                                calendar={persian}
                                locale={persian_fa}
                                calendarPosition="bottom-right"
                                inputClass={`${inputStyleClass} !h-[46px]`}
                                containerClassName="w-full"
                            />
                        </Form.Item>

                        {/* Details */}
                        <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-4 border-t border-slate-100 dark:border-slate-800 pt-4">
                            <Form.Item name="MaterialUsed" label={<span className="text-sm font-semibold text-slate-700 dark:text-slate-300">مواد مصرفی (کود/سم)</span>} className="mb-0">
                                <Input size="large" className="w-full rounded-xl" style={{ height: "46px" }} placeholder="نام ماده..." />
                            </Form.Item>
                            <Form.Item name="MaterialDose" label={<span className="text-sm font-semibold text-slate-700 dark:text-slate-300">دوز/مقدار مصرف</span>} className="mb-0">
                                <Input size="large" className="w-full rounded-xl" style={{ height: "46px" }} placeholder="مثلا 2 لیتر در هزار..." />
                            </Form.Item>
                        </div>

                        <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-3 gap-4">
                            <Form.Item name="RoomTemperature" label={<span className="text-sm font-semibold text-slate-700 dark:text-slate-300">دمای محیط (C°)</span>} className="mb-0">
                                <InputNumber size="large" className="w-full rounded-xl" style={{ height: "46px", paddingTop: "4px" }} />
                            </Form.Item>
                            <Form.Item name="RoomHumidity" label={<span className="text-sm font-semibold text-slate-700 dark:text-slate-300">رطوبت محیط (%)</span>} className="mb-0">
                                <InputNumber size="large" className="w-full rounded-xl" style={{ height: "46px", paddingTop: "4px" }} />
                            </Form.Item>
                            <Form.Item name="SupervisorName" label={<span className="text-sm font-semibold text-slate-700 dark:text-slate-300">نام ناظر/انجام دهنده</span>} className="mb-0">
                                <Input size="large" className="w-full rounded-xl" style={{ height: "46px" }} />
                            </Form.Item>
                        </div>

                        <Form.Item name="CareNote" label={<span className="text-sm font-semibold text-slate-700 dark:text-slate-300">توضیحات تکمیلی</span>} className="mb-0 md:col-span-2">
                            <Input.TextArea rows={3} className="w-full rounded-xl" placeholder="یادداشت..." />
                        </Form.Item>

                    </div>

                    {message && (
                        <div
                            className={`mt-5 p-4 rounded-xl border-2 flex items-start gap-3 animate-in fade-in slide-in-from-top-3 duration-300 shadow-sm ${message.status === "ok"
                                ? "bg-gradient-to-br from-amber-50 to-amber-100/50 dark:from-amber-900/30 dark:to-amber-900/10 border-amber-300 dark:border-amber-800 text-amber-900 dark:text-amber-300"
                                : "bg-gradient-to-br from-rose-50 to-rose-100/50 dark:from-rose-900/30 dark:to-rose-900/10 border-rose-300 dark:border-rose-800 text-rose-900 dark:text-rose-300"
                                }`}
                        >
                            <div className={`mt-0.5 p-1.5 rounded-lg ${message.status === "ok" ? "bg-amber-200/50 dark:bg-amber-800/50" : "bg-rose-200/50 dark:bg-rose-800/50"}`}>
                                {message.status === "ok" ? (
                                    <CheckCircleOutlined className="text-lg text-amber-700 dark:text-amber-400" />
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
                            text={internalLoading ? "در حال ویرایش..." : "ویرایش پایش"}
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
