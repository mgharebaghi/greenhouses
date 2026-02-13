import { Modal, Form, Input } from "antd";
import { Tbl_Plants } from "@/app/generated/prisma";
import { useEffect, useState } from "react";
import { createPlant } from "@/features/plants/services/create";
import { updatePlant } from "@/features/plants/services/update";
import { getPlants } from "@/features/plants/services";
import {
    CloseOutlined,
    PlusOutlined,
    EditOutlined,
    CheckCircleOutlined,
    ExclamationCircleOutlined,
} from "@ant-design/icons";
import GreenhouseButton from "@/shared/components/GreenhouseButton";

export type PlantFormModalProps = {
    modalOpen: boolean;
    setModalOpen: (open: boolean) => void;
    setMainData: (data: Tbl_Plants[]) => void;
    setMainLoading: (loading: boolean) => void;
    record?: Tbl_Plants | null;
};

export default function PlantFormModal({
    modalOpen,
    setModalOpen,
    setMainData,
    setMainLoading,
    record,
}: PlantFormModalProps) {
    const [loading, setLoading] = useState(false);
    const [modalMsg, setModalMsg] = useState<{ status: "ok" | "error"; message: string } | null>(null);
    const [form] = Form.useForm();
    const [mounted, setMounted] = useState(false);

    const isEdit = !!record;
    const modalTitle = isEdit ? "ویرایش اطلاعات گیاه" : "افزودن گیاه جدید";
    const modalSubTitle = isEdit ? "اطلاعات گیاه را ویرایش کنید" : "اطلاعات گیاه را وارد کنید";
    const icon = isEdit ? <EditOutlined className="text-2xl" /> : <PlusOutlined className="text-2xl" />;

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
            if (record) {
                form.setFieldsValue(record);
            } else {
                form.resetFields();
            }
        }
    }, [modalOpen, record, form]);

    const fields = [
        { name: "CommonName", label: "نام رایج", placeholder: "نام رایج گیاه", type: "text", required: true, icon: "🌱" },
        { name: "ScientificName", label: "نام علمی", placeholder: "نام علمی گیاه (لاتین)", type: "text", required: true, icon: "🔬" },
        { name: "PlantFamily", label: "خانواده", placeholder: "خانواده گیاه", type: "text", required: true, icon: "🌿" },
        // {name: "Notes", label: "توضیحات", placeholder: "توضیحات", type: "text", required: false, icon: "📝"}
    ];

    const handleSubmit = async (values: any) => {
        setLoading(true);
        setModalMsg(null);

        let res: { status?: string; message?: string } | null; // specific return type depending on service

        // Services return differ slightly potentially.
        // createPlant returns object or null/undefined?
        // updatePlant returns object or null/undefined?
        // Let's check service files carefully or try/catch.
        // User's previous files imply `res` is truthy/falsy or has status.
        // `createPlant` in `step 545`: `if (res)` -> `message: "گیاه با موفقیت افزوده شد"`.
        // `createPlant` in `create.ts`: `return await prisma...` -> returns the created object.
        // `updatePlant` in `update.ts`: `return prisma...` -> returns updated object.
        // So they return the object on success, or throw on error?
        // If they throw, I need try-catch in service or here.
        // User's `PlantsInsertModal` step 545:
        // `const res = await createPlant(values); if (res) { ... } else { ... }`
        // It seems `createPlant` returns `Tbl_Plants` or throws.
        // If it throws, the promise rejects, so I need try/catch here unless user service handles it.
        // Usually prisma calls throw. Global error handler?
        // Let's wrap in try/catch to be safe and set message.

        try {
            if (isEdit && record) {
                await updatePlant({ id: record.ID, data: values });
                setModalMsg({ status: "ok", message: "اطلاعات گیاه با موفقیت ویرایش شد" });
            } else {
                await createPlant(values);
                setModalMsg({ status: "ok", message: "گیاه با موفقیت افزوده شد" });
            }

            setMainLoading(true);
            const newData = await getPlants();
            setMainData(newData);
            setMainLoading(false);

            setTimeout(() => {
                handleClose();
            }, 1500);

        } catch (error) {
            console.error(error);
            setModalMsg({ status: "error", message: "خطایی رخ داد، لطفا دوباره تلاش کنید." });
        }
        setLoading(false);
    };

    const handleClose = () => {
        setModalOpen(false);
        setModalMsg(null);
        form.resetFields();
    };

    if (!mounted) return null;

    return (
        <Modal
            open={modalOpen}
            onCancel={handleClose}
            footer={null}
            closeIcon={null}
            centered
            width={580}
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
            <div className="px-6 py-6 bg-gradient-to-br from-white to-slate-50/30 dark:from-slate-900 dark:to-slate-950">
                <Form form={form} layout="vertical" onFinish={handleSubmit} requiredMark={false}>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                        {fields.map((field, index) => (
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
                                className={`mb-0 ${index === 0 ? "sm:col-span-2" : ""}`}
                            >
                                <Input
                                    onChange={() => setModalMsg(null)}
                                    placeholder={field.placeholder}
                                    disabled={loading}
                                    size="large"
                                    className={`rounded-xl border-2 border-slate-200 dark:border-slate-700 hover:border-${theme.accent}-300 dark:hover:border-${theme.accent}-700 focus:border-${theme.accent}-400 dark:focus:border-${theme.accent}-600 transition-all shadow-sm hover:shadow dark:bg-slate-800 dark:text-white dark:placeholder-slate-500`}
                                    style={{ height: "46px", fontSize: "14px" }}
                                />
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
                            placeholder="توضیحات گیاه"
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
                            text={loading ? "در حال ثبت..." : (isEdit ? "ویرایش گیاه" : "ثبت گیاه")}
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
