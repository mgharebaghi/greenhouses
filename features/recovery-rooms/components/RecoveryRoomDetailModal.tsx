"use client";

import { formatPersianDate } from "@/shared/dates/calendar";

import { publicOrderUrl } from "@/shared/config/public-urls";

import DetailModal, {
  DetailIdentity,
  InfoCard,
} from "@/shared/components/DetailModal";
import QRCodeCanvas from "@/shared/components/QRCodeCanvas";
import {
  CalendarOutlined,
  CheckCircleOutlined,
  ExperimentOutlined,
  UsergroupAddOutlined,
} from "@ant-design/icons";
import { RecoveryRoomListItem } from "../types";

interface RecoveryRoomDetailModalProps {
  open: boolean;
  onClose: () => void;
  data: RecoveryRoomListItem | null;
}

export default function RecoveryRoomDetailModal({
  open,
  onClose,
  data,
}: RecoveryRoomDetailModalProps) {
  if (!data) return null;

  const op = data.Tbl_GraftingOperation;
  const customer = op?.Tbl_Orders?.Tbl_People_Tbl_Orders_CustomerIDToTbl_People;
  const customerName = customer
    ? `${customer.FirstName} ${customer.LastName}`
    : "—";

  return (
    <DetailModal
      open={open}
      onClose={onClose}
      title={`جزئیات اتاق ریکاوری - ${op?.Tbl_Orders?.OrderCode || "—"}`}
      icon={<CheckCircleOutlined />}
      width={850}
    >
      <div className="flex flex-col gap-4">
        <DetailIdentity
          label="کد سفارش"
          code={op?.Tbl_Orders?.OrderCode}
          id={data.ID}
        >
          {op?.OrderID && (
            <QRCodeCanvas value={publicOrderUrl(op.OrderID)} size={104} />
          )}
        </DetailIdentity>
        <div className="grid min-w-0 grid-cols-1 gap-3 md:grid-cols-2">
          {/* اطلاعات پایه */}
          <InfoCard
            title="اطلاعات سفارش"
            icon={<ExperimentOutlined />}
            items={[
              { label: "کد سفارش", value: op?.Tbl_Orders?.OrderCode || "—" },
              { label: "نام مشتری", value: customerName },
              {
                label: "تعداد سینی",
                value: op?.TrayNumber,
              },
              {
                label: "تاریخ پیوند‌زنی",
                value: formatPersianDate(op?.GraftingDate),
              },
            ]}
          />

          {/* اطلاعات ریکاوری */}
          <InfoCard
            title="وضعیت ریکاوری"
            icon={<CalendarOutlined />}
            items={[
              {
                label: "تاریخ ورود",
                value: formatPersianDate(data.RecoveryEntryDate),
              },
              {
                label: "تاریخ خروج",
                value: formatPersianDate(data.RecoveryExitDate),
              },
              {
                label: "مجموع کل تلفات",
                value: data.GraftedLossCount,
              },
            ]}
          />
        </div>

        {/* Workers List - Full Width */}
        {op?.Tbl_GraftWorkers && op.Tbl_GraftWorkers.length > 0 && (
          <div className="w-full">
            <InfoCard
              title={`جزئیات تلفات به تفکیک پیوندزن (${op.Tbl_GraftWorkers.length} نفر)`}
              icon={<UsergroupAddOutlined />}
              items={[
                {
                  label: "",
                  value: (
                    <div className="flex flex-col gap-2 w-full mt-2">
                      {op.Tbl_GraftWorkers.map((worker, idx) => {
                        const person = worker.Tbl_People;
                        const fullName = person
                          ? `${person.FirstName} ${person.LastName}`
                          : "—";
                        const nationalCode = person?.NationalCode || "—";

                        return (
                          <div
                            key={worker.ID}
                            className="bg-slate-50 dark:bg-slate-700/50 px-4 py-3 rounded-xl text-sm border border-slate-100 dark:border-slate-600 flex flex-col sm:flex-row sm:items-center justify-between hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors gap-3"
                          >
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center text-sm font-bold shadow-sm">
                                {idx + 1}
                              </div>
                              <div className="flex flex-col">
                                <span className="text-slate-800 dark:text-slate-200 font-bold">
                                  {fullName}
                                </span>
                                <span className="record-detail-label text-xs">
                                  کد ملی:{" "}
                                  <span className="font-mono">
                                    {nationalCode}
                                  </span>
                                </span>
                              </div>
                            </div>

                            <div className="flex items-center justify-between sm:justify-end gap-6 sm:w-auto w-full mt-2 sm:mt-0 pl-2 sm:pl-0 border-t sm:border-t-0 border-slate-200 dark:border-slate-600 pt-2 sm:pt-0">
                              <div className="flex flex-col items-center">
                                <span className="record-detail-label text-xs mb-1">
                                  کد افراد
                                </span>
                                <span className="font-mono font-bold text-slate-700 dark:text-slate-100 bg-white dark:bg-slate-800 px-3 py-1 rounded-md text-xs border border-slate-200 dark:border-slate-500">
                                  {person?.PersonCode || "—"}
                                </span>
                              </div>
                              <div className="flex flex-col items-center border-r border-slate-200 dark:border-slate-600 pr-6">
                                <span className="text-xs text-rose-700 dark:text-rose-300 mb-1 font-semibold">
                                  تلفات فرد
                                </span>
                                <span className="text-base font-black text-rose-700 dark:text-rose-200 bg-rose-50 dark:bg-rose-900/40 px-3 py-0.5 rounded-lg border border-rose-200 dark:border-rose-800 shadow-sm">
                                  {worker.LossPerWorker || 0}
                                </span>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  ),
                  span: true,
                },
              ]}
            />
          </div>
        )}
      </div>
    </DetailModal>
  );
}
