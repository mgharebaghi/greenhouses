"use client";

import { Modal, Form, Input, InputNumber, Select } from "antd";
import DatePicker from "react-multi-date-picker";
import { useEffect, useState } from "react";
import DateObject from "react-date-object";
import persian from "react-date-object/calendars/persian";
import persian_fa from "react-date-object/locales/persian_fa";
import { createNurseryRoom } from "@/app/lib/services/nurseryRooms";
import { CloseOutlined, ExperimentOutlined, CheckCircleOutlined, ExclamationCircleOutlined } from "@ant-design/icons";
import GreenhouseButton from "@/app/components/UI/GreenhouseButton";

interface NurseryRoomsInsertModalProps {
    open: boolean;
    setOpen: (open: boolean) => void;
    setLoading: (loading: boolean) => void;
    setData: (data: any) => void;
    refreshData: () => void;
}

export default function NurseryRoomsInsertModal({ open, setOpen, setLoading, setData, refreshData }: NurseryRoomsInsertModalProps) {
    const [form] = Form.useForm();
    const [internalLoading, setInternalLoading] = useState(false);
    const [message, setMessage] = useState<{ status: "ok" | "error"; message: string } | null>(null);

    useEffect(() => {
        if (!open) {
            setMessage(null);
        }
    }, [open]);

    const handleFinish = async (values: any) => {
        setInternalLoading(true);
        setLoading(true);
        setMessage(null);

        // Date conversion
        if (values.NurseryRoomCreatedAt instanceof DateObject) {
            values.NurseryRoomCreatedAt = values.NurseryRoomCreatedAt.toDate();
        }

        const res = await createNurseryRoom(values);

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
            width={900}
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
                            <ExperimentOutlined className="text-2xl" />
                        </div>
                        <div className="absolute -bottom-1 -right-1 h-5 w-5 rounded-full bg-lime-400 border-2 border-white dark:border-slate-800"></div>
                    </div>
                    <div>
                        <h3 className="font-bold text-2xl text-emerald-900 dark:text-slate-100">افزودن اتاق نشاء جدید</h3>
                        <p className="text-sm text-emerald-600/80 dark:text-slate-400 mt-1 flex items-center gap-1.5">
                            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                            اطلاعات اتاق نشاء را با دقت وارد کنید
                        </p>
                    </div>
                </div>
            </div>

            {/* Body */}
            <div className="px-6 py-6 bg-gradient-to-br from-white to-slate-50/30 dark:from-slate-900 dark:to-slate-950">
                <Form form={form} layout="vertical" onFinish={handleFinish} requiredMark={false}>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">

                        <Form.Item
                            name="NurseryRoomCode"
                            label={<span className="text-sm font-semibold text-slate-700 dark:text-slate-300">کد اتاق <span className="text-rose-500">*</span></span>}
                            rules={[{ required: true, message: 'لطفا کد اتاق را وارد کنید' }]}
                            className="mb-0"
                        >
                            <Input placeholder="مثال: NR-01" size="large" className={inputStyleClass} style={inputStyle} />
                        </Form.Item>

                        <Form.Item
                            name="NurseryRoomName"
                            label={<span className="text-sm font-semibold text-slate-700 dark:text-slate-300">نام اتاق <span className="text-rose-500">*</span></span>}
                            rules={[{ required: true, message: 'لطفا نام اتاق را وارد کنید' }]}
                            className="mb-0 lg:col-span-2"
                        >
                            <Input placeholder="مثال: اتاق نشاء اصلی" size="large" className={inputStyleClass} style={inputStyle} />
                        </Form.Item>

                        <Form.Item name="TemperatureMin" label={<span className="text-sm font-semibold text-slate-700 dark:text-slate-300">حداقل دما</span>} className="mb-0">
                            <InputNumber className={inputStyleClass} style={{ ...inputStyle, width: "100%", paddingTop: "4px" }} placeholder="درجه" controls={false} />
                        </Form.Item>

                        <Form.Item name="TemperatureMax" label={<span className="text-sm font-semibold text-slate-700 dark:text-slate-300">حداکثر دما</span>} className="mb-0">
                            <InputNumber className={inputStyleClass} style={{ ...inputStyle, width: "100%", paddingTop: "4px" }} placeholder="درجه" controls={false} />
                        </Form.Item>

                        <Form.Item name="HumidityMin" label={<span className="text-sm font-semibold text-slate-700 dark:text-slate-300">حداقل رطوبت</span>} className="mb-0">
                            <InputNumber className={inputStyleClass} style={{ ...inputStyle, width: "100%", paddingTop: "4px" }} placeholder="درصد" controls={false} />
                        </Form.Item>

                        <Form.Item name="HumidityMax" label={<span className="text-sm font-semibold text-slate-700 dark:text-slate-300">حداکثر رطوبت</span>} className="mb-0">
                            <InputNumber className={inputStyleClass} style={{ ...inputStyle, width: "100%", paddingTop: "4px" }} placeholder="درصد" controls={false} />
                        </Form.Item>

                        <Form.Item name="LightType" label={<span className="text-sm font-semibold text-slate-700 dark:text-slate-300">نوع نورپردازی</span>} className="mb-0">
                            <Input placeholder="مثال: LED" size="large" className={inputStyleClass} style={inputStyle} />
                        </Form.Item>

                        <Form.Item name="LightHoursPerDay" label={<span className="text-sm font-semibold text-slate-700 dark:text-slate-300">ساعات نوردهی</span>} className="mb-0">
                            <InputNumber className={inputStyleClass} style={{ ...inputStyle, width: "100%", paddingTop: "4px" }} placeholder="ساعت" controls={false} />
                        </Form.Item>

                        <Form.Item name="CO2Range" label={<span className="text-sm font-semibold text-slate-700 dark:text-slate-300">محدوده CO2</span>} className="mb-0">
                            <Input placeholder="مثال: 400-800 ppm" size="large" className={inputStyleClass} style={inputStyle} />
                        </Form.Item>

                        <Form.Item name="StrelizationMethod" label={<span className="text-sm font-semibold text-slate-700 dark:text-slate-300">روش استریلیزاسیون</span>} className="mb-0 lg:col-span-2">
                            <Input placeholder="مثال: UV, شیمیایی" size="large" className={inputStyleClass} style={inputStyle} />
                        </Form.Item>

                        <Form.Item name="NurseryRoomCreatedAt" label={<span className="text-sm font-semibold text-slate-700 dark:text-slate-300">تاریخ احداث</span>} className="mb-0">
                            <DatePicker
                                calendar={persian}
                                locale={persian_fa}
                                calendarPosition="bottom-right"
                                inputClass={`${inputStyleClass} !h-[46px]`}
                                containerClassName="w-full"
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
                            text={internalLoading ? "در حال ثبت..." : "ثبت اتاق نشاء"}
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
