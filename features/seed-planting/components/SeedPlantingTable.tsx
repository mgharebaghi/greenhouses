"use client";

import { ActionFailure, runDeletion } from "@/shared/forms/delete-record";

import type { getSeedPlantings as SeedPlantingsQuery } from "@/features/seed-planting/actions";
import type { Column } from "@/shared/components/Table";
type SeedPlantingDetails = Awaited<
  ReturnType<typeof SeedPlantingsQuery>
>[number];

import {
  deleteSeedPlanting,
  getSeedPlantings,
} from "@/features/seed-planting/actions";
import type { SeedPlantingRecord } from "@/features/seed-planting/types/record";
import DeleteModal, { DeleteModalProps } from "@/shared/components/DeleteModal";
import DetailModal, { InfoCard } from "@/shared/components/DetailModal";
import InsertionRow from "@/shared/components/InsertionRow";
import Table from "@/shared/components/Table";
import TableActions from "@/shared/components/TableActions";
import {
  AppstoreOutlined,
  ExperimentOutlined,
  InfoCircleOutlined,
} from "@ant-design/icons";
import { Button } from "antd";
import dayjs from "dayjs";
import { download, generateCsv, mkConfig } from "export-to-csv";
import jalaliday from "jalaliday";
import { useState } from "react";
import SeedPlantingFormModal from "./SeedPlantingFormModal";

dayjs.extend(jalaliday);

interface SeedPlantingTableProps {
  data: SeedPlantingDetails[];
  loading: boolean;
  setMainLoading: (loading: boolean) => void;
  setMainData: (data: SeedPlantingDetails[]) => void;
}

