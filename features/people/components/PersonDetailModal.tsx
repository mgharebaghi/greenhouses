"use client";

import DetailModal, { InfoCard } from "@/shared/components/DetailModal";
import {
  DashboardOutlined,
  PhoneOutlined,
  ProfileOutlined,
} from "@ant-design/icons";
import { PeopleReadDTO } from "../schema";

interface PersonDetailModalProps {
  open: boolean;
  onClose: () => void;
  data: PeopleReadDTO | null;
}

export default function PersonDetailModal({
  open,
  onClose,
  data,
}: PersonDetailModalProps) {
  if (!data) return null;

  return (
    <DetailModal
      open={open}
      onClose={onClose}
      title="اطلاعات کامل شخص"
      icon={<ProfileOutlined />}
      gradientFrom="emerald"
      gradientTo="teal"
    >
      <InfoCard
        icon={<DashboardOutlined />}
        title="اطلاعات کلی"
        color="#10b981"
        items={[
          { label: "نام", value: data.FirstName },
          { label: "نام خانوادگی", value: data.LastName },
          { label: "کد شخص", value: data.PersonCode },
          { label: "کد ملی", value: data.NationalCode },
          { label: "تخصص", value: data.Profesion },
          { label: "پست پیشنهادی", value: data.PostName },
        ]}
      />
      <InfoCard
        icon={<PhoneOutlined />}
        title="اطلاعات تماس"
        color="#82a7d1ff"
        items={[
          { label: "تلفن", value: data.PhoneNumber },
          { label: "ایمیل", value: data.EmailAddress },
        ]}
      />
    </DetailModal>
  );
}
