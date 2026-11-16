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
          { label: "نوع شخص", value: data.Legal ? "حقوقی" : "حقیقی" },
          ...(data.Legal
            ? [
                { label: "نام شرکت", value: data.CompanyName },
                { label: "کد اقتصادی شرکت", value: data.CompanyEconomicCode },
                {
                  label: "شماره ثبت شرکت",
                  value: data.CompanyRegistrationCode,
                },
              ]
            : [
                { label: "نام", value: data.FirstName },
                { label: "نام خانوادگی", value: data.LastName },
              ]),
          {
            label: data.Legal ? "کد شخص حقوقی" : "کد شخص حقیقی",
            value: data.PersonCode,
          },
          {
            label: data.Legal ? "شناسه ملی" : "کد ملی",
            value: data.NationalCode,
          },
          { label: "تخصص", value: data.Profession },
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
