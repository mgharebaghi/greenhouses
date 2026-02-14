import { Modal, Form, Input, Select } from "antd";
import { ModalMsg } from "./Main";
import { Tbl_Greenhouses, Tbl_People } from "@/app/generated/prisma";
import { useEffect, useState } from "react";
import { allGreenHouses, createGreenHouse, updateGreenHouse } from "@/features/greenhouse/services";
import { getAllOwners, OwnerResponse } from "@/features/owners/services";
import { createGreenHouseSchema } from "@/features/greenhouse/schema";
import { z } from "zod";
import {
    CloseOutlined,
    HomeOutlined,
    CheckCircleOutlined,
    ExclamationCircleOutlined,
    EditOutlined,
} from "@ant-design/icons";
import GreenhouseButton from "@/shared/components/GreenhouseButton";
import DatePicker from "react-multi-date-picker";
import persian from "react-date-object/calendars/persian";
import persian_fa from "react-date-object/locales/persian_fa";
import { PeopleReadDTO } from "@/features/owners/schema";

export type SelectOptions = {
    value: number | string | boolean;
    label: string;
};

export default function GreenHouseFormModal({
    modalOpen,
    setModalOpen,
    setMainData,
    setMainLoading,
    record,
}: {
    modalOpen: boolean;
    setModalOpen: (open: boolean) => void;
    setMainData: (data: Tbl_Greenhouses[]) => void;
    setMainLoading: (loading: boolean) => void;
    record?: Tbl_Greenhouses | null;
}) {
    const [loading, setLoading] = useState(false);
    const [modalMsg, setModalMsg] = useState<ModalMsg | null>(null);
    const [owners, setOwners] = useState<SelectOptions[]>([]);
    const [ownersLoading, setOwnersLoading] = useState(false);
    const [form] = Form.useForm();
    const [mounted, setMounted] = useState(false);

    const isEdit = !!record;
    const modalTitle = isEdit ? "ویرایش اطلاعات گلخانه" : "افزودن گلخانه جدید";
    const modalSubTitle = isEdit ? "اطلاعات گلخانه را ویرایش کنید" : "اطلاعات گلخانه را وارد کنید";
    const icon = isEdit ? <EditOutlined className="text-2xl" /> : <HomeOutlined className="text-2xl" />;

    const theme = isEdit ? {
        gradient: "from-amber-50 via-orange-50/80 to-white dark:from-slate-900 dark:via-slate-800 dark:to-slate-900",
        border: "border-amber-100 dark:border-slate-700",
        iconBg: "from-amber-500 via-amber-600 to-orange-600",
        iconDot: "bg-orange-400",
        textMain: "text-amber-900 dark:text-slate-100",
        textSub: "text-amber-600/80 dark:text-slate-400",
        fieldFocus: "focus:border-amber-400 dark:focus:border-amber-600",
        fieldHover: "hover:border-amber-300 dark:hover:border-amber-700",
        accent: "amber",
    } : {
        gradient: "from-emerald-50 via-lime-50/80 to-white dark:from-slate-900 dark:via-slate-800 dark:to-slate-900",
        border: "border-emerald-100 dark:border-slate-700",
        iconBg: "from-emerald-500 via-emerald-600 to-emerald-700",
        iconDot: "bg-lime-400",
        textMain: "text-emerald-900 dark:text-slate-100",
        textSub: "text-emerald-600/80 dark:text-slate-400",
        fieldFocus: "focus:border-emerald-400 dark:focus:border-emerald-600",
        fieldHover: "hover:border-emerald-300 dark:hover:border-emerald-700",
        accent: "emerald",
    };

    useEffect(() => {
        setMounted(true);
        if (modalOpen) {
            setModalMsg(null);
            fetchOwners();
            if (record) {
                form.setFieldsValue({
                    ...record,
                    ConstructionDate: record.ConstructionDate ? new Date(record.ConstructionDate) : null
                });
            } else {
                form.resetFields();
            }
        }
    }, [modalOpen, record]);


    const fetchOwners = async () => {
        setOwnersLoading(true);
        const res: OwnerResponse = await getAllOwners();
        if (res.status === "ok" && res.dta) {
            setOwners(res.dta.map((owner: PeopleReadDTO) => ({ value: owner.ID, label: owner.FirstName + " " + owner.LastName })));
        }
        setOwnersLoading(false);
    };

    const greenHousefields = [
        { name: "GreenhouseName", label: "نام گلخانه", placeholder: "نام گلخانه را وارد کنید", required: true, icon: "🏡" },
        { name: "GreenhouseType", label: "نوع سازه", placeholder: "نوع سازه (مثلاً اسپانیایی)", required: false, icon: "🏗️" },
        { name: "AreaSqM", label: "متراژ (متر مربع)", placeholder: "متراژ کل", required: false, type: "number", icon: "📐" },
        { name: "ConstructionDate", label: "تاریخ احداث", placeholder: "تاریخ احداث", required: false, icon: "📅", type: "date" },
        { name: "OwnerID", label: "نام مالک", placeholder: "انتخاب مالک", required: true, type: "select", icon: "👤" },
        { name: "IsActive", label: "وضعیت", placeholder: "وضعیت را انتخاب کنید", required: true, type: "select", options: [{ label: "فعال", value: true }, { label: "غیرفعال", value: false }], icon: "⚡" },
        { name: "GreenhouseAddress", label: "آدرس", placeholder: "آدرس گلخانه را وارد کنید", required: true, icon: "📍" },
    ];

    const handleSubmit = async (values: any) => {
        setLoading(true);
        setModalMsg(null);

        const dataToSubmit = {
            ...values,
            ConstructionDate: values.ConstructionDate ? new Date(values.ConstructionDate) : null,
        };

        let res: { status: string; message?: string };

        if (isEdit && record) {
            await updateGreenHouse({ id: record.ID, data: dataToSubmit });
            res = { status: "ok", message: "اطلاعات گلخانه با موفقیت ویرایش شد" };
        } else {
            res = await createGreenHouse(dataToSubmit as z.infer<typeof createGreenHouseSchema>);
        }

        setModalMsg({ status: res.status as "ok" | "error", message: res.message || "" });

        if (res.status === "ok") {
            setTimeout(async () => {
                handleClose();
            }, 1500);
        }
        setLoading(false);
    };

    const handleClose = async () => {
        setModalOpen(false);
        setMainLoading(true);
        const newData = await allGreenHouses();
        setMainData(newData);
        setMainLoading(false);
        form.resetFields();
        setModalMsg(null);
    };

    if (!mounted) return null;

    return (
        <Modal
            open={modalOpen}
            onCancel={handleClose}
            footer={null}
            closeIcon={null}
            centered
            width={680}
            className="!p-0"
            styles={{
                content: {
                    padding: 0,
                    borderRadius: "1.25rem",
                    overflow: "hidden",
                    boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
                },
            }}
            forceRender
        >
            {/* Header */}
            <div className={`relative px-6 py-6 bg-gradient-to-br ${theme.gradient} border-b ${theme.border}`}>
                <button
                    onClick={handleClose}
                    className={`absolute top-5 left-5 h-9 w-9 rounded-xl bg-white dark:bg-slate-800 hover:bg-${theme.accent}-50 dark:hover:bg-${theme.accent}-900/20 border border-${theme.accent}-200 dark:border-slate-600 hover:border-${theme.accent}-300 dark:hover:border-${theme.accent}-700 transition-all flex items-center justify-center text-${theme.accent}-600 dark:text-${theme.accent}-500 hover:text-${theme.accent}-700 shadow-sm hover:shadow`}
                    aria-label="بستن"
                >
                    <CloseOutlined className="text-sm" />
                </button>

                <div className="flex items-center gap-4">
                    <div className="relative">
                        <div className={`h-14 w-14 rounded-2xl bg-gradient-to-br ${theme.iconBg} shadow-lg flex items-center justify-center text-white`}>
                            {icon}
                        </div>
                        <div className={`absolute -bottom-1 -right-1 h-5 w-5 rounded-full ${theme.iconDot} border-2 border-white dark:border-slate-800`}></div>
                    </div>
                    <div>
                        <h3 className={`font-bold text-2xl ${theme.textMain}`}>{modalTitle}</h3>
                        <p className={`text-sm ${theme.textSub} mt-1 flex items-center gap-1.5`}>
                            <span className={`h-1.5 w-1.5 rounded-full bg-${theme.accent}-400 animate-pulse`}></span>
                            {modalSubTitle}
                        </p>
                    </div>
                </div>
            </div>

            {/* Body */}
            <div className="px-6 py-6 bg-gradient-to-br from-white to-slate-50/30 dark:from-slate-900 dark:to-slate-950 max-h-[70vh] overflow-y-auto">
                <Form form={form} layout="vertical" onFinish={handleSubmit} requiredMark={false}>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                        {greenHousefields.map((field, index) => (
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
                                className={`mb-0 ${field.name === "GreenhouseAddress" || field.name === "GreenhouseName" ? "sm:col-span-2" : ""}`}
                            >
                                {field.type === "select" ? (
                                    <Select
                                        showSearch
                                        placeholder={field.placeholder}
                                        options={field.name === "OwnerID" ? owners : field.options}
                                        optionFilterProp="label"
                                        loading={field.name === "OwnerID" ? ownersLoading : false}
                                        allowClear
                                        size="large"
                                        className="rounded-xl"
                                        disabled={loading}
                                    />
                                ) : field.type === "date" ? (
                                    <DatePicker
                                        calendar={persian}
                                        locale={persian_fa}
                                        calendarPosition="bottom-right"
                                        containerClassName="w-full"
                                        inputClass={`w-full ant-input ant-input-lg rounded-xl border-2 border-slate-200 hover:border-${theme.accent}-300 focus:border-${theme.accent}-400 transition-all shadow-sm hover:shadow !h-[46px] !text-sm`}
                                        placeholder={field.placeholder}
                                        disabled={loading}
                                    />
                                ) : (
                                    <Input
                                        type={field.type || "text"}
                                        onChange={() => setModalMsg(null)}
                                        placeholder={field.placeholder}
                                        disabled={loading}
                                        size="large"
                                        className={`rounded-xl border-2 border-slate-200 dark:border-slate-700 hover:border-${theme.accent}-300 dark:hover:border-${theme.accent}-700 focus:border-${theme.accent}-400 dark:focus:border-${theme.accent}-600 transition-all shadow-sm hover:shadow dark:bg-slate-800 dark:text-white dark:placeholder-slate-500`}
                                        style={{ height: "46px", fontSize: "14px" }}
                                    />
                                )}
                            </Form.Item>
                        ))}
                    </div>

                    <Form.Item
                        label={
                            <span className="text-sm font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-2">
                                <span>📝</span>توضیحات
                            </span>
                        }
                        name="Notes"
                        className="mt-5"
                    >
                        <Input.TextArea
                            placeholder="توضیحات گلخانه"
                            disabled={loading}
                            rows={3}
                            className={`rounded-xl border-2 border-slate-200 dark:border-slate-700 hover:border-${theme.accent}-300 dark:hover:border-${theme.accent}-700 focus:border-${theme.accent}-400 dark:focus:border-${theme.accent}-600 transition-all dark:bg-slate-800 dark:text-white`}
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
                            text={loading ? "در حال ثبت..." : (isEdit ? "ویرایش گلخانه" : "ثبت گلخانه")}
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
