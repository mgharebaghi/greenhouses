import { Modal, Form, Input, InputNumber, Select } from "antd";
import { useEffect, useState } from "react";
import { createNurseryRoom } from "@/features/nurseryRooms/services/create";
import { updateNurseryRoom } from "@/features/nurseryRooms/services/update";
import { CloseOutlined, ExperimentOutlined, CheckCircleOutlined, ExclamationCircleOutlined, EditOutlined, PlusOutlined } from "@ant-design/icons";
import GreenhouseButton from "@/shared/components/GreenhouseButton";

import DatePicker from "react-multi-date-picker";
import DateObject from "react-date-object";
import persian from "react-date-object/calendars/persian";
import persian_fa from "react-date-object/locales/persian_fa";

interface NurseryRoomsInsUpModalProps {
    open: boolean;
    setOpen: (open: boolean) => void;
    setLoading: (loading: boolean) => void;
    data?: any | null; // If data is provided, it's edit mode
    refreshData: () => void;
}

export default function NurseryRoomsInsUpModal({ open, setOpen, setLoading, data, refreshData }: NurseryRoomsInsUpModalProps) {
    const [form] = Form.useForm();
    const [internalLoading, setInternalLoading] = useState(false);
    const [message, setMessage] = useState<{ status: "ok" | "error"; message: string } | null>(null);

    const isEditMode = !!data;

    useEffect(() => {
        if (open) {
            setMessage(null);
            if (isEditMode && data) {
                form.setFieldsValue({
                    NurseryRoomCode: data.NurseryRoomCode,
                    NurseryRoomName: data.NurseryRoomName,
                    TemperatureMin: data.TemperatureMin,
                    TemperatureMax: data.TemperatureMax,
                    HumidityMin: data.HumidityMin,
                    HumidityMax: data.HumidityMax,
                    LightType: data.LightType,
                    LightHoursPerDay: data.LightHoursPerDay,
                    CO2Range: data.CO2Range,
                    StrelizationMethod: data.StrelizationMethod,
                    NurseryRoomCreatedAt: data.NurseryRoomCreatedAt ? new DateObject(new Date(data.NurseryRoomCreatedAt)).convert(persian, persian_fa) : null,
                });
            } else {
                form.resetFields();
            }
        }
    }, [open, data, isEditMode, form]);

    const handleFinish = async (values: any) => {
        setInternalLoading(true);
        setLoading(true);
        setMessage(null);

        const dataToSubmit = {
            ...values,
            NurseryRoomCreatedAt: values.NurseryRoomCreatedAt instanceof DateObject ? values.NurseryRoomCreatedAt.toDate() : undefined,
        };

        let res;
        if (isEditMode && data?.ID) {
            res = await updateNurseryRoom(data.ID, dataToSubmit);
        } else {
            res = await createNurseryRoom(dataToSubmit);
        }

        setLoading(false);
        setInternalLoading(false);

        if (res.status === "ok") {
            setMessage({ status: "ok", message: res.message });
            setTimeout(() => {
                setOpen(false);
                refreshData();
                if (!isEditMode) {
                    form.resetFields();
                }
            }, 1000);
        } else {
            setMessage({ status: "error", message: res.message });
        }
    };

    const handleClose = () => {
        setOpen(false);
        setMessage(null);
        if (!isEditMode) {
            form.resetFields();
        }
    };

    const inputStyleClass = `rounded-xl border-2 border-slate-200 dark:border-slate-700 transition-all shadow-sm hover:shadow w-full dark:bg-slate-800 dark:text-white dark:placeholder-slate-500 ${isEditMode
        ? "hover:border-amber-300 dark:hover:border-amber-700 focus:border-amber-400 dark:focus:border-amber-600"
        : "hover:border-emerald-300 dark:hover:border-emerald-700 focus:border-emerald-400 dark:focus:border-emerald-600"
        }`;

    // Header colors
    const headerGradient = isEditMode
        ? "from-amber-50 via-orange-50/80 to-white dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 border-amber-100 dark:border-slate-700"
        : "from-emerald-50 via-lime-50/80 to-white dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 border-emerald-100 dark:border-slate-700";

    const closeBtnClass = `absolute top-5 left-5 h-9 w-9 rounded-xl bg-white dark:bg-slate-800 border transition-all flex items-center justify-center shadow-sm hover:shadow ${isEditMode
        ? "hover:bg-amber-50 dark:hover:bg-amber-900/20 border-amber-200 dark:border-slate-600 hover:border-amber-300 dark:hover:border-amber-700 text-amber-600 dark:text-amber-500 hover:text-amber-700"
        : "hover:bg-emerald-50 dark:hover:bg-emerald-900/20 border-emerald-200 dark:border-slate-600 hover:border-emerald-300 dark:hover:border-emerald-700 text-emerald-600 dark:text-emerald-500 hover:text-emerald-700"
        }`;

    const iconGradient = isEditMode
        ? "from-amber-500 via-amber-600 to-orange-600"
        : "from-emerald-500 via-emerald-600 to-emerald-700";

    const pulseColor = isEditMode ? "bg-amber-400" : "bg-emerald-400";
    const dotColor = isEditMode ? "bg-orange-400" : "bg-lime-400";


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
            <div className={`relative px-6 py-6 bg-gradient-to-br border-b ${headerGradient}`}>
                <button
                    onClick={handleClose}
                    className={closeBtnClass}
                    aria-label="بستن"
                >
                    <CloseOutlined className="text-sm" />
                </button>

                <div className="flex items-center gap-4">
                    <div className="relative">
                        <div className={`h-14 w-14 rounded-2xl bg-gradient-to-br shadow-lg flex items-center justify-center text-white ${iconGradient}`}>
                            {isEditMode ? <EditOutlined className="text-2xl" /> : <PlusOutlined className="text-2xl" />}
                        </div>
                        <div className={`absolute -bottom-1 -right-1 h-5 w-5 rounded-full border-2 border-white dark:border-slate-800 ${dotColor}`}></div>
                    </div>
                    <div>
                        <h3 className={`font-bold text-2xl ${isEditMode ? "text-amber-900 dark:text-slate-100" : "text-emerald-900 dark:text-slate-100"}`}>
                            {isEditMode ? "ویرایش اتاق ریکاوری" : "افزودن اتاق ریکاوری جدید"}
                        </h3>
                        <p className={`text-sm mt-1 flex items-center gap-1.5 ${isEditMode ? "text-amber-600/80 dark:text-slate-400" : "text-emerald-600/80 dark:text-slate-400"}`}>
                            <span className={`h-1.5 w-1.5 rounded-full animate-pulse ${pulseColor}`}></span>
                            {isEditMode ? `ویرایش اطلاعات اتاق: ${data?.NurseryRoomName}` : "اطلاعات اتاق را با دقت وارد کنید"}
                        </p>
                    </div>
                </div>
            </div>

            {/* Body */}
            <div className="px-6 py-6 bg-gradient-to-br from-white to-slate-50/30 dark:from-slate-900 dark:to-slate-950">
                <Form form={form} layout="vertical" onFinish={handleFinish} requiredMark={false}>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">

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
                            className="mb-0"
                        >
                            <Input placeholder="مثال: اتاق ریکاوری اصلی" size="large" className={inputStyleClass} style={inputStyle} />
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

                        <Form.Item name="LightType" label={<span className="text-sm font-semibold text-slate-700 dark:text-slate-300">نوع نور</span>} className="mb-0">
                            <Select
                                placeholder="انتخاب کنید"
                                size="large"
                                className="w-full"
                                options={[
                                    { label: 'طبیعی', value: 'Natural' },
                                    { label: 'مصنوعی', value: 'Artificial' },
                                    { label: 'ترکیبی', value: 'Hybrid' }
                                ]}
                            />
                        </Form.Item>

                        <Form.Item name="LightHoursPerDay" label={<span className="text-sm font-semibold text-slate-700 dark:text-slate-300">ساعات نوردهی در روز</span>} className="mb-0">
                            <InputNumber className={inputStyleClass} style={{ ...inputStyle, width: "100%", paddingTop: "4px" }} placeholder="ساعت" controls={false} />
                        </Form.Item>

                        <Form.Item name="CO2Range" label={<span className="text-sm font-semibold text-slate-700 dark:text-slate-300">میزان CO2 (ppm)</span>} className="mb-0">
                            <Input placeholder="مثال: 400-800" size="large" className={inputStyleClass} style={inputStyle} />
                        </Form.Item>

                        <Form.Item name="StrelizationMethod" label={<span className="text-sm font-semibold text-slate-700 dark:text-slate-300">روش ضدعفونی</span>} className="mb-0">
                            <Input placeholder="مثال: UV, Ozone" size="large" className={inputStyleClass} style={inputStyle} />
                        </Form.Item>

                        <Form.Item
                            name="NurseryRoomCreatedAt"
                            label={<span className="text-sm font-semibold text-slate-700 dark:text-slate-300">تاریخ تاسیس</span>}
                            className="mb-0"
                        >
                            <DatePicker
                                calendar={persian}
                                locale={persian_fa}
                                calendarPosition="bottom-right"
                                inputClass={`${inputStyleClass} !h-[46px] px-3`}
                                containerClassName="w-full"
                                placeholder="انتخاب تاریخ"
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
                            text={internalLoading ? (isEditMode ? "در حال ویرایش..." : "در حال ثبت...") : (isEditMode ? "ویرایش اتاق" : "ثبت اتاق")}
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
