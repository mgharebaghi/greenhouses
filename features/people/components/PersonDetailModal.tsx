"use client";

import DetailModal, { InfoCard } from "@/shared/components/DetailModal";
import PhoneNumberText from "@/shared/components/PhoneNumberText";
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
    >
      <InfoCard
        icon={<DashboardOutlined />}
        title="اطلاعات کلی"
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
        items={[
          {
            label: "تلفن",
            value: <PhoneNumberText value={data.PhoneNumber} />,
          },
          { label: "ایمیل", value: data.EmailAddress },
        ]}
      />
    </DetailModal>
  );
}
