"use client";

import DetailModal, { InfoCard } from "@/app/dashboard/_components/UI/DetailModal";
import { Tag } from "antd";
import dayjs from "dayjs";
import jalaliday from "jalaliday";
import {
    FileTextOutlined,
    ContainerOutlined,
    InboxOutlined,
    InfoCircleOutlined
} from "@ant-design/icons";

dayjs.extend(jalaliday);

interface DetailModalProps {
    open: boolean;
    onCancel: () => void;
    data: any;
}

export default function SeedWarehousingDetailModal({
    open,
    onCancel,
    data,
}: DetailModalProps) {
    if (!data) return null;

    const formatDate = (date: string | Date | null | undefined) => {
        if (!date) return "—";
        return dayjs(date).calendar("jalali").locale("fa").format("YYYY/MM/DD");
    };

    const trxType = data.TransactionType
        ? { text: "ورودی", color: "green" }
        : { text: "خروجی", color: "red" };

    return (
        <DetailModal
            open={open}
            onClose={onCancel}
            title="جزئیات تراکنش انبار"
            icon={<FileTextOutlined />}
            gradientFrom="emerald"
            gradientTo="teal"
            children={
                <>
                    {/* General Info */}
                    <InfoCard
                        title="اطلاعات کلی تراکنش"
                        icon={<InfoCircleOutlined />}
                        color="#10b981"
                        items={[
                            { label: "شماره ثبت", value: data.TransactionID },
                            { label: "نوع تراکنش", value: <Tag color={trxType.color}>{trxType.text}</Tag> },
                            { label: "تاریخ تراکنش", value: formatDate(data.TransactionDate) },
                            { label: "تعداد بسته", value: data.PackageQuantity },
                        ]}
                    />

                    {/* Warehouse Info */}
                    <InfoCard
                        title="جزئیات انبار"
                        icon={<ContainerOutlined />}
                        color="#3b82f6"
                        items={[
                            { label: "نام انبار", value: data.Warehouses?.WarehouseName || "—" },
                            { label: "محل انبار", value: data.Warehouses?.WarehouseLocation || "—" },
                            { label: "مدیر انبار", value: data.Warehouses?.Owner_Observer?.LastName || "—" },
                        ]}
                    />

                    {/* Seed Package Info */}
                    <InfoCard
                        title="جزئیات بسته بذر"
                        icon={<InboxOutlined />}
                        color="#f59e0b"
                        items={[
                            { label: "شماره سریال", value: data.SeedPackage?.SerialNumber || "—" },
                            { label: "نوع بسته", value: data.SeedPackage?.PackageType || "—" },
                            { label: "وزن (گرم)", value: data.SeedPackage?.WeightGram || "—" },
                        ]}
                    />

                    {/* Other Info */}
                    <InfoCard
                        title="سایر اطلاعات"
                        icon={<FileTextOutlined />}
                        color="#64748b"
                        items={[
                            { label: "مقصد/منبع", value: data.DestinationType || "—" },
                            { label: "ثبت کننده", value: data.RecordedBy || "—" },
                        ]}
                    />
                </>
            }
        />
    );
}
