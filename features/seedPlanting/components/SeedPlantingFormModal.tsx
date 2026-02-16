"use client";

import { Modal, Form, Input, Select, Checkbox } from "antd";
import { Tbl_SeedPlanting } from "@/app/generated/prisma/client";
import { useEffect, useState } from "react";
import { createSeedPlanting, updateSeedPlanting, getOrdersForDropdown, getTechnicians } from "@/features/seedPlanting/services";
import { allGreenHouses } from "@/features/greenhouse/services/read";
import {
    CloseOutlined,
    ExperimentOutlined,
    CheckCircleOutlined,
    ExclamationCircleOutlined,
} from "@ant-design/icons";
import GreenhouseButton from "@/shared/components/GreenhouseButton";
import DatePicker from "react-multi-date-picker";
import persian from "react-date-object/calendars/persian";
import persian_fa from "react-date-object/locales/persian_fa";

import QRCodeLib from "qrcode";

// Types
type SelectOption = { label: any; value: string | number };

interface OrderData {
    ID: number;
    OrderCode: string | null;
    OrderCount: number | null;
    QRCode: string | null;
    generatedQRCode?: string; // New field for client-side generated QR
    Tbl_SeedPackage_Tbl_Orders_ScionIDToTbl_SeedPackage: {
        Tbl_plantVariety: { VarietyName: string | null } | null;
    } | null;
    Tbl_SeedPackage_Tbl_Orders_RootstockIDToTbl_SeedPackage: {
        Tbl_plantVariety: { VarietyName: string | null } | null;
    } | null;
}