export default function SeedPlantingTable({
  data,
  loading,
  setMainData,
  setMainLoading,
}: SeedPlantingTableProps) {
  const [deleteModal, setDeleteModal] = useState<DeleteModalProps | null>(null);
  const [viewModal, setViewModal] = useState(false);
  const [viewRecord, setViewRecord] = useState<SeedPlantingDetails | null>(
    null,
  );
  const [formModal, setFormModal] = useState<{
    open: boolean;
    record: SeedPlantingRecord | null;
  }>({
    open: false,
    record: null,
  });

  const getVarietyName = (record: SeedPlantingDetails) => {
    if (!record?.Tbl_Orders) return "---";

    let packageData = null;
    if (record.SeedType === true) {
      // Scion
      packageData =
        record.Tbl_Orders.Tbl_SeedPackage_Tbl_Orders_ScionIDToTbl_SeedPackage;
    } else if (record.SeedType === false) {
      // Rootstock
      packageData =
        record.Tbl_Orders
          .Tbl_SeedPackage_Tbl_Orders_RootstockIDToTbl_SeedPackage;
    }

    if (packageData && packageData.Tbl_plantVariety) {
      return packageData.Tbl_plantVariety.VarietyName || "نامشخص";
    }

    return "---";
  };
  const getSeedPackageInfo = (record: SeedPlantingDetails) => {
    if (!record?.Tbl_Orders) return null;

    let packageData = null;
    if (record.SeedType === true) {
      // Scion
      packageData =
        record.Tbl_Orders.Tbl_SeedPackage_Tbl_Orders_ScionIDToTbl_SeedPackage;
    } else if (record.SeedType === false) {
      // Rootstock
      packageData =
        record.Tbl_Orders
          .Tbl_SeedPackage_Tbl_Orders_RootstockIDToTbl_SeedPackage;
    }

    return packageData;
  };
  const columns: Column<SeedPlantingDetails>[] = [
    {
      title: "جزئیات",
      key: "details",
      width: 80,
      align: "center",
      render: (_: unknown, record: SeedPlantingDetails) => (
        <Button
          type="text"
          icon={
            <InfoCircleOutlined
              style={{ fontSize: "18px", color: "#10b981" }}
            />
          }
          onClick={() => {
            setViewRecord(record);
            setViewModal(true);
          }}
        />
      ),
    },
    {
      title: "کد سفارش",
      dataIndex: "Tbl_Orders",
      key: "OrderCode",
      render: (order: SeedPlantingDetails["Tbl_Orders"]) => (
        <span className="font-semibold text-slate-700">
          {order?.OrderCode || "-"}
        </span>
      ),
    },
    {
      title: "گلخانه",
      dataIndex: "Tbl_Greenhouses",
      key: "Greenhouse",
      render: (gh: SeedPlantingDetails["Tbl_Greenhouses"]) => (
        <span className="text-slate-600">{gh?.GreenhouseName || "-"}</span>
      ),
    },
    {
      title: "بذر",
      key: "SeedInfo",
      render: (_: unknown, record: SeedPlantingDetails) => {
        const variety = getVarietyName(record);
        const type =
          record.SeedType === true
            ? "پیوندی"
            : record.SeedType === false
              ? "پایه"
              : "-";
        return (
          <div className="flex flex-col">
            <span className="text-xs font-bold text-slate-700">{variety}</span>
            <span className="text-[10px] text-slate-500">{type}</span>
          </div>
        );
      },
    },
    {
      title: "تاریخ کاشت",
      dataIndex: "PlantingDate",
      key: "PlantingDate",
      render: (val: string) => (
        <span className="text-slate-600">
          {val ? dayjs(val).calendar("jalali").format("YYYY/MM/DD") : "-"}
        </span>
      ),
    },
    {
      title: "تعداد کاشت",
      dataIndex: "SeedPlantingNumber",
      key: "SeedPlantingNumber",
      render: (val: number) => (
        <span className="text-slate-600 font-mono">
          {val ? val.toLocaleString() : "-"}
        </span>
      ),
    },
    {
      title: "تکنسین",
      dataIndex: "Tbl_People",
      key: "Technician",
      render: (p: SeedPlantingDetails["Tbl_People"]) => (
        <span>{p ? `${p.FirstName} ${p.LastName}` : "-"}</span>
      ),
    },
    {
      title: "عملیات",
      key: "actions",
      render: (_: unknown, record: SeedPlantingDetails) => (
        <TableActions
          onDelete={() =>
            setDeleteModal({
              open: true,
              id: record.ID,
              name: `کشت سفارش ${record.Tbl_Orders?.OrderCode}`,
              onClose: () => setDeleteModal(null),
              onDelete: handleDelete,
            })
          }
          onEdit={() => setFormModal({ open: true, record: record })}
        />
      ),
    },
  ];

  const handleDelete = async (id: number) => {
    await runDeletion(
      async () => {
        setMainLoading(true);
        const res = await deleteSeedPlanting(id);
        if (res.status !== "ok") throw new ActionFailure(res.message);
        {
          await refreshData();
          setDeleteModal(null);
        }
        setMainLoading(false);
      },
      () => {
        setMainLoading(false);
      },
    );
  };

  const refreshData = async () => {
    setMainLoading(true);
    const newData = await getSeedPlantings();
    setMainData(newData);
    setMainLoading(false);
  };

  const handleExportCsv = () => {
    const csvConfig = mkConfig({
      useKeysAsHeaders: true,
      filename: "seed_plantings",
    });
    const csv = generateCsv(csvConfig)(
      data.map((d) => ({
        OrderCode: d.Tbl_Orders?.OrderCode,
        Greenhouse: d.Tbl_Greenhouses?.GreenhouseName || "",
        SeedType: d.SeedType ? "Scion" : "Rootstock",
        Variety: getVarietyName(d),
        PlantingDate: d.PlantingDate,
        Count: d.SeedPlantingNumber,
        Technician: d.Tbl_People
          ? `${d.Tbl_People.FirstName} ${d.Tbl_People.LastName}`
          : "",
      })),
    );
    download(csvConfig)(csv);
  };

  return (
    <>
      <InsertionRow
        text="کشت بذر"
        insertOnclick={() => setFormModal({ open: true, record: null })}
        csvOnclick={handleExportCsv}
        data={data}
      />

      <div className="bg-white dark:bg-slate-900 rounded-b-xl border border-t-0 p-4 shadow-sm border-slate-200 dark:border-slate-700">
        <Table
          columns={columns}
          dataSource={data}
          rowKey="ID"
          loading={loading}
        />
      </div>

      {deleteModal && <DeleteModal {...deleteModal} deleteLoading={loading} />}

      {viewModal && viewRecord && (
        <DetailModal
          open={viewModal}
          onClose={() => setViewModal(false)}
          title={`جزئیات کشت - سفارش ${viewRecord.Tbl_Orders?.OrderCode || ""}`}
          icon={<ExperimentOutlined />}
          gradientFrom="emerald"
          gradientTo="teal"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <InfoCard
              title="اطلاعات کلی کشت"
              icon={<ExperimentOutlined />}
              color="#10b981"
              items={[
                { label: "کد سفارش", value: viewRecord.Tbl_Orders?.OrderCode },
                {
                  label: "گلخانه",
                  value: viewRecord.Tbl_Greenhouses?.GreenhouseName || "—",
                },
                {
                  label: "نوع بذر",
                  value:
                    viewRecord.SeedType !== null
                      ? viewRecord.SeedType
                        ? "پیوندی"
                        : "پایه"
                      : "—",
                },
                { label: "نام واریته", value: getVarietyName(viewRecord) },
                {
                  label: "تاریخ کاشت",
                  value: viewRecord.PlantingDate
                    ? dayjs(viewRecord.PlantingDate)
                        .calendar("jalali")
                        .format("YYYY/MM/DD")
                    : "—",
                },
                {
                  label: "تاریخ جوانه زنی",
                  value: viewRecord.GerminationDate
                    ? dayjs(viewRecord.GerminationDate)
                        .calendar("jalali")
                        .format("YYYY/MM/DD")
                    : "—",
                },
                {
                  label: "تعداد کاشت",
                  value: viewRecord.SeedPlantingNumber?.toLocaleString(),
                },
                {
                  label: "تکنسین",
                  value: viewRecord.Tbl_People
                    ? `${viewRecord.Tbl_People.FirstName} ${viewRecord.Tbl_People.LastName}`
                    : "—",
                },
              ]}
            />
            <InfoCard
              title="اطلاعات سینی و بستر"
              icon={<AppstoreOutlined />}
              color="#0ea5e9"
              items={[
                { label: "تعداد سینی", value: viewRecord.TrayNumber },
                {
                  label: "تعداد حفره در سینی",
                  value: viewRecord.CellPerTrayNumber,
                },
                {
                  label: "ابعاد حفره",
                  value: viewRecord.CellHeight
                    ? `${viewRecord.CellHeight} cm`
                    : "—",
                },
                { label: "جنس سینی", value: viewRecord.TrayMaterial },
                { label: "بستر کشت", value: viewRecord.PlantingBed },
                { label: "نسبت مخلوط", value: viewRecord.PlantingBedRatio },
              ]}
            />
          </div>
          {/* Seed Package Details */}
          {(() => {
            const seedPkg = getSeedPackageInfo(viewRecord);
            if (seedPkg) {
              return (
                <div className="mt-4">
                  <InfoCard
                    title="اطلاعات بسته بذر"
                    icon={<AppstoreOutlined />} // You might want a different icon like DatabaseOutlined or FileTextOutlined
                    color="#8b5cf6" // Violet color
                    items={[
                      {
                        label: "شرکت تولید کننده",
                        value: seedPkg.ProducerCompany || "—",
                      },
                      {
                        label: "تامین کننده",
                        value: seedPkg.Tbl_suppliers?.CompanyName || "—",
                      },
                      {
                        label: "شماره پارت/سریال",
                        value: `${seedPkg.PackageNumber || "-"} / ${seedPkg.SerialNumber || "-"}`,
                      },
                      {
                        label: "تاریخ تولید",
                        value: seedPkg.ProductionDate
                          ? dayjs(seedPkg.ProductionDate)
                              .calendar("jalali")
                              .format("YYYY/MM/DD")
                          : "—",
                      },
                      {
                        label: "تاریخ انقضا",
                        value: seedPkg.ExpirationDate
                          ? dayjs(seedPkg.ExpirationDate)
                              .calendar("jalali")
                              .format("YYYY/MM/DD")
                          : "—",
                      },
                      {
                        label: "درصد خلوص",
                        value: seedPkg.PurityPercent
                          ? `${seedPkg.PurityPercent}%`
                          : "—",
                      },
                      {
                        label: "نرخ جوانه زنی",
                        value: seedPkg.GerminationRate
                          ? `${seedPkg.GerminationRate}%`
                          : "—",
                      },
                    ]}
                  />
                </div>
              );
            }
            return null;
          })()}
        </DetailModal>
      )}

      <SeedPlantingFormModal
        modalOpen={formModal.open}
        setModalOpen={(open) => setFormModal((prev) => ({ ...prev, open }))}
        record={formModal.record}
        refreshData={refreshData}
        setMainLoading={setMainLoading}
      />
    </>
  );
}
