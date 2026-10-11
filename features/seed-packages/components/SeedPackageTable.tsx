"use client";

import { ActionFailure, runDeletion } from "@/shared/forms/delete-record";

import { csvRows } from "@/shared/exports/csv";

import type { SeedPackageDetails } from "../types/details";

import {
  deleteSeedPackage,
  getAllSeedPackages,
} from "@/features/seed-packages/actions";
import DeleteModal from "@/shared/components/DeleteModal";
import InsertionRow from "@/shared/components/InsertionRow";
import Table from "@/shared/components/Table";
import TableActions from "@/shared/components/TableActions";
import { InfoCircleOutlined } from "@ant-design/icons";
import { Button, Tooltip } from "antd";
import { download, generateCsv, mkConfig } from "export-to-csv";
import { useState } from "react";
import { headers, seedPackageCSVData } from "../exports/csv";
import SeedPackageDetailModal from "./SeedPackageDetailModal";
import SeedPackageInsUpModal from "./SeedPackageFormModal";
import SeedPackagePrintModal from "./SeedPackagePrintModal";

interface SeedPackageTableProps {
  data: SeedPackageDetails[];
  loading: boolean;
  setLoading: (loading: boolean) => void;
  setData: (data: SeedPackageDetails[]) => void;
}

export default function SeedPackageTable({
  data,
  loading,
  setLoading,
  setData,
}: SeedPackageTableProps) {
  const [deleteModal, setDeleteModal] = useState<{
    open: boolean;
    id: number;
    name: string;
  } | null>(null);
  const [insUpModal, setInsUpModal] = useState<{
    open: boolean;
    data: SeedPackageDetails | null;
  }>({ open: false, data: null });
  const [detailModal, setDetailModal] = useState<{
    open: boolean;
    data: SeedPackageDetails | null;
  }>({ open: false, data: null });
  const [printModal, setPrintModal] = useState<{
    open: boolean;
    data: SeedPackageDetails | null;
  }>({ open: false, data: null });

  const columns = [
    {
      title: "جزئیات",
      key: "details",
      width: 80,
      align: "center" as const,
      render: (_: unknown, record: SeedPackageDetails) => (
        <Tooltip title="مشاهده جزئیات">
          <Button
            type="text"
            icon={
              <InfoCircleOutlined
                style={{ color: "#3b82f6", fontSize: "18px" }}
              />
            }
            onClick={() => setDetailModal({ open: true, data: record })}
          />
        </Tooltip>
      ),
    },
    {
      title: "شماره سریال بسته",
      dataIndex: "SerialNumber",
      key: "SerialNumber",
    },
    {
      title: "تامین کننده",
      key: "Supplier",
      render: (_: unknown, record: SeedPackageDetails) => {
        const s = record.Tbl_suppliers;
        if (!s) return record.ProducerCompany || "—";
        return s.Legal ? s.CompanyName : `${s.FirstName} ${s.LastName}`;
      },
    },
    {
      title: "واریته - رقم",
      key: "VarietyName",
      render: (_: unknown, record: SeedPackageDetails) =>
        record.Tbl_plantVariety?.VarietyName || "—",
    },
    {
      title: "تعداد",
      dataIndex: "SeedCount",
      key: "SeedCount",
      render: (val: number | null) => (val ? val.toLocaleString() : "—"),
    },
    {
      title: "وزن (g)",
      dataIndex: "WeightGram",
      key: "WeightGram",
      render: (val: number | null) => (val ? val : "—"),
    },
    {
      title: "تاریخ تولید",
      key: "ProductionDate",
      render: (_: unknown, record: SeedPackageDetails) =>
        record.ProductionDate
          ? new Date(record.ProductionDate).toLocaleDateString("fa-IR")
          : "—",
    },
    {
      title: "عملیات",
      key: "actions",
      render: (_: unknown, record: SeedPackageDetails) => (
        <TableActions
          onDelete={() =>
            setDeleteModal({
              open: true,
              id: record.ID,
              name: record.SerialNumber ?? "—",
            })
          }
          onEdit={() => setInsUpModal({ open: true, data: record })}
          onPrint={() => setPrintModal({ open: true, data: record })}
        />
      ),
    },
  ];

  const refreshData = async () => {
    setLoading(true);
    const res = await getAllSeedPackages();
    setData(res);
    setLoading(false);
  };

  const handleDelete = async (id: number) => {
    await runDeletion(
      async () => {
        setLoading(true);
        const deleted = await deleteSeedPackage(id);
        if (deleted.status !== "ok") throw new ActionFailure(deleted.message);
        setDeleteModal(null);
        await refreshData();
      },
      () => {
        setLoading(false);
      },
    );
  };

  return (
    <div className="w-full">
      <InsertionRow
        text="بسته جدید"
        insertOnclick={() => setInsUpModal({ open: true, data: null })}
        data={data}
        csvOnclick={async () => {
          const csvData = await seedPackageCSVData(data);
          const options = mkConfig({
            useKeysAsHeaders: false,
            columnHeaders: headers,
            filename: "seed-packages",
          });
          const csv = generateCsv(options)(csvRows(csvData, headers));
          download(options)(csv);
        }}
      />

      <Table
        columns={columns}
        dataSource={data}
        loading={loading}
        rowKey="ID"
        pagination={{ pageSize: 5 }}
      />

      <SeedPackageInsUpModal
        open={insUpModal.open}
        setOpen={(open) => setInsUpModal((prev) => ({ ...prev, open }))}
        setLoading={setLoading}
        data={insUpModal.data}
        refreshData={refreshData}
      />

      <SeedPackageDetailModal
        open={detailModal.open}
        onClose={() => setDetailModal({ open: false, data: null })}
        data={detailModal.data}
      />

      <SeedPackagePrintModal
        open={printModal.open}
        setOpen={(open) => setPrintModal((prev) => ({ ...prev, open }))}
        data={printModal.data}
      />

      <DeleteModal
        open={deleteModal?.open || false}
        onClose={() => setDeleteModal(null)}
        id={deleteModal?.id}
        name={deleteModal?.name}
        onDelete={handleDelete}
        deleteLoading={loading}
      />
    </div>
  );
}
