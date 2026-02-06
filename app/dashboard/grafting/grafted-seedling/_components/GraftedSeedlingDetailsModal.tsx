"use client";

import DetailModal, { InfoCard } from "../../../_components/UI/DetailModal";
import {
    ExperimentOutlined,
    IdcardOutlined,
    BranchesOutlined,
    SafetyCertificateOutlined,
    EditOutlined,
    QrcodeOutlined,
    DeploymentUnitOutlined
} from "@ant-design/icons";
import dayjs from "dayjs";
import jalaliday from "jalaliday";
import Image from "next/image";

dayjs.extend(jalaliday);

interface GraftedSeedlingDetailsModalProps {
    open: boolean;
    setOpen: (open: boolean) => void;
    data: any;
}

export default function GraftedSeedlingDetailsModal({
    open,
    setOpen,
    data
}: GraftedSeedlingDetailsModalProps) {
    if (!data) return null;

    const onClose = () => setOpen(false);

    const formatDate = (date: string | Date | null | undefined) => {
        if (!date) return "—";
        return dayjs(date).calendar("jalali").locale("fa").format("YYYY/MM/DD");
    };

    // Helper to Convert Buffer/Bytes to Base64 for Image
    const getQrImage = () => {
        const qr = data.GraftingOperation?.NurserySeed?.SeedPackage?.QRCode;
        if (!qr) return null;
        return qr;
    };

    const qrImageSrc = getQrImage();
    const seedPackage = data.GraftingOperation?.NurserySeed?.SeedPackage;

    const supplier = data.GraftingOperation?.RootStockPlant?.Suppliers;
    const supplierName = supplier?.CompanyName && supplier?.CompanyName !== '-'
        ? supplier.CompanyName
        : (supplier?.FirstName || supplier?.LastName ? `${supplier.FirstName || ''} ${supplier.LastName || ''}`.trim() : "—");

    return (
        <DetailModal
            open={open}
            onClose={onClose}
            title="جزئیات نشاء پیوندی"
            icon={<ExperimentOutlined />}
            gradientFrom="emerald"
            gradientTo="teal"
        >
            {/* Column 1: Specs & Result */}
            <div className="flex flex-col gap-4">
                <InfoCard
                    title="مشخصات محصول"
                    icon={<IdcardOutlined />}
                    color="#10b981"
                    items={[
                        { label: "شناسه گیاه", value: `#${data.GraftedPlantID}` },
                        { label: "شناسه عملیات پیوند", value: `#${data.GraftingID}` },
                        { label: "کیفیت", value: data.QualityGrade || "—" },
                        { label: "نرخ بقا", value: data.SurvivalRate ? `${data.SurvivalRate}%` : "—" },
                        { label: "تاریخ آماده‌سازی", value: formatDate(data.ReadyForSaleDate) },
                    ]}
                />

                <InfoCard
                    title="مشخصات بذر (والد)"
                    icon={<BranchesOutlined />}
                    color="#f59e0b"
                    items={[
                        { label: "نام گونه (نشاء)", value: seedPackage?.SeedBatch?.PlantVarities?.VarietyName || "—" },
                        { label: "شماره سریال بسته", value: seedPackage?.SerialNumber || "—" },
                        { label: "نوع بسته", value: seedPackage?.PackageType || "—" },
                        { label: "وضعیت بسته", value: seedPackage?.Status || "—" },
                    ]}
                />
            </div>

            {/* Column 2: Rootstock, Notes & QR */}
            <div className="flex flex-col gap-4">
                <InfoCard
                    title="پایه (Rootstock)"
                    icon={<DeploymentUnitOutlined />}
                    color="#3b82f6"
                    items={[
                        { label: "کد پایه", value: data.GraftingOperation?.RootstockID ? `#${data.GraftingOperation.RootstockID}` : "—" },
                        { label: "نام گونه", value: data.GraftingOperation?.RootStockPlant?.PlantVarities?.VarietyName || "—" },
                        { label: "کد بچ", value: data.GraftingOperation?.RootStockPlant?.BatchCode || "—" },
                        { label: "تامین کننده", value: supplierName },
                        { label: "تاریخ تولید", value: formatDate(data.GraftingOperation?.RootStockPlant?.ProductionDate) },
                        { label: "وضعیت سلامت", value: data.GraftingOperation?.RootStockPlant?.HealthStatus || "—" },
                        { label: "مرحله رشد", value: data.GraftingOperation?.RootStockPlant?.GrowthStage || "—" },
                    ]}
                />



                {data.GraftedPlantNotes && (
                    <InfoCard
                        title="یادداشت‌ها"
                        icon={<EditOutlined />}
                        color="#64748b"
                        items={[
                            { label: "توضیحات", value: data.GraftedPlantNotes, span: true }
                        ]}
                    />
                )}
            </div>
        </DetailModal>
    );
}

// Custom Icon helper since I didn't import DeploymentUnit explicitly correctly initially?
// Actually I missed importing DeploymentUnitOutlined in the top list. I'll add it or use a replacement.
// Wait, I can just use BranchesOutlined again or something similar.
// Let's use BranchesOutlined for rootstock too, or create a simple wrapper.
// Actually, let's fix the import.

// Wait, DeploymentUnitOutlined is a standard Antd icon. I'll just import it properly.
