"use client";

import { Modal, Form, Select, InputNumber, Input } from "antd";
import { useState, useEffect } from "react";
import GreenhouseButton from "@/app/components/UI/GreenhouseButton";
import { CloseOutlined, ExperimentOutlined, CheckCircleOutlined, ExclamationCircleOutlined, CheckOutlined } from "@ant-design/icons";
import { updateRootStockPlant } from "@/app/lib/services/grafting/rootstock/update";
import DatePicker from "react-multi-date-picker";
import DateObject from "react-date-object";
import persian from "react-date-object/calendars/persian";
import persian_fa from "react-date-object/locales/persian_fa";

interface RootStockEditModalProps {
    open: boolean;
    setOpen: (open: boolean) => void;
    setLoading: (loading: boolean) => void;
    data: any;
    refreshData: () => void;
    options: {
        varieties: { label: string, value: number }[];
        suppliers: { label: string, value: number }[];
    };
}

export default function RootStockEditModal({
    open,
    setOpen,
    setLoading,
    data,
    refreshData,
    options
}: RootStockEditModalProps) {
    const [form] = Form.useForm();
    const [internalLoading, setInternalLoading] = useState(false);
    const [message, setMessage] = useState<{ status: "ok" | "error"; message: string } | null>(null);

    useEffect(() => {
        if (open && data) {
            form.setFieldsValue({
                ...data,
                ProductionDate: data.ProductionDate ? new DateObject(new Date(data.ProductionDate)).convert(persian, persian_fa) : null
            });
            setMessage(null);
        }
    }, [open, data, form]);

    const onFinish = async (values: any) => {
        if (!data) return;
        setInternalLoading(true);
        setLoading(true);
        setMessage(null);

        // Convert Jalali date to JS Date
        if (values.ProductionDate instanceof DateObject) {
            values.ProductionDate = values.ProductionDate.toDate();
        }

        const finalValues = {
            ...values,
            RootstockID: data.RootstockID
        };

        const res = await updateRootStockPlant(finalValues);

        setLoading(false);
        setInternalLoading(false);

        if (res.success) {
            setMessage({ status: "ok", message: "ویرایش با موفقیت انجام شد" });
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
    const inputStyleClass = "rounded-xl border-2 border-slate-200 dark:border-slate-700 hover:border-emerald-300 dark:hover:border-emerald-700 focus:border-emerald-400 dark:focus:border-emerald-600 transition-all shadow-sm hover:shadow w-full dark:bg-slate-800 dark:text-white dark:placeholder-slate-500";

    return (
        <Modal
            open={open}
            onCancel={handleClose}
            footer={null}
            closeIcon={null}
            centered
            width={800}
            className="!p-0"
            styles={{
                content: {
                    padding: 0,
                    borderRadius: "1.25rem",
                    overflow: "hidden",
                },
            }}
        >
            {/* Header */}
            <div className="relative px-6 py-6 bg-gradient-to-br from-emerald-50 via-lime-50/80 to-white dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 border-b border-emerald-100 dark:border-slate-700">
                <button
                    onClick={handleClose}
                    className="absolute top-5 left-5 h-9 w-9 rounded-xl bg-white dark:bg-slate-800 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 border border-emerald-200 dark:border-slate-600 hover:border-emerald-300 dark:hover:border-emerald-700 transition-all flex items-center justify-center text-emerald-600 dark:text-emerald-500 hover:text-emerald-700 shadow-sm hover:shadow"
                >
                    <CloseOutlined className="text-sm" />
                </button>

                <div className="flex items-center gap-4">
                    <div className="h-14 w-14 rounded-2xl bg-gradient-to-br from-emerald-500 via-emerald-600 to-emerald-700 shadow-lg flex items-center justify-center text-white">
                        <ExperimentOutlined className="text-2xl" />
                    </div>
                    <div>
                        <h3 className="font-bold text-2xl text-emerald-900 dark:text-slate-100">ویرایش گیاه پایه</h3>
                        <p className="text-sm text-emerald-600/80 dark:text-slate-400 mt-1">
                            ویرایش اطلاعات گیاه پایه
                        </p>
                    </div>
                </div>
            </div>

            {/* Body */}
            <div className="px-6 py-6 bg-white dark:bg-slate-900">
                <Form
                    form={form}
                    layout="vertical"
                    onFinish={onFinish}
                >
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <Form.Item
                            name="PlantVariety"
                            label="گونه گیاهی"
                            rules={[{ required: true, message: 'لطفا گونه را انتخاب کنید' }]}
                        >
                            <Select
                                options={options.varieties}
                                placeholder="انتخاب گونه"
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
                            name="SupplierID"
                            label="تامین کننده"
                            rules={[{ required: true, message: 'لطفا تامین کننده را انتخاب کنید' }]}
                        >
                            <Select
                                options={options.suppliers}
                                placeholder="انتخاب تامین کننده"
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
                            name="BatchCode"
                            label="بچ کد"
                            rules={[{ required: true, message: 'لطفا بچ کد را وارد کنید' }]}
                        >
                            <Input size="large" className="rounded-xl w-full" style={{ height: "46px" }} />
                        </Form.Item>

                        <Form.Item
                            name="ProductionDate"
                            label="تاریخ تولید"
                            rules={[{ required: true, message: 'لطفا تاریخ را وارد کنید' }]}
                        >
                            <DatePicker
                                calendar={persian}
                                locale={persian_fa}
                                calendarPosition="bottom-right"
                                inputClass={`${inputStyleClass} !h-[46px] px-3`}
                                containerClassName="w-full"
                            />
                        </Form.Item>

                        <Form.Item
                            name="StemDiameter"
                            label="قطر ساقه (mm)"
                            rules={[{ required: true, message: 'لطفا قطر ساقه را وارد کنید' }]}
                        >
                            <InputNumber className="w-full !rounded-xl" size="large" step={0.1} style={{ height: "46px", paddingTop: "4px" }} />
                        </Form.Item>

                        <Form.Item
                            name="HealthStatus"
                            label="وضعیت سلامت"
                        >
                            <Select size="large" className="w-full" style={{ height: "46px" }}>
                                <Select.Option value="Healthy">سالم</Select.Option>
                                <Select.Option value="Sick">بیمار</Select.Option>
                                <Select.Option value="Recovering">در حال بهبود</Select.Option>
                            </Select>
                        </Form.Item>

                        <Form.Item
                            name="GrowthStage"
                            label="مرحله رشد"
                        >
                            <Select size="large" className="w-full" style={{ height: "46px" }}>
                                <Select.Option value="Seedling">نشاء</Select.Option>
                                <Select.Option value="Growing">در حال رشد</Select.Option>
                                <Select.Option value="ReadyToGraft">آماده پیوند</Select.Option>
                            </Select>
                        </Form.Item>
                    </div>

                    {message && (
                        <div
                            className={`mt-5 p-4 rounded-xl border-2 flex items-start gap-3 animate-in fade-in slide-in-from-top-3 duration-300 shadow-sm ${message.status === "ok"
                                ? "bg-gradient-to-br from-emerald-50 to-emerald-100/50 border-emerald-300 text-emerald-900"
                                : "bg-gradient-to-br from-rose-50 to-rose-100/50 border-rose-300 text-rose-900"
                                }`}
                        >
                            {message.status === "ok" ? <CheckCircleOutlined /> : <ExclamationCircleOutlined />}
                            <p>{message.message}</p>
                        </div>
                    )}

                    <div className="flex justify-end gap-2 mt-8 pt-4 border-t border-slate-100">
                        <GreenhouseButton
                            text="انصراف"
                            variant="secondary"
                            onClick={handleClose}
                            disabled={internalLoading}
                            type="button"
                        />
                        <GreenhouseButton
                            text={internalLoading ? "در حال ثبت..." : "ثبت تغییرات"}
                            variant="primary"
                            type="submit"
                            loading={internalLoading}
                            icon={<CheckOutlined />}
                        />
                    </div>
                </Form>
            </div>
        </Modal>
    );
}
