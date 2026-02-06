"use client";

import { Modal, Form, Select, Input, InputNumber, Switch } from "antd";
import { useState, useEffect } from "react";
import { createGraftingOperation } from "@/app/lib/services/grafting/operation/create";
import { CloseOutlined, ExperimentOutlined, CheckCircleOutlined, ExclamationCircleOutlined } from "@ant-design/icons";
import GreenhouseButton from "@/app/components/UI/GreenhouseButton";

interface GraftingOperationInsertModalProps {
    open: boolean;
    setOpen: (open: boolean) => void;
    setLoading: (loading: boolean) => void;
    refreshData: () => void;
    options: {
        seeds: { label: string, value: number }[];
        rootstocks: { label: string, value: number }[];
    };
}

export default function GraftingOperationInsertModal({
    open,
    setOpen,
    setLoading,
    refreshData,
    options
}: GraftingOperationInsertModalProps) {
    const [form] = Form.useForm();
    const [internalLoading, setInternalLoading] = useState(false);
    const [messageState, setMessageState] = useState<{ status: "ok" | "error"; message: string } | null>(null);

    useEffect(() => {
        if (!open) {
            setMessageState(null);
        }
    }, [open]);

    const handleFinish = async (values: any) => {
        setInternalLoading(true);
        setLoading(true);
        setMessageState(null);

        try {
            const result = await createGraftingOperation(values);

            if (result.status === 'success') {
                setMessageState({ status: "ok", message: result.message });
                setTimeout(() => {
                    setOpen(false);
                    refreshData();
                }, 1000);
            } else {
                setMessageState({ status: "error", message: result.message });
            }
        } catch (error) {
            setMessageState({ status: "error", message: "خطا در ثبت اطلاعات" });
        } finally {
            setInternalLoading(false);
            setLoading(false);
        }
    };

    const handleClose = () => {
        setOpen(false);
        setMessageState(null);
    };

    // Shared input style class
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
                    </div>
                    <div>
                        <h3 className="font-bold text-2xl text-emerald-900 dark:text-slate-100">ثبت عملیات پیوند جدید</h3>
                        <p className="text-sm text-emerald-600/80 dark:text-slate-400 mt-1 flex items-center gap-1.5">
                            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                            اطلاعات پیوند را با دقت وارد کنید
                        </p>
                    </div>
                </div>
            </div>

            {/* Body */}
            <div className="px-6 py-6 bg-gradient-to-br from-white to-slate-50/30 dark:from-slate-900 dark:to-slate-950">
                <Form form={form} layout="vertical" onFinish={handleFinish} requiredMark={false} preserve={false}>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        <Form.Item
                            name="NurserySeedID"
                            label={<span className="text-sm font-semibold text-slate-700 dark:text-slate-300">نشاء <span className="text-rose-500">*</span></span>}
                            rules={[{ required: true, message: 'لطفاً پیوندک را انتخاب کنید' }]}
                            className="mb-0"
                        >
                            <Select
                                options={options.seeds}
                                placeholder="انتخاب کنید"
                                showSearch
                                filterOption={(input, option) =>
                                    (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
                                }
                                size="large"
                                className="w-full"
                                style={{ height: "46px" }}
                            />
                        </Form.Item>

                        <Form.Item
                            name="RootstockID"
                            label={<span className="text-sm font-semibold text-slate-700 dark:text-slate-300">پایه <span className="text-rose-500">*</span></span>}
                            rules={[{ required: true, message: 'لطفاً گیاه پایه را انتخاب کنید' }]}
                            className="mb-0"
                        >
                            <Select
                                options={options.rootstocks}
                                placeholder="انتخاب کنید"
                                showSearch
                                filterOption={(input, option) =>
                                    (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
                                }
                                size="large"
                                className="w-full"
                                style={{ height: "46px" }}
                            />
                        </Form.Item>

                        <Form.Item
                            name="GraftingMethod"
                            label={<span className="text-sm font-semibold text-slate-700 dark:text-slate-300">روش پیوند</span>}
                            className="mb-0"
                        >
                            <Select
                                placeholder="انتخاب کنید"
                                options={[
                                    { label: 'پیوند حفره‌ای (Hole Insertion)', value: 'Hole Insertion' },
                                    { label: 'پیوند نیم‌نیم (Tongue Approach)', value: 'Tongue Approach' },
                                    { label: 'پیوند اسپلایس (Splice)', value: 'Splice' },
                                    { label: 'سایر', value: 'Other' },
                                ]}
                                size="large"
                                className="w-full"
                                style={{ height: "46px" }}
                            />
                        </Form.Item>

                        <Form.Item
                            name="GraftedNumber"
                            label={<span className="text-sm font-semibold text-slate-700 dark:text-slate-300">تعداد پیوند زده شده</span>}
                            className="mb-0"
                        >
                            <InputNumber
                                className={inputStyleClass}
                                style={{ ...inputStyle, width: "100%", paddingTop: "4px" }}
                                min={0}
                                placeholder="عدد"
                                controls={false}
                            />
                        </Form.Item>

                        <Form.Item
                            name="SucceedGrafted"
                            label={<span className="text-sm font-semibold text-slate-700 dark:text-slate-300">تعداد موفق</span>}
                            className="mb-0"
                        >
                            <InputNumber
                                className={inputStyleClass}
                                style={{ ...inputStyle, width: "100%", paddingTop: "4px" }}
                                min={0}
                                placeholder="عدد"
                                controls={false}
                            />
                        </Form.Item>

                        <Form.Item
                            name="OperatorName"
                            label={<span className="text-sm font-semibold text-slate-700 dark:text-slate-300">نام مجری</span>}
                            className="mb-0"
                        >
                            <Input placeholder="نام شخص انجام دهنده" size="large" className={inputStyleClass} style={inputStyle} />
                        </Form.Item>

                        <Form.Item
                            name="InitialResult"
                            label={<span className="text-sm font-semibold text-slate-700 dark:text-slate-300">نتیجه اولیه</span>}
                            className="mb-0"
                        >
                            <Select
                                placeholder="وضعیت اولیه"
                                options={[
                                    { label: 'موفق', value: 'Success' },
                                    { label: 'ناموفق', value: 'Failure' },
                                    { label: 'نامشخص', value: 'Unknown' },
                                ]}
                                size="large"
                                className="w-full"
                                style={{ height: "46px" }}
                            />
                        </Form.Item>
                    </div>

                    <Form.Item
                        name="GraftNotes"
                        label={<span className="text-sm font-semibold text-slate-700 dark:text-slate-300">یادداشت</span>}
                        className="mb-0 mt-5"
                    >
                        <Input.TextArea
                            rows={3}
                            placeholder="توضیحات تکمیلی..."
                            className="!rounded-xl !border-2 !border-slate-200 dark:!border-slate-700 hover:!border-emerald-300 dark:hover:!border-emerald-700 focus:!border-emerald-400 dark:focus:!border-emerald-600 transition-all shadow-sm hover:shadow"
                        />
                    </Form.Item>


                    {messageState && (
                        <div
                            className={`mt-5 p-4 rounded-xl border-2 flex items-start gap-3 animate-in fade-in slide-in-from-top-3 duration-300 shadow-sm ${messageState.status === "ok"
                                ? "bg-gradient-to-br from-emerald-50 to-emerald-100/50 dark:from-emerald-900/30 dark:to-emerald-900/10 border-emerald-300 dark:border-emerald-800 text-emerald-900 dark:text-emerald-300"
                                : "bg-gradient-to-br from-rose-50 to-rose-100/50 dark:from-rose-900/30 dark:to-rose-900/10 border-rose-300 dark:border-rose-800 text-rose-900 dark:text-rose-300"
                                }`}
                        >
                            <div className={`mt-0.5 p-1.5 rounded-lg ${messageState.status === "ok" ? "bg-emerald-200/50 dark:bg-emerald-800/50" : "bg-rose-200/50 dark:bg-rose-800/50"}`}>
                                {messageState.status === "ok" ? (
                                    <CheckCircleOutlined className="text-lg text-emerald-700 dark:text-emerald-400" />
                                ) : (
                                    <ExclamationCircleOutlined className="text-lg text-rose-700 dark:text-rose-400" />
                                )}
                            </div>
                            <div className="flex-1">
                                <p className="text-sm font-semibold mb-0.5">{messageState.status === "ok" ? "موفقیت‌آمیز" : "خطا"}</p>
                                <p className="text-sm leading-relaxed opacity-90">{messageState.message}</p>
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
                            text={internalLoading ? "در حال ثبت..." : "ثبت عملیات"}
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
