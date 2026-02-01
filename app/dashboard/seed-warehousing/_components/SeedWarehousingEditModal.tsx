"use client";

import { Modal, Form, Select, InputNumber, Radio, Input } from "antd";
import { useState, useEffect } from "react";
import DatePicker from "react-multi-date-picker";
import DateObject from "react-date-object";
import persian from "react-date-object/calendars/persian";
import persian_fa from "react-date-object/locales/persian_fa";
import { updateSeedWarehousing } from "@/app/lib/services/seedWarehousing";
import { CloseOutlined, ExperimentOutlined, CheckCircleOutlined, ExclamationCircleOutlined, EditOutlined } from "@ant-design/icons";
import GreenhouseButton from "@/app/components/UI/GreenhouseButton";

interface EditModalProps {
    open: boolean;
    onCancel: () => void;
    data: any;
    seedPackages: any[];
    warehouses: any[];
    onSuccess: () => void;
}

export default function SeedWarehousingEditModal({
    open,
    onCancel,
    data,
    seedPackages,
    warehouses,
    onSuccess,
}: EditModalProps) {
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState<{ status: "ok" | "error"; message: string } | null>(null);

    // Load initial data
    useEffect(() => {
        if (open && data) {
            form.setFieldsValue({
                ...data,
                TransactionDate: data.TransactionDate ? new Date(data.TransactionDate) : null,
            });
        }

        if (!open) {
            setMessage(null);
        }
    }, [open, data, form]);

    const handleFinish = async (values: any) => {
        setLoading(true);
        setMessage(null);

        try {
            const payload = {
                ...values,
                TransactionDate: values.TransactionDate instanceof DateObject
                    ? values.TransactionDate.toDate()
                    : values.TransactionDate, // existing Date or undefined
                PackageQuantity: Number(values.PackageQuantity),
            };

            const result = await updateSeedWarehousing(data.TransactionID, payload);

            if (result.success) {
                setMessage({ status: "ok", message: "تراکنش انبار با موفقیت ویرایش شد" });
                setTimeout(() => {
                    onSuccess();
                    onCancel();
                }, 1000);
            } else {
                setMessage({ status: "error", message: result.error || "خطای ناشناخته" });
            }
        } catch (error) {
            console.error("Validation failed:", error);
            setMessage({ status: "error", message: "خطایی در اعتبارسنجی رخ داد" });
        } finally {
            setLoading(false);
        }
    };

    const handleClose = () => {
        onCancel();
        setMessage(null);
    };

    const inputStyleClass = "rounded-xl border-2 border-slate-200 hover:border-emerald-300 focus:border-emerald-400 transition-all shadow-sm hover:shadow w-full";
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
                    className="absolute top-5 left-5 h-9 w-9 rounded-xl bg-white dark:bg-slate-800 hover:bg-emerald-50 dark:hover:bg-slate-700 border border-emerald-200 dark:border-slate-600 hover:border-emerald-300 transition-all flex items-center justify-center text-emerald-600 dark:text-emerald-500 hover:text-emerald-700 shadow-sm hover:shadow"
                    aria-label="بستن"
                    type="button"
                >
                    <CloseOutlined className="text-sm" />
                </button>

                <div className="flex items-center gap-4">
                    <div className="relative">
                        <div className="h-14 w-14 rounded-2xl bg-gradient-to-br from-blue-500 via-blue-600 to-blue-700 shadow-lg flex items-center justify-center text-white">
                            <EditOutlined className="text-2xl" />
                        </div>
                        <div className="absolute -bottom-1 -right-1 h-5 w-5 rounded-full bg-lime-400 border-2 border-white dark:border-slate-800"></div>
                    </div>
                    <div>
                        <h3 className="font-bold text-2xl text-slate-800 dark:text-slate-100">ویرایش تراکنش</h3>
                        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1 flex items-center gap-1.5">
                            <span className="h-1.5 w-1.5 rounded-full bg-blue-400 animate-pulse"></span>
                            ویرایش اطلاعات تراکنش انبار
                        </p>
                    </div>
                </div>
            </div>

            {/* Body */}
            <div className="px-6 py-6 bg-gradient-to-br from-white to-slate-50/30 dark:from-slate-900 dark:to-slate-950">
                <Form form={form} layout="vertical" onFinish={handleFinish}>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                        <Form.Item
                            name="SeedPackageID"
                            label={<span className="text-sm font-semibold text-slate-700 dark:text-slate-300">بسته بذر <span className="text-rose-500">*</span></span>}
                            rules={[{ required: true, message: "لطفا بسته بذر را انتخاب کنید" }]}
                            className="mb-0"
                        >
                            <Select
                                placeholder="انتخاب بسته بذر"
                                showSearch
                                optionFilterProp="label"
                                size="large"
                                className="w-full text-left"
                                style={{ height: "46px" }}
                                options={seedPackages.map((pkg) => ({
                                    label: `${pkg.SerialNumber} - ${pkg.PackageType}`,
                                    value: pkg.SeedPackageID,
                                }))}
                            />
                        </Form.Item>

                        <Form.Item
                            name="WarehouseID"
                            label={<span className="text-sm font-semibold text-slate-700 dark:text-slate-300">انبار <span className="text-rose-500">*</span></span>}
                            rules={[{ required: true, message: "لطفا انبار را انتخاب کنید" }]}
                            className="mb-0"
                        >
                            <Select
                                placeholder="انتخاب انبار"
                                size="large"
                                className="w-full text-left"
                                style={{ height: "46px" }}
                                options={warehouses.map((wh) => ({
                                    label: wh.WarehouseName,
                                    value: wh.WarehouseID,
                                }))}
                            />
                        </Form.Item>

                        <Form.Item
                            name="TransactionType"
                            label={<span className="text-sm font-semibold text-slate-700 dark:text-slate-300">نوع تراکنش <span className="text-rose-500">*</span></span>}
                            rules={[{ required: true, message: "لطفا نوع تراکنش را مشخص کنید" }]}
                            className="mb-0"
                        >
                            <Radio.Group className="w-full flex h-[46px]">
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
                        </Form.Item>

                        <Form.Item
                            name="PackageQuantity"
                            label={<span className="text-sm font-semibold text-slate-700 dark:text-slate-300">تعداد بسته <span className="text-rose-500">*</span></span>}
                            rules={[{ required: true, message: "لطفا تعداد را وارد کنید" }]}
                            className="mb-0"
                        >
                            <InputNumber
                                className={`${inputStyleClass} dark:bg-slate-800 dark:border-slate-700 dark:text-white dark:placeholder-slate-500`}
                                style={{ ...inputStyle, width: "100%", paddingTop: "4px" }}
                                min={1}
                                placeholder="تعداد"
                                controls={false}
                            />
                        </Form.Item>

                        <Form.Item name="TransactionDate" label={<span className="text-sm font-semibold text-slate-700 dark:text-slate-300">تاریخ تراکنش</span>} className="mb-0">
                            <DatePicker
                                calendar={persian}
                                locale={persian_fa}
                                calendarPosition="bottom-right"
                                inputClass={`${inputStyleClass} !h-[46px] dark:bg-slate-800 dark:border-slate-700 dark:text-white`}
                                containerClassName="w-full"
                            />
                        </Form.Item>

                        <Form.Item name="DestinationType" label={<span className="text-sm font-semibold text-slate-700 dark:text-slate-300">مقصد/منبع</span>} className="mb-0">
                            <Input placeholder="مثال: کاشت در گلخانه ۱" size="large" className={`${inputStyleClass} dark:bg-slate-800 dark:border-slate-700 dark:text-white dark:placeholder-slate-500`} style={inputStyle} />
                        </Form.Item>

                        <Form.Item name="RecordedBy" label={<span className="text-sm font-semibold text-slate-700 dark:text-slate-300">ثبت کننده</span>} className="mb-0 sm:col-span-2">
                            <Input placeholder="نام شخص ثبت کننده" size="large" className={`${inputStyleClass} dark:bg-slate-800 dark:border-slate-700 dark:text-white dark:placeholder-slate-500`} style={inputStyle} />
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
                            disabled={loading}
                            className="w-full sm:w-auto min-w-[140px] h-11"
                            type="button"
                        />
                        <GreenhouseButton
                            text={loading ? "در حال ذخیره..." : "ذخیره تغییرات"}
                            variant="primary"
                            type="submit"
                            loading={loading}
                            className="w-full sm:w-auto min-w-[140px] h-11 shadow-lg hover:shadow-xl"
                        />
                    </div>
                </Form>
            </div>
        </Modal>
    );
}
