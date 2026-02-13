"use client";
import DetailModal, { InfoCard } from "@/shared/components/DetailModal";
import {
    ExperimentOutlined,
    DashboardOutlined,
    ThunderboltOutlined,
    SafetyCertificateOutlined,
} from "@ant-design/icons";

interface NurseryRoomsDetailModalProps {
    open: boolean;
    onClose: () => void;
    data: any | null;
}

export default function NurseryRoomsDetailModal({ open, onClose, data }: NurseryRoomsDetailModalProps) {
    if (!data) return null;

    const formatDate = (date: string | Date | null | undefined) => {
        if (!date) return "—";
        return new Date(date).toLocaleDateString("fa-IR");
    };

    return (
        <DetailModal
            open={open}
            onClose={onClose}
            title="جزئیات اتاق نشاء"
            icon={<ExperimentOutlined />}
            gradientFrom="emerald"
            gradientTo="teal"
        >
            {/* اطلاعات کلی */}
            <InfoCard
                title="اطلاعات کلی"
                icon={<DashboardOutlined />}
                color="#10b981"
                items={[
                    { label: "کد اتاق", value: data.NurseryRoomCode },
                    { label: "نام اتاق", value: data.NurseryRoomName },
                    { label: "تاریخ ایجاد", value: formatDate(data.NurseryRoomCreatedAt) },
                ]}
            />

            {/* شرایط محیطی */}
            <InfoCard
                title="شرایط محیطی"
                icon={<ThunderboltOutlined />}
                color="#3b82f6"
                items={[
                    { label: "حداقل دما", value: data.TemperatureMin ? `${data.TemperatureMin} °C` : "—" },
                    { label: "حداکثر دما", value: data.TemperatureMax ? `${data.TemperatureMax} °C` : "—" },
                    { label: "حداقل رطوبت", value: data.HumidityMin ? `${data.HumidityMin} %` : "—" },
                    { label: "حداکثر رطوبت", value: data.HumidityMax ? `${data.HumidityMax} %` : "—" },
                ]}
            />

            {/* روشنایی و بهداشت */}
            <InfoCard
                title="روشنایی و بهداشت"
                icon={<SafetyCertificateOutlined />}
                color="#f59e0b"
                items={[
                    { label: "نوع نور", value: data.LightType },
                    { label: "ساعات روشنایی", value: data.LightHoursPerDay ? `${data.LightHoursPerDay} ساعت` : "—" },
                    { label: "میزان CO2", value: data.CO2Range },
                    { label: "روش استریلیزاسیون", value: data.StrelizationMethod },
                ]}
            />
        </DetailModal>
    );
}