export default function SeedPlantingFormModal({
    modalOpen,
    setModalOpen,
    setMainData,
    setMainLoading,
    record,
    refreshData
}: {
    modalOpen: boolean;
    setModalOpen: (open: boolean) => void;
    setMainData?: (data: any[]) => void;
    setMainLoading?: (loading: boolean) => void;
    record?: Tbl_SeedPlanting | null;
    refreshData: () => Promise<void>;
}) {
    const [loading, setLoading] = useState(false);
    const [modalMsg, setModalMsg] = useState<{ status: "ok" | "error"; message: string } | null>(null);
    const [orders, setOrders] = useState<OrderData[]>([]);
    const [technicians, setTechnicians] = useState<SelectOption[]>([]);
    const [greenhouses, setGreenhouses] = useState<SelectOption[]>([]);
    const [form] = Form.useForm();
    const [mounted, setMounted] = useState(false);

    // State for the custom logic
    const [selectedOrder, setSelectedOrder] = useState<OrderData | null>(null);
    const [seedType, setSeedType] = useState<boolean | null>(null); // true = Scion, false = Rootstock
    const [showVarietyInfo, setShowVarietyInfo] = useState(false);

    const isEdit = !!record;
    const modalTitle = isEdit ? "ویرایش کشت بذر" : "کاشت بذور";
    const modalSubTitle = "اطلاعات مربوط به کشت بذر را وارد کنید";

    const theme = {
        gradient: "from-emerald-50 via-teal-50/80 to-white dark:from-slate-900 dark:via-slate-800 dark:to-slate-900",
        border: "border-emerald-100 dark:border-slate-700",
        iconBg: "from-emerald-500 via-teal-600 to-teal-700",
        iconDot: "bg-teal-400",
        textMain: "text-emerald-900 dark:text-slate-100",
        textSub: "text-emerald-600/80 dark:text-slate-400",
        accent: "emerald",
    };

    useEffect(() => {
        setMounted(true);
        if (modalOpen) {
            fetchInitialData();
            if (record) {
                // Populate form
                form.setFieldsValue({
                    ...record,
                    PlantingDate: record.PlantingDate ? new Date(record.PlantingDate) : null,
                    GerminationDate: record.GerminationDate ? new Date(record.GerminationDate) : null,
                });
                setSeedType(record.SeedType ?? null);
            } else {
                form.resetFields();
                setSeedType(null);
                setSelectedOrder(null);
                setShowVarietyInfo(false);
            }
        }
    }, [modalOpen, record]);


    const fetchInitialData = async () => {
        const [ordersData, techniciansData, greenhousesData] = await Promise.all([
            getOrdersForDropdown(),
            getTechnicians(),
            allGreenHouses()
        ]);

        const ordersWithQR = await Promise.all(ordersData.map(async (o: any) => {
            try {
                const url = `https://mygreenhouses.ir/public/scan/orders/${o.ID}`;
                const qrDataUrl = await QRCodeLib.toDataURL(url, { margin: 1, width: 64 });
                return { ...o, generatedQRCode: qrDataUrl };
            } catch (e) {
                console.error("QR Gen Error", e);
                return o;
            }
        }));

        setOrders(ordersWithQR);
        setTechnicians(techniciansData.map((t: any) => ({ label: `${t.FirstName} ${t.LastName}`, value: t.ID })));
        setGreenhouses(greenhousesData.map((g: any) => ({ label: g.GreenhouseName, value: g.ID })));

        if (record && record.OrderID) {
            const ord = ordersWithQR.find((o: any) => o.ID === record.OrderID);
            if (ord) {
                setSelectedOrder(ord as any);
                setShowVarietyInfo(true);
            }
        }
    };

    const handleOrderChange = (orderId: number) => {
        const ord = orders.find(o => o.ID === orderId);
        if (ord) {
            setSelectedOrder(ord);
            setShowVarietyInfo(true);
        } else {
            setSelectedOrder(null);
            setShowVarietyInfo(false);
        }
    };

    const handleSeedTypeChange = (type: boolean) => {
        setSeedType(type);
        form.setFieldValue("SeedType", type);
    };

    const handleSubmit = async (values: any) => {
        if (seedType === null) {
            setModalMsg({ status: "error", message: "لطفاً نوع بذر (پایه یا پیوندی) را مشخص کنید" });
            return;
        }

        setLoading(true);
        setModalMsg(null);

        const dataToSubmit = {
            ...values,
            SeedType: seedType,
            PlantingDate: values.PlantingDate ? new Date(values.PlantingDate) : null,
            GerminationDate: values.GerminationDate ? new Date(values.GerminationDate) : null,
        };

        let res;
        if (isEdit && record) {
            res = await updateSeedPlanting(record.ID, dataToSubmit);
        } else {
            res = await createSeedPlanting(dataToSubmit);
        }

        setModalMsg({ status: res.status as "ok" | "error", message: res.message });

        if (res.status === "ok") {
            await refreshData();
            setTimeout(() => {
                setModalOpen(false);
                form.resetFields();
            }, 1000);
        }
        setLoading(false);
    };

    if (!mounted) return null;

    return (
        <Modal
            open={modalOpen}
            onCancel={() => setModalOpen(false)}
            footer={null}
            closeIcon={null}
            centered
            width={850}
            className="!p-0"
            styles={{ content: { padding: 0, borderRadius: "1.25rem", overflow: "hidden" } }}
        >
            {/* Header */}
            <div className={`relative px-6 py-6 bg-gradient-to-br ${theme.gradient} border-b ${theme.border}`}>
                <button
                    onClick={() => setModalOpen(false)}
                    className={`absolute top-5 left-5 h-9 w-9 rounded-xl bg-white/50 hover:bg-white transition-all flex items-center justify-center text-slate-500 hover:text-rose-500 shadow-sm`}
                >
                    <CloseOutlined />
                </button>
                <div className="flex items-center gap-4">
                    <div className={`h-14 w-14 rounded-2xl bg-gradient-to-br ${theme.iconBg} shadow-lg flex items-center justify-center text-white`}>
                        <ExperimentOutlined className="text-2xl" />
                    </div>
                    <div>
                        <h3 className={`font-bold text-2xl ${theme.textMain}`}>{modalTitle}</h3>
                        <p className={`text-sm ${theme.textSub} mt-1`}>{modalSubTitle}</p>
                    </div>
                </div>
            </div>

            {/* Body */}
            <div className="px-8 py-6 max-h-[75vh] overflow-y-auto bg-slate-50 dark:bg-slate-900">
                <Form form={form} layout="vertical" onFinish={handleSubmit}>

                    {/* Section 1: Order & Varieties */}
                    <div className="bg-white dark:bg-slate-800 p-5 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 mb-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-6 items-start">
                            {/* Column 1 - Row 1: Order Select */}
                            <Form.Item
                                label={<span className="font-semibold text-slate-700 dark:text-slate-300">کد سفارش</span>}
                                name="OrderID"
                                rules={[{ required: true, message: "انتخاب سفارش الزامی است" }]}
                                className="mb-0"
                            >
                                <Select
                                    placeholder="انتخاب کد سفارش"
                                    className="w-full text-right"
                                    size="large"
                                    onChange={handleOrderChange}
                                    options={orders.map(o => ({
                                        label: (
                                            <div className="flex items-center gap-3">
                                                {o.generatedQRCode ? (
                                                    <img src={o.generatedQRCode} alt="QR" className="w-8 h-8 object-contain bg-white border border-slate-200 rounded p-0.5" />
                                                ) : (
                                                    <div className="w-8 h-8 bg-slate-100 rounded flex items-center justify-center text-[10px] text-slate-400">---</div>
                                                )}
                                                <span>{o.OrderCode}</span>
                                            </div>
                                        ),
                                        value: o.ID
                                    }))}
                                    allowClear
                                    popupMatchSelectWidth={false}
                                />
                            </Form.Item>

                            {/* Column 2 - Row 1: Base Variety Info */}
                            <Form.Item
                                label={<span className="font-semibold text-slate-700 dark:text-slate-300">واریته گیاه پایه</span>}
                                className="mb-0"
                                required
                            >
                                {selectedOrder ? (
                                    <div className={`flex items-center justify-between px-4 rounded-xl border-2 transition-all cursor-pointer h-[40px] ${seedType === false ? "border-emerald-500 bg-emerald-50 dark:bg-emerald-900/20 shadow-sm" : "border-slate-100 dark:border-slate-700 hover:border-emerald-200"}`}
                                        onClick={() => handleSeedTypeChange(false)}>
                                        <div className="flex flex-col justify-center">
                                            <span className="font-bold text-slate-800 dark:text-slate-200 text-sm">
                                                {selectedOrder.Tbl_SeedPackage_Tbl_Orders_RootstockIDToTbl_SeedPackage?.Tbl_plantVariety?.VarietyName || "---"}
                                            </span>
                                        </div>
                                        <Checkbox checked={seedType === false} />
                                    </div>
                                ) : (
                                    <div className="flex items-center justify-center h-[40px] bg-slate-50/50 dark:bg-slate-900/30 border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-xl text-slate-400 text-[11px]">
                                        در انتظار انتخاب سفارش
                                    </div>
                                )}
                            </Form.Item>

                            {/* Column 1 - Row 2: QR Code */}
                            <Form.Item
                                label={<span className="font-semibold text-slate-700 dark:text-slate-300">شناسه سفارش (QR)</span>}
                                className="mb-0"
                            >
                                <div className="flex items-center justify-center border-2 border-dashed border-slate-200 dark:border-slate-700 rounded-xl bg-slate-50 dark:bg-slate-900/50 p-1 h-[40px] w-full">
                                    {selectedOrder?.generatedQRCode ? (
                                        <img src={selectedOrder.generatedQRCode} alt="QR Code" className="h-full object-contain" />
                                    ) : (
                                        <span className="text-slate-300 text-xs">---</span>
                                    )}
                                </div>
                            </Form.Item>

                            {/* Column 2 - Row 2: Grafted Variety Info */}
                            <Form.Item
                                label={<span className="font-semibold text-slate-700 dark:text-slate-300">واریته گیاه پیوندی</span>}
                                className="mb-0"
                                required
                            >
                                {selectedOrder ? (
                                    <div className={`flex items-center justify-between px-4 rounded-xl border-2 transition-all cursor-pointer h-[40px] ${seedType === true ? "border-emerald-500 bg-emerald-50 dark:bg-emerald-900/20 shadow-sm" : "border-slate-100 dark:border-slate-700 hover:border-emerald-200"}`}
                                        onClick={() => handleSeedTypeChange(true)}>
                                        <div className="flex flex-col justify-center">
                                            <span className="font-bold text-slate-800 dark:text-slate-200 text-sm">
                                                {selectedOrder.Tbl_SeedPackage_Tbl_Orders_ScionIDToTbl_SeedPackage?.Tbl_plantVariety?.VarietyName || "---"}
                                            </span>
                                        </div>
                                        <Checkbox checked={seedType === true} />
                                    </div>
                                ) : (
                                    <div className="flex items-center justify-center h-[40px] bg-slate-50/50 dark:bg-slate-900/30 border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-xl text-slate-400 text-[11px]">
                                        در انتظار انتخاب سفارش
                                    </div>
                                )}
                            </Form.Item>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
                            <Form.Item label="گلخانه" name="GreenhouseID">
                                <Select options={greenhouses} size="large" className="rounded-xl" placeholder="انتخاب گلخانه" />
                            </Form.Item>
                            <Form.Item label="تکنسین" name="TechnicianID" rules={[{ required: true }]}>
                                <Select options={technicians} size="large" className="rounded-xl" placeholder="انتخاب تکنسین" />
                            </Form.Item>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
                            <Form.Item label="تاریخ کاشت" name="PlantingDate" rules={[{ required: true }]}>
                                <DatePicker calendar={persian} locale={persian_fa} containerClassName="w-full" inputClass="w-full h-11 rounded-xl border border-slate-300 px-3" />
                            </Form.Item>
                            <Form.Item label="تعداد بذر کاشته شده" name="SeedPlantingNumber" rules={[{ required: true }]}>
                                <Input type="number" size="large" className="rounded-xl" />
                            </Form.Item>
                        </div>
                    </div>

                    {/* Section 2: Tray Info */}
                    <div className="bg-white dark:bg-slate-800 p-5 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 mb-6 relative">
                        <span className="absolute -top-3 right-4 bg-slate-50 dark:bg-slate-900 px-2 text-xs font-bold text-slate-500">اطلاعات سینی کاشت</span>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-2">
                            <Form.Item label="تعداد سینی" name="TrayNumber" rules={[{ required: true }]}>
                                <Input type="number" size="large" className="rounded-xl" />
                            </Form.Item>
                            <Form.Item label="تعداد حفره" name="CellPerTrayNumber" rules={[{ required: true }]}>
                                <Select size="large" className="rounded-xl" options={[
                                    { label: "24", value: 24 },
                                    { label: "45", value: 45 },
                                    { label: "52", value: 52 },
                                    { label: "72", value: 72 },
                                    { label: "105", value: 105 },
                                    { label: "128", value: 128 },
                                ]} />
                            </Form.Item>
                            <Form.Item label="ابعاد حفره (cm)" name="CellHeight" rules={[{ required: true }]}>
                                <Input type="number" size="large" className="rounded-xl" suffix="cm" />
                            </Form.Item>
                            <Form.Item label="جنس سینی" name="TrayMaterial">
                                <Select size="large" className="rounded-xl" options={[
                                    { label: "پلی اتیلن", value: "پلی اتیلن" },
                                    { label: "پلی استیرن", value: "پلی استیرن" },
                                ]} />
                            </Form.Item>
                        </div>
                    </div>

                    {/* Section 3: Bed & Technician */}
                    <div className="bg-white dark:bg-slate-800 p-5 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 mb-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <Form.Item label="بستر کشت" name="PlantingBed">
                                <Select size="large" className="rounded-xl" options={[
                                    { label: "کوکوپیت خالص", value: "کوکوپیت خالص" },
                                    { label: "مخلوط کوکوپیت و پرلیت", value: "مخلوط کوکوپیت و پرلیت" },
                                    { label: "مخلوط پیت ماس و پرلیت", value: "مخلوط پیت ماس و پرلیت" },
                                ]} />
                            </Form.Item>
                            <Form.Item label="نسبت مخلوط" name="PlantingBedRatio">
                                <Input size="large" className="rounded-xl" placeholder="مثلا 1.7" type="number" step="0.1" />
                            </Form.Item>
                            <Form.Item label="تاریخ ورود به اتاق جوانه زنی" name="GerminationDate">
                                <DatePicker calendar={persian} locale={persian_fa} containerClassName="w-full" inputClass="w-full h-11 rounded-xl border border-slate-300 px-3" />
                            </Form.Item>
                        </div>
                    </div>

                    {modalMsg && (
                        <div className={`p-4 rounded-xl mb-4 flex items-center gap-3 ${modalMsg.status === 'ok' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-rose-50 text-rose-700 border border-rose-200'}`}>
                            {modalMsg.status === 'ok' ? <CheckCircleOutlined /> : <ExclamationCircleOutlined />}
                            <span>{modalMsg.message}</span>
                        </div>
                    )}

                    <div className="flex justify-end gap-3">
                        <GreenhouseButton text="انصراف" variant="outline" onClick={() => setModalOpen(false)} className="w-32" />
                        <GreenhouseButton text="ثبت" variant="primary" type="submit" loading={loading} className="w-32" />
                    </div>
                </Form>
            </div>
        </Modal>
    );
}
