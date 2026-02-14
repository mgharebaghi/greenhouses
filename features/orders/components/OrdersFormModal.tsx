"use client";

import { Modal, Form, Input, InputNumber, Select, Row, Col, Card } from "antd";
import { useEffect, useState } from "react";
import { createOrder, updateOrder } from "@/features/orders/services";
import { getAllOwners } from "@/features/owners/services";
import { getSuppliers } from "@/features/suppliers/services";
import { getAllSeedPackages } from "@/features/seedPackage/services";
import { CloseOutlined, ShoppingCartOutlined, EditOutlined, PlusOutlined, CheckCircleOutlined, ExclamationCircleOutlined } from "@ant-design/icons";
import GreenhouseButton from "@/shared/components/GreenhouseButton";
import DatePicker from "react-multi-date-picker";
import DateObject from "react-date-object";
import persian from "react-date-object/calendars/persian";
import persian_fa from "react-date-object/locales/persian_fa";

interface OrdersFormModalProps {
    open: boolean;
    setOpen: (open: boolean) => void;
    setLoading: (loading: boolean) => void;
    data?: any | null;
    refreshData: () => void;
    onSuccess?: (id: number) => void; // Callback to open QR modal after success
}

export default function OrdersFormModal({ open, setOpen, setLoading, data, refreshData, onSuccess }: OrdersFormModalProps) {
    const [form] = Form.useForm();
    const [internalLoading, setInternalLoading] = useState(false);
    const [message, setMessage] = useState<{ status: "ok" | "error"; message: string } | null>(null);

    const [people, setPeople] = useState<{ value: number; label: string; nationalCode?: string }[]>([]);
    const [suppliers, setSuppliers] = useState<{ value: number; label: string; licenseNumber?: string }[]>([]);
    const [seedPackages, setSeedPackages] = useState<any[]>([]);

    // Derived states for auto-fill logic
    const [rootstockDetails, setRootstockDetails] = useState<{ plantTitle: string; variety: string; producer: string } | null>(null);
    const [scionDetails, setScionDetails] = useState<{ plantTitle: string; variety: string; producer: string } | null>(null);

    const isEditMode = !!data;

    // Selected item extra info states
    const [selectedCustomer, setSelectedCustomer] = useState<string | null>(null);
    const [selectedManager, setSelectedManager] = useState<string | null>(null);
    const [selectedSupplier, setSelectedSupplier] = useState<string | null>(null);

    useEffect(() => {
        if (open) {
            fetchOptions();
            setMessage(null);
            if (isEditMode && data) {
                // Populate form
                form.setFieldsValue({
                    OrderCode: data.OrderCode,
                    CustomerID: data.CustomerID,
                    ProjectManager: data.ProjectManager,
                    SupplierID: data.SupplierID,
                    OrderCount: data.OrderCount,
                    OrderDate: data.OrderDate ? new DateObject(new Date(data.OrderDate)).convert(persian, persian_fa) : null,
                    RootstockID: data.RootstockID,
                    ScionID: data.ScionID,
                });

                // Set initial extra info for edit mode
                // Note: We need the lists to be loaded to find the matching codes.
                // Since fetchOptions is async, we doing it here might be too early if relying on 'people' state.
                // However, we can use the 'data' prop if it has relations populated.

                if (data.Tbl_People_Tbl_Orders_CustomerIDToTbl_People) {
                    setSelectedCustomer(data.Tbl_People_Tbl_Orders_CustomerIDToTbl_People.NationalCode);
                }
                if (data.Tbl_People_Tbl_Orders_ProjectManagerToTbl_People) {
                    setSelectedManager(data.Tbl_People_Tbl_Orders_ProjectManagerToTbl_People.NationalCode);
                }
                if (data.Tbl_suppliers) {
                    setSelectedSupplier(data.Tbl_suppliers.LicenseNumber);
                }

                // Trigger auto-fill logic manually for edit mode
                if (data.Tbl_SeedPackage_Tbl_Orders_RootstockIDToTbl_SeedPackage) {
                    const pkg = data.Tbl_SeedPackage_Tbl_Orders_RootstockIDToTbl_SeedPackage;
                    setRootstockDetails({
                        plantTitle: pkg.Tbl_plantVariety?.Tbl_Plants?.CommonName || "—",
                        variety: pkg.Tbl_plantVariety?.VarietyName || "—",
                        producer: pkg.ProducerCompany || pkg.Tbl_suppliers?.CompanyName || "—"
                    });
                }
                if (data.Tbl_SeedPackage_Tbl_Orders_ScionIDToTbl_SeedPackage) {
                    const pkg = data.Tbl_SeedPackage_Tbl_Orders_ScionIDToTbl_SeedPackage;
                    setScionDetails({
                        plantTitle: pkg.Tbl_plantVariety?.Tbl_Plants?.CommonName || "—",
                        variety: pkg.Tbl_plantVariety?.VarietyName || "—",
                        producer: pkg.ProducerCompany || pkg.Tbl_suppliers?.CompanyName || "—"
                    });
                }

            } else {
                form.resetFields();
                setRootstockDetails(null);
                setScionDetails(null);
                setSelectedCustomer(null);
                setSelectedManager(null);
                setSelectedSupplier(null);
            }
        }
    }, [open, data, isEditMode, form]);

    const fetchOptions = async () => {
        const [ownersRes, suppliersData, seedsData] = await Promise.all([
            getAllOwners(),
            getSuppliers(),
            getAllSeedPackages()
        ]);

        if (ownersRes.status === "ok" && Array.isArray(ownersRes.dta)) {
            setPeople(ownersRes.dta.map((p: any) => ({
                value: p.ID,
                label: `${p.FirstName} ${p.LastName}`,
                nationalCode: p.NationalCode
            })));
        }

        if (suppliersData) {
            setSuppliers(suppliersData.map((s: any) => ({
                value: s.ID,
                label: s.CompanyName || `${s.FirstName} ${s.LastName}`,
                licenseNumber: s.LicenseNumber
            })));
        }

        if (seedsData) {
            setSeedPackages(seedsData);
        }
    };

    const handlePersonChange = (value: number, type: 'customer' | 'manager') => {
        const person = people.find(p => p.value === value);
        if (type === 'customer') {
            setSelectedCustomer(person?.nationalCode || null);
        } else {
            setSelectedManager(person?.nationalCode || null);
        }
    };

    const handleSupplierChange = (value: number) => {
        const supplier = suppliers.find(s => s.value === value);
        setSelectedSupplier(supplier?.licenseNumber || null);
    };

    const handleRootstockChange = (value: number) => {
        const pkg = seedPackages.find(p => p.ID === value);
        if (pkg) {
            setRootstockDetails({
                plantTitle: pkg.Tbl_plantVariety?.Tbl_Plants?.CommonName || "—",
                variety: pkg.Tbl_plantVariety?.VarietyName || "—",
                producer: pkg.ProducerCompany || pkg.Tbl_suppliers?.CompanyName || "—"
            });
        } else {
            setRootstockDetails(null);
        }
    };

    const handleScionChange = (value: number) => {
        const pkg = seedPackages.find(p => p.ID === value);
        if (pkg) {
            setScionDetails({
                plantTitle: pkg.Tbl_plantVariety?.Tbl_Plants?.CommonName || "—",
                variety: pkg.Tbl_plantVariety?.VarietyName || "—",
                producer: pkg.ProducerCompany || pkg.Tbl_suppliers?.CompanyName || "—"
            });
        } else {
            setScionDetails(null);
        }
    };

    const handleFinish = async (values: any) => {
        setInternalLoading(true);
        setLoading(true);
        setMessage(null);

        const dataToSubmit = {
            ...values,
            OrderDate: values.OrderDate instanceof DateObject ? values.OrderDate.toDate() : undefined,
        };

        if (isEditMode && data?.ID) {
            const res = await updateOrder(data.ID, dataToSubmit);
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
        } else {
            const res = await createOrder(dataToSubmit);
            setLoading(false);
            setInternalLoading(false);

            if (res.status === "ok") {
                setMessage({ status: "ok", message: res.message });
                setTimeout(() => {
                    setOpen(false);
                    refreshData();
                    form.resetFields();
                    if (onSuccess && res.orderId) onSuccess(res.orderId);
                }, 1000);
            } else {
                setMessage({ status: "error", message: res.message });
            }
        }
    };

    const handleClose = () => {
        setOpen(false);
        setMessage(null);
        if (!isEditMode) {
            form.resetFields();
            setSelectedCustomer(null);
            setSelectedManager(null);
            setSelectedSupplier(null);
        }
    };

    // Seed Package Options for Select
    const seedOptions = seedPackages.map(p => ({
        value: p.ID,
        label: p.SerialNumber
    }));

    // Common input styles
    const inputStyleClass = `rounded-xl border-2 border-slate-200 dark:border-slate-700 transition-all shadow-sm hover:shadow w-full dark:bg-slate-800 dark:text-white dark:placeholder-slate-500 ${isEditMode
        ? "hover:border-amber-300 dark:hover:border-amber-700 focus:border-amber-400 dark:focus:border-amber-600"
        : "hover:border-emerald-300 dark:hover:border-emerald-700 focus:border-emerald-400 dark:focus:border-emerald-600"
        }`;
    const inputStyle = { height: "46px", fontSize: "14px" };
    const readOnlyInputStyle = { ...inputStyle, backgroundColor: "#f8fafc", color: "#64748b" }; // slate-50, slate-500

    // Header Color Logic
    const headerGradient = isEditMode
        ? "from-amber-50 via-orange-50/80 to-white dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 border-amber-100 dark:border-slate-700"
        : "from-emerald-50 via-lime-50/80 to-white dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 border-emerald-100 dark:border-slate-700";

    const iconGradient = isEditMode
        ? "from-amber-500 via-amber-600 to-orange-600"
        : "from-emerald-500 via-emerald-600 to-emerald-700";

    const renderInfoCard = (label: string, value: string | null | undefined) => {
        if (!value) return null;
        return (
            <div className="mt-2 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-100 rounded-lg px-3 py-1.5 flex items-center justify-between shadow-sm animate-fadeIn">
                <div className="flex items-center gap-2">
                    <CheckCircleOutlined className="text-blue-500 text-xs" />
                    <span className="text-xs text-blue-600 font-bold">{label}</span>
                </div>
                <span className="text-sm font-mono font-bold text-slate-700 tracking-wider bg-white/50 px-2 rounded">{value}</span>
            </div>
        );
    };

    const renderSeedSection = (title: string, formName: string, details: any, onChange: (val: number) => void) => (
        <div className="border-2 border-slate-200 dark:border-slate-700 rounded-2xl p-5 mb-6 bg-white dark:bg-slate-900 relative overflow-hidden">
            <div className="absolute top-0 right-0 bg-slate-200 dark:bg-slate-800 px-4 py-1 rounded-bl-xl text-sm font-bold text-slate-600 dark:text-slate-300">
                {title}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mt-4">
                {/* Row 1 */}
                <Form.Item name={formName} label={<span className="font-semibold">کد بسته بذر</span>} className="mb-0">
                    <Select
                        options={seedOptions}
                        onChange={onChange}
                        placeholder="انتخاب کد بسته"
                        showSearch
                        optionFilterProp="label"
                        size="large"
                        className="w-full"
                        style={{ height: "46px" }}
                    />
                </Form.Item>

                <div className="flex flex-col gap-2">
                    <span className="font-semibold mb-[2px]">عنوان گیاه</span>
                    <Input
                        value={details?.plantTitle || "—"}
                        readOnly
                        className={inputStyleClass}
                        style={readOnlyInputStyle}
                    />
                </div>

                {/* Row 2 */}
                <div className="flex flex-col gap-2">
                    <span className="font-semibold mb-[2px]">واریته - رقم</span>
                    <Input
                        value={details?.variety || "—"}
                        readOnly
                        className={inputStyleClass}
                        style={readOnlyInputStyle}
                    />
                </div>

                <div className="flex flex-col gap-2">
                    <span className="font-semibold mb-[2px]">کمپانی تولید کننده</span>
                    <Input
                        value={details?.producer || "—"}
                        readOnly
                        className={inputStyleClass}
                        style={readOnlyInputStyle}
                    />
                </div>
            </div>
        </div>
    );

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
            <div className={`relative px-6 py-6 bg-gradient-to-br border-b ${headerGradient}`}>
                <button onClick={handleClose} className="absolute top-5 left-5 p-2 rounded-xl hover:bg-black/5 transition-colors">
                    <CloseOutlined className="text-slate-500" />
                </button>
                <div className="flex items-center gap-4">
                    <div className={`h-14 w-14 rounded-2xl bg-gradient-to-br shadow-lg flex items-center justify-center text-white ${iconGradient}`}>
                        {isEditMode ? <EditOutlined className="text-2xl" /> : <PlusOutlined className="text-2xl" />}
                    </div>
                    <div>
                        <h3 className="font-bold text-2xl text-slate-800 dark:text-slate-100">{isEditMode ? "ویرایش سفارش" : "ثبت سفارش جدید"}</h3>
                        <p className="text-sm opacity-70">اطلاعات سفارش را با دقت وارد کنید</p>
                    </div>
                </div>
            </div>

            <div className="px-6 py-6 bg-slate-50/50 dark:bg-slate-950 max-h-[75vh] overflow-y-auto">
                <Form form={form} layout="vertical" onFinish={handleFinish} requiredMark={false}>

                    {/* General Info */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-8">
                        <Form.Item name="OrderCode" label={<span className="font-semibold">کد سفارش</span>} rules={[{ required: true }]}>
                            <Input placeholder="ORD-XXXX" className={inputStyleClass} style={inputStyle} />
                        </Form.Item>
                        <div className="flex flex-col">
                            <Form.Item name="CustomerID" label={<span className="font-semibold">نام مشتری</span>} rules={[{ required: true }]} className="mb-0">
                                <Select
                                    options={people}
                                    onChange={(val) => handlePersonChange(val, 'customer')}
                                    placeholder="انتخاب کنید"
                                    showSearch
                                    optionFilterProp="label"
                                    size="large"
                                    className="w-full"
                                    style={{ height: "46px" }}
                                />
                            </Form.Item>
                            {renderInfoCard("کد ملی مشتری", selectedCustomer)}
                        </div>
                        <div className="flex flex-col">
                            <Form.Item name="ProjectManager" label={<span className="font-semibold">مدیر پروژه</span>} rules={[{ required: true }]} className="mb-0">
                                <Select
                                    options={people}
                                    onChange={(val) => handlePersonChange(val, 'manager')}
                                    placeholder="انتخاب کنید"
                                    showSearch
                                    optionFilterProp="label"
                                    size="large"
                                    className="w-full"
                                    style={{ height: "46px" }}
                                />
                            </Form.Item>
                            {renderInfoCard("کد ملی مدیر", selectedManager)}
                        </div>
                        <div className="flex flex-col">
                            <Form.Item name="SupplierID" label={<span className="font-semibold">نام مجری</span>} rules={[{ required: true }]} className="mb-0">
                                <Select
                                    options={suppliers}
                                    onChange={handleSupplierChange}
                                    placeholder="انتخاب کنید"
                                    showSearch
                                    optionFilterProp="label"
                                    size="large"
                                    className="w-full"
                                    style={{ height: "46px" }}
                                />
                            </Form.Item>
                            {renderInfoCard("شناسه", selectedSupplier)}
                        </div>
                        <Form.Item name="OrderCount" label={<span className="font-semibold">تعداد سفارش</span>} rules={[{ required: true }]}>
                            <InputNumber className={inputStyleClass} style={{ ...inputStyle, width: "100%", paddingTop: "4px" }} placeholder="0" controls={false} />
                        </Form.Item>
                        <Form.Item name="OrderDate" label={<span className="font-semibold">تاریخ ثبت سفارش</span>}>
                            <DatePicker calendar={persian} locale={persian_fa} calendarPosition="bottom-right" inputClass={`${inputStyleClass} !h-[46px] px-3`} containerClassName="w-full" />
                        </Form.Item>
                    </div>

                    {renderSeedSection("بذر پایه Rootstock", "RootstockID", rootstockDetails, handleRootstockChange)}
                    {renderSeedSection("بذر پیوندک Scion", "ScionID", scionDetails, handleScionChange)}

                    {message && (
                        <div className={`p-4 rounded-xl mb-4 ${message.status === "ok" ? "bg-emerald-100 text-emerald-800" : "bg-rose-100 text-rose-800"}`}>
                            {message.message}
                        </div>
                    )}

                    <div className="flex justify-end gap-3 pt-4 border-t">
                        <GreenhouseButton text="انصراف" variant="secondary" onClick={handleClose} disabled={internalLoading} />
                        <GreenhouseButton text="ثبت سفارش" variant="primary" type="submit" loading={internalLoading} />
                    </div>
                </Form>
            </div>
        </Modal>
    );
}
