"use client";

import { formatPersianDate } from "@/shared/dates/calendar";

import type { OrderDetails } from "../types/details";

import { publicOrderUrl } from "@/shared/config/public-urls";

import DetailModal, {
  DetailIdentity,
  InfoCard,
} from "@/shared/components/DetailModal";
import QRCodeCanvas from "@/shared/components/QRCodeCanvas";
import {
  ExperimentOutlined,
  ShoppingOutlined,
  UserOutlined,
} from "@ant-design/icons";

interface OrdersDetailModalProps {
  open: boolean;
  onClose: () => void;
  data: OrderDetails | null;
}

export default function OrdersDetailModal({
  open,
  onClose,
  data,
}: OrdersDetailModalProps) {
  if (!data) return null;

  const rootstockIdx =
    data.Tbl_SeedPackage_Tbl_Orders_RootstockIDToTbl_SeedPackage;
  const scionIdx = data.Tbl_SeedPackage_Tbl_Orders_ScionIDToTbl_SeedPackage;

  const getSeedInfo = (
    pkg: OrderDetails["Tbl_SeedPackage_Tbl_Orders_RootstockIDToTbl_SeedPackage"],
  ) => {
    if (!pkg) return { variety: "—", producer: "—", packageCode: "—" };
    const variety = pkg.Tbl_plantVariety?.VarietyName || "—";
    const plant = pkg.Tbl_plantVariety?.Tbl_Plants?.CommonName || "";
    const producer =
      pkg.ProducerCompany ||
      (pkg.Tbl_suppliers
        ? pkg.Tbl_suppliers.Legal
          ? pkg.Tbl_suppliers.CompanyName
          : `${pkg.Tbl_suppliers.FirstName} ${pkg.Tbl_suppliers.LastName}`
        : "—");

    return {
      variety: plant ? `${plant} - ${variety}` : variety,
      producer,
      packageCode: pkg.SerialNumber || String(pkg.ID),
    };
  };

  const rootstock = getSeedInfo(rootstockIdx);
  const scion = getSeedInfo(scionIdx);

  return (
    <DetailModal
      open={open}
      onClose={onClose}
      title="جزئیات سفارش"
      icon={<ShoppingOutlined />}
      width={800} // Ensuring enough width for the new layout
    >
      <div className="grid min-w-0 gap-3">
        <DetailIdentity label="کد سفارش" code={data.OrderCode} id={data.ID}>
          <QRCodeCanvas value={publicOrderUrl(data.ID)} size={104} />
        </DetailIdentity>
        <div className="grid min-w-0 grid-cols-1 gap-3 md:grid-cols-2">
          {/* اطلاعات سفارش */}
          <InfoCard
            title="اطلاعات سفارش"
            icon={<ShoppingOutlined />}
            items={[
              {
                label: "تعداد سفارش",
                value:
                  data.OrderCount != null
                    ? `${data.OrderCount.toLocaleString()} عدد`
                    : "—",
              },
              { label: "تاریخ ثبت", value: formatPersianDate(data.OrderDate) },
            ]}
          />

          {/* افراد مرتبط */}
          <InfoCard
            title="افراد مرتبط"
            icon={<UserOutlined />}
            items={[
              {
                label: "مشتری",
                value: data.Tbl_People_Tbl_Orders_CustomerIDToTbl_People
                  ? `${data.Tbl_People_Tbl_Orders_CustomerIDToTbl_People.FirstName} ${data.Tbl_People_Tbl_Orders_CustomerIDToTbl_People.LastName}`
                  : "—",
              },
              {
                label: "مدیر پروژه",
                value: data.Tbl_People_Tbl_Orders_ProjectManagerToTbl_People
                  ? `${data.Tbl_People_Tbl_Orders_ProjectManagerToTbl_People.FirstName} ${data.Tbl_People_Tbl_Orders_ProjectManagerToTbl_People.LastName}`
                  : "—",
              },
              {
                label: "نام مجری",
                value: data.Tbl_suppliers
                  ? data.Tbl_suppliers.Legal
                    ? data.Tbl_suppliers.CompanyName
                    : `${data.Tbl_suppliers.FirstName} ${data.Tbl_suppliers.LastName}`
                  : "—",
              },
            ]}
          />

          {/* بذر پایه */}
          <InfoCard
            title="بذر پایه (Rootstock)"
            icon={<ExperimentOutlined />}
            items={[
              { label: "کد بسته", value: rootstock.packageCode },
              { label: "واریته - رقم", value: rootstock.variety },
              { label: "تولید کننده", value: rootstock.producer },
            ]}
          />

          {/* بذر پیوندک */}
          <InfoCard
            title="بذر پیوندک (Scion)"
            icon={<ExperimentOutlined />}
            items={[
              { label: "کد بسته", value: scion.packageCode },
              { label: "واریته - رقم", value: scion.variety },
              { label: "تولید کننده", value: scion.producer },
            ]}
          />
        </div>
      </div>
    </DetailModal>
  );
}
