"use client";

import { Modal, Form, Input, Select } from "antd";
import { useEffect, useState } from "react";
import DatePicker from "react-multi-date-picker";
import persian from "react-date-object/calendars/persian";
import persian_fa from "react-date-object/locales/persian_fa";
import { updateSeedBatch, SeedBatchCreateRes, getAllSeedBatches } from "@/app/lib/services/seedBatch";
import { getSuppliers } from "@/app/lib/services/suppliers";
import { getPlantVarieties } from "@/app/lib/services/varities";
import {
    CloseOutlined,
    EditOutlined,
    GoldOutlined,
    CheckCircleOutlined,
    ExclamationCircleOutlined,
} from "@ant-design/icons";
import GreenhouseButton from "@/app/components/UI/GreenhouseButton";

type ModalMsg = {
    status: "ok" | "error";
    message: string;
};

type SelectOptions = {
    value: number;
    label: string;
};

export type EditModalProps = {
    isOpen: boolean;
    onClose?: () => void;
    data?: any;
    setMainLoading?: (loading: boolean) => void;
    setMainData?: (data: any[]) => void;
};

export default function SeedBatchEditModal(props: EditModalProps) {
    const [loading, setLoading] = useState(false);
    const [modalMsg, setModalMsg] = useState<ModalMsg | null>(null);
    const [suppliers, setSuppliers] = useState<SelectOptions[]>([]);
    const [varieties, setVarieties] = useState<SelectOptions[]>([]);
    const [dropdownsLoading, setDropdownsLoading] = useState(false);
    const [mounted, setMounted] = useState(false);
    const [form] = Form.useForm();

    useEffect(() => {
        setMounted(true);
    }, []);

    useEffect(() => {
        if (props.isOpen && props.data) {
            setModalMsg(null);
            fetchDropdowns();

            form.setFieldsValue({
                BatchCode: props.data.BatchCode,
                ProducerID: props.data.ProducerID,
                CropVariety: props.data.CropVariety,
                GerminationRate: props.data.GerminationRate,
                PurityPercent: props.data.PurityPercent,
                QualityGrade: props.data.QualityGrade,
                BatchNotes: props.data.BatchNotes,
                // Dates need to be handled carefully. If using DatePicker, it accepts Date object or string.
                ProductionDate: props.data.ProductionDate ? new Date(props.data.ProductionDate) : null,
                ExpirationDate: props.data.ExpirationDate ? new Date(props.data.ExpirationDate) : null,
            });
        }
    }, [props.isOpen, props.data, form]);

    const fetchDropdowns = async () => {
        setDropdownsLoading(true);
        try {
            const [suppliersRes, varietiesRes] = await Promise.all([
                getSuppliers(),
                getPlantVarieties()
            ]);

            if (suppliersRes) {
                setSuppliers(suppliersRes.map((s: any) => {
                    const company = s.CompanyName ? s.CompanyName.toString().trim() : "";
                    const first = s.FirstName ? s.FirstName.toString().trim() : "";
                    const last = s.LastName ? s.LastName.toString().trim() : "";
                    const fullName = `${first} ${last}`.trim();
                    const isCompanyValid = company.length > 0 && company !== "-";
                    return {
                        value: s.ID,
                        label: isCompanyValid ? company : (fullName.length > 0 ? fullName : "نامشخص")
                    };
                }));
            }
            if (varietiesRes) {
                setVarieties(varietiesRes.map((v: any) => ({ value: v.VarietyID, label: v.VarietyName })));
            }
        } catch (error) {
            console.error("Failed to fetch dropdown data", error);
        } finally {
            setDropdownsLoading(false);
        }
    };

    const fields = [
        { name: "BatchCode", label: "کد بذر", placeholder: "کد بذر را وارد کنید", required: true, type: "number", icon: "🔢" },
        { name: "ProducerID", label: "تولید کننده", placeholder: "انتخاب تولید کننده", required: true, type: "select", options: suppliers, icon: "🏭" },
        { name: "CropVariety", label: "گونه گیاهی", placeholder: "انتخاب گونه", required: true, type: "select", options: varieties, icon: "🌱" },
        { name: "GerminationRate", label: "نرخ جوانه زنی (%)", placeholder: "مثلا 95", required: false, type: "number", icon: "📈" },
        { name: "PurityPercent", label: "درصد خلوص (%)", placeholder: "مثلا 98", required: false, type: "number", icon: "✨" },
        { name: "QualityGrade", label: "درجه کیفی", placeholder: "مثلا A", required: false, type: "text", icon: "⭐" },
        { name: "ProductionDate", label: "تاریخ تولید", placeholder: "انتخاب تاریخ", required: false, type: "date", icon: "📅" },
        { name: "ExpirationDate", label: "تاریخ انقضا", placeholder: "انتخاب تاریخ", required: false, type: "date", icon: "⏳" },
    ];

    const submitSeedBatch = async (values: any) => {
        setLoading(true);
        setModalMsg(null);

        const dataToSubmit = {
            ...values,
            ProductionDate: values.ProductionDate ? new Date(values.ProductionDate) : null,
            ExpirationDate: values.ExpirationDate ? new Date(values.ExpirationDate) : null,
        };

        const res: SeedBatchCreateRes = await updateSeedBatch({ id: props.data.SeedBatchID, data: dataToSubmit });

        setModalMsg({ status: res.status, message: res.message });

        if (res.status === "ok") {
            props.setMainLoading?.(true);
            const newData = await getAllSeedBatches();
            props.setMainData?.(newData);
            props.setMainLoading?.(false);

            setTimeout(() => {
                props.onClose?.();
                setModalMsg(null);
            }, 1500);
        }
        setLoading(false);
    };

    const handleClose = () => {
        props.onClose?.();
        setModalMsg(null);
    };

    if (!mounted) return null;

    const inputStyleClass = "rounded-xl border-2 border-slate-200 dark:border-slate-700 hover:border-amber-300 dark:hover:border-amber-700 focus:border-amber-400 dark:focus:border-amber-600 transition-all shadow-sm hover:shadow w-full dark:bg-slate-800 dark:text-white dark:placeholder-slate-500";
    const inputStyle = { height: "46px", fontSize: "14px" };

    return (
        <Modal
            open={props.isOpen}
            forceRender
            onCancel={handleClose}
            footer={null}
            closeIcon={null}
            centered
            width={720}
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
                            <GoldOutlined className="text-2xl" />
                        </div>
                        <div className="absolute -bottom-1 -right-1 h-5 w-5 rounded-full bg-orange-400 border-2 border-white dark:border-slate-800"></div>
                    </div>
                    <div>
                        <h3 className="font-bold text-2xl text-amber-900 dark:text-slate-100">ویرایش بچ تولید بذر</h3>
                        <p className="text-sm text-amber-600/80 dark:text-slate-400 mt-1 flex items-center gap-1.5">
                            <span className="h-1.5 w-1.5 rounded-full bg-amber-400 animate-pulse"></span>
                            ویرایش بچ: {props.data?.BatchCode}
                        </p>
                    </div>
                </div>
            </div>

            {/* Body */}
            <div className="px-6 py-6 bg-gradient-to-br from-white to-slate-50/30 max-h-[70vh] overflow-y-auto dark:from-slate-800 dark:to-slate-900">
                <Form form={form} layout="vertical" onFinish={submitSeedBatch} requiredMark={false}>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                        {fields.map((field) => (
                            <Form.Item
                                key={field.name}
                                label={
                                    <span className="text-sm font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-2">
                                        <span className="text-base">{field.icon}</span>
                                        {field.label}
                                        {field.required && <span className="text-rose-500 text-xs">*</span>}
                                    </span>
                                }
                                name={field.name}
                                rules={[{ required: field.required, message: `لطفاً ${field.label} را وارد کنید` }]}
                                className="mb-0"
                            >
                                {field.type === "select" ? (
                                    <Select
                                        showSearch
                                        placeholder={field.placeholder}
                                        options={field.options}
                                        optionFilterProp="label"
                                        loading={dropdownsLoading}
                                        allowClear
                                        size="large"
                                        className="rounded-xl dark:bg-slate-800 dark:border-slate-700 dark:text-white dark:hover:border-amber-700 dark:focus:border-amber-600"
                                        disabled={loading}
                                        popupClassName="dark:bg-slate-800"
                                    />
                                ) : field.type === "date" ? (
                                    <DatePicker
                                        calendar={persian}
                                        locale={persian_fa}
                                        calendarPosition="bottom-right"
                                        containerClassName="w-full"
                                        inputClass={`w-full ant-input ant-input-lg ${inputStyleClass}`}
                                        placeholder={field.placeholder}
                                        disabled={loading}
                                        value={form.getFieldValue(field.name)}
                                        onChange={(date) => {
                                            form.setFieldValue(field.name, date);
                                        }}
                                    />
                                ) : (
                                    <Input
                                        type={field.type === "number" ? "number" : "text"}
                                        onChange={() => setModalMsg(null)}
                                        placeholder={field.placeholder}
                                        disabled={loading}
                                        size="large"
                                        className="rounded-xl border-2 border-slate-200 dark:border-slate-700 hover:border-amber-300 dark:hover:border-amber-700 focus:border-amber-400 dark:focus:border-amber-600 transition-all shadow-sm hover:shadow w-full dark:bg-slate-800 dark:text-white dark:placeholder-slate-500"
                                        style={{ height: "46px", fontSize: "14px" }}
                                    />
                                )}
                            </Form.Item>
                        ))}
                    </div>

                    <Form.Item
                        label={
                            <span className="text-sm font-semibold text-slate-700 flex items-center gap-2">
                                <span>📝</span>یادداشت
                            </span>
                        }
                        name="BatchNotes"
                        className="mt-5"
                    >
                        <Input.TextArea
                            placeholder="توضیحات تکمیلی..."
                            disabled={loading}
                            rows={3}
                            className="rounded-xl border-2 border-slate-200 dark:border-slate-700 hover:border-amber-300 dark:hover:border-amber-700 focus:border-amber-400 dark:focus:border-amber-600 transition-all w-full dark:bg-slate-800 dark:text-white dark:placeholder-slate-500"
                            style={{ resize: "none" }}
                        />
                    </Form.Item>

                    {modalMsg && (
                        <div
                            className={`mt-4 p-4 rounded-xl border-2 flex items-start gap-3 animate-in fade-in slide-in-from-top-3 duration-300 shadow-sm ${modalMsg.status === "ok"
                                ? "bg-gradient-to-br from-emerald-50 to-emerald-100/50 dark:from-emerald-900/30 dark:to-emerald-900/10 border-emerald-300 dark:border-emerald-800 text-emerald-900 dark:text-emerald-300"
                                : "bg-gradient-to-br from-rose-50 to-rose-100/50 dark:from-rose-900/30 dark:to-rose-900/10 border-rose-300 dark:border-rose-800 text-rose-900 dark:text-rose-300"
                                }`}
                        >
                            <div
                                className={`mt-0.5 p-1.5 rounded-lg ${modalMsg.status === "ok" ? "bg-emerald-200/50 dark:bg-emerald-800/50" : "bg-rose-200/50 dark:bg-rose-800/50"
                                    }`}
                            >
                                {modalMsg.status === "ok" ? (
                                    <CheckCircleOutlined className="text-lg text-emerald-700 dark:text-emerald-400" />
                                ) : (
                                    <ExclamationCircleOutlined className="text-lg text-rose-700 dark:text-rose-400" />
                                )}
                            </div>
                            <div className="flex-1">
                                <p className="text-sm font-semibold mb-0.5">{modalMsg.status === "ok" ? "موفقیت‌آمیز" : "خطا"}</p>
                                <p className="text-sm leading-relaxed opacity-90">{modalMsg.message}</p>
                            </div>
                        </div>
                    )}

                    <div className="flex justify-end mt-6">
                        <GreenhouseButton
                            text={loading ? "در حال ویرایش..." : "ویرایش بذر"}
                            variant="primary"
                            type="submit"
                            loading={loading}
                            className="min-w-[160px] h-11 shadow-lg hover:shadow-xl"
                        />
                    </div>
                </Form>
            </div>
        </Modal>
    );
}
