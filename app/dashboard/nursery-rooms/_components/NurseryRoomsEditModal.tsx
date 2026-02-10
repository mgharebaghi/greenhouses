"use client";

import { Modal, Form, Input, InputNumber, Select, DatePicker as AntDatePicker, AutoComplete } from "antd";
import DatePicker from "react-multi-date-picker";
import { useEffect, useState } from "react";
import DateObject from "react-date-object";
import persian from "react-date-object/calendars/persian";
import persian_fa from "react-date-object/locales/persian_fa";
import { updateNurseryRoom } from "@/app/lib/services/nurseryRooms";
import { CloseOutlined, HomeOutlined, CheckCircleOutlined, ExclamationCircleOutlined } from "@ant-design/icons";
import GreenhouseButton from "@/app/components/UI/GreenhouseButton";

interface NurseryRoomsEditModalProps {
    open: boolean;
    setOpen: (open: boolean) => void;
    setLoading: (loading: boolean) => void;
    data: any | null;
    refreshData: () => void;
}

export default function NurseryRoomsEditModal({
    open,
    setOpen,
    setLoading,
    data,
    refreshData
}: NurseryRoomsEditModalProps) {
    const [form] = Form.useForm();
    const [internalLoading, setInternalLoading] = useState(false);
    const [message, setMessage] = useState<{ status: "ok" | "error"; message: string } | null>(null);

    useEffect(() => {
        if (open && data) {
            // Prepare initial values
            const initialValues = {
                ...data,
                NurseryRoomCreatedAt: data.NurseryRoomCreatedAt ? new Date(data.NurseryRoomCreatedAt) : null
            };
            form.setFieldsValue(initialValues);
            setMessage(null);
        }
    }, [open, data, form]);

    const handleFinish = async (values: any) => {
        if (!data?.NurseryRoomID) return;

        setInternalLoading(true);
        setLoading(true);
        setMessage(null);

        // Date conversion
        if (values.NurseryRoomCreatedAt instanceof DateObject) {
            values.NurseryRoomCreatedAt = values.NurseryRoomCreatedAt.toDate();
        }

        const res = await updateNurseryRoom(data.NurseryRoomID, values);

        setLoading(false);
        setInternalLoading(false);

        if (res.status === "ok") {
            setMessage({ status: "ok", message: res.message });
            refreshData();
            setTimeout(() => {
                setOpen(false);
            }, 1000);
        } else {
            setMessage({ status: "error", message: res.message || "خطایی رخ داد" });
        }
    };

    const handleClose = () => {
        setOpen(false);
        setMessage(null);
    };

    // Shared input style
    const inputStyleClass = "rounded-xl border-2 border-slate-200 dark:border-slate-700 hover:border-emerald-300 dark:hover:border-emerald-700 focus:border-emerald-400 dark:focus:border-emerald-600 transition-all shadow-sm hover:shadow w-full dark:bg-slate-800 dark:text-white dark:placeholder-slate-500";

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
            <div className="relative px-6 py-6 bg-gradient-to-br from-blue-50 via-indigo-50/80 to-white dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 border-b border-blue-100 dark:border-slate-700">
                <button
                    onClick={handleClose}
                    className="absolute top-5 left-5 h-9 w-9 rounded-xl bg-white dark:bg-slate-800 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 border border-emerald-200 dark:border-slate-600 hover:border-emerald-300 dark:hover:border-emerald-700 transition-all flex items-center justify-center text-emerald-600 dark:text-emerald-500 hover:text-emerald-700 shadow-sm hover:shadow"
                    aria-label="بستن"
                >
                    <CloseOutlined className="text-sm" />
                </button>

                <div className="flex items-center gap-4">
                    <div className="relative">
                        <div className="h-14 w-14 rounded-2xl bg-gradient-to-br from-blue-500 via-blue-600 to-blue-700 shadow-lg flex items-center justify-center text-white">
                            <HomeOutlined className="text-2xl" />
                        </div>
                        <div className="absolute -bottom-1 -right-1 h-5 w-5 rounded-full bg-indigo-400 border-2 border-white dark:border-slate-800"></div>
                    </div>
                    <div>
                        <h3 className="font-bold text-2xl text-blue-900 dark:text-slate-100">ویرایش اطلاعات اتاق ریکاوری</h3>
                        <p className="text-sm text-blue-600/80 dark:text-slate-400 mt-1 flex items-center gap-1.5">
                            <span className="h-1.5 w-1.5 rounded-full bg-blue-400 animate-pulse"></span>
                            تغییر مشخصات و تنظیمات اتاق ریکاوری
                        </p>
                    </div>
                </div>
            </div>

            {/* Body */}
            <div className="px-6 py-6 bg-gradient-to-br from-white to-slate-50/30 dark:from-slate-900 dark:to-slate-950">
                <Form form={form} layout="vertical" onFinish={handleFinish} requiredMark={false} preserve={false}>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

                        {/* Basic Info */}
                        <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-5">
                            <Form.Item
                                name="NurseryRoomName"
                                label={<span className="text-sm font-semibold text-slate-700 dark:text-slate-300">نام اتاق <span className="text-rose-500">*</span></span>}
                                rules={[{ required: true, message: 'لطفا نام اتاق را وارد کنید' }]}
                                className="mb-0"
                            >
                                <Input placeholder="مثال: اتاق شماره 1" size="large" className={inputStyleClass} style={{ height: "46px" }} />
                            </Form.Item>

                            <Form.Item
                                name="NurseryRoomCode"
                                label={<span className="text-sm font-semibold text-slate-700 dark:text-slate-300">کد اتاق <span className="text-rose-500">*</span></span>}
                                rules={[{ required: true, message: 'لطفا کد اتاق را وارد کنید' }]}
                                className="mb-0"
                            >
                                <Input placeholder="مثال: NR-001" size="large" className={inputStyleClass} style={{ height: "46px" }} />
                            </Form.Item>
                        </div>

                        {/* Climate Info - Temp */}
                        <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-700/50 grid grid-cols-2 gap-4">
                            <div className="col-span-2 text-xs font-bold text-slate-500 dark:text-slate-400 mb-1">تنظیمات دما (C°)</div>
                            <Form.Item name="TemperatureMin" label="حداقل" className="mb-0">
                                <InputNumber className="w-full" size="large" />
                            </Form.Item>
                            <Form.Item name="TemperatureMax" label="حداکثر" className="mb-0">
                                <InputNumber className="w-full" size="large" />
                            </Form.Item>
                        </div>

                        {/* Climate Info - Humidity */}
                        <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-700/50 grid grid-cols-2 gap-4">
                            <div className="col-span-2 text-xs font-bold text-slate-500 dark:text-slate-400 mb-1">تنظیمات رطوبت (%)</div>
                            <Form.Item name="HumidityMin" label="حداقل" className="mb-0">
                                <InputNumber className="w-full" size="large" min={0} max={100} />
                            </Form.Item>
                            <Form.Item name="HumidityMax" label="حداکثر" className="mb-0">
                                <InputNumber className="w-full" size="large" min={0} max={100} />
                            </Form.Item>
                        </div>

                        {/* Lighting */}
                        <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-3 gap-5 border-t border-slate-100 dark:border-slate-800 pt-5 mt-2">
                            <Form.Item name="LightType" label={<span className="text-sm font-semibold text-slate-700 dark:text-slate-300">نوع نور</span>} className="mb-0">
                                <AutoComplete size="large" className="w-full" style={{ height: "46px" }} placeholder="انتخاب کنید">
                                    <Select.Option value="نور طبیعی">نور طبیعی</Select.Option>
                                    <Select.Option value="LED">LED</Select.Option>
                                    <Select.Option value="HPS">HPS</Select.Option>
                                    <Select.Option value="فلوروسنت">فلوروسنت</Select.Option>
                                </AutoComplete>
                            </Form.Item>

                            <Form.Item name="LightHoursPerDay" label={<span className="text-sm font-semibold text-slate-700 dark:text-slate-300">ساعات نوردهی</span>} className="mb-0">
                                <InputNumber size="large" className="w-full" style={{ height: "46px", paddingTop: "4px" }} min={0} max={24} step={0.5} />
                            </Form.Item>

                            <Form.Item name="CO2Range" label={<span className="text-sm font-semibold text-slate-700 dark:text-slate-300">محدوده CO2</span>} className="mb-0">
                                <Input size="large" className={inputStyleClass} style={{ height: "46px" }} placeholder="مثال: 400-800 ppm" />
                            </Form.Item>
                        </div>

                        {/* Other Info */}
                        <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-5">
                            <Form.Item name="StrelizationMethod" label={<span className="text-sm font-semibold text-slate-700 dark:text-slate-300">روش ضدعفونی</span>} className="mb-0">
                                <Input size="large" className={inputStyleClass} style={{ height: "46px" }} />
                            </Form.Item>

                            <Form.Item name="NurseryRoomCreatedAt" label={<span className="text-sm font-semibold text-slate-700 dark:text-slate-300">تاریخ تاسیس</span>} className="mb-0">
                                <DatePicker
                                    calendar={persian}
                                    locale={persian_fa}
                                    calendarPosition="bottom-right"
                                    inputClass={`${inputStyleClass} !h-[46px]`}
                                    containerClassName="w-full"
                                    value={form.getFieldValue("NurseryRoomCreatedAt")}
                                    onChange={(date) => {
                                        form.setFieldValue("NurseryRoomCreatedAt", date);
                                    }}
                                />
                            </Form.Item>
                        </div>

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
                            text={internalLoading ? "در حال ذخیره..." : "ثبت تغییرات"}
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
