"use client";

import { ActionFailure, runDeletion } from "@/shared/forms/delete-record";

import { csvRows } from "@/shared/exports/csv";

import type { WarehouseRecord } from "../types/record";

import { deleteWarehouse } from "@/features/warehouses/actions";
import DeleteModal from "@/shared/components/DeleteModal";
import InsertionRow from "@/shared/components/InsertionRow";
import Table from "@/shared/components/Table";
import TableActions from "@/shared/components/TableActions";
import { InfoCircleOutlined } from "@ant-design/icons";
import { Button, Tooltip } from "antd";
import { download, generateCsv, mkConfig } from "export-to-csv";
import { useState } from "react";
import { headers, warehousesCSVData } from "../exports/csv";
import WarehousesDetailModal from "./WarehousesDetailModal";
import WarehousesInsUpModal from "./WarehousesFormModal";

interface WarehousesTableProps {
  data: WarehouseRecord[];
  loading: boolean;
  setLoading: (loading: boolean) => void;
  setData: (data: WarehouseRecord[]) => void;
  refreshData: () => void;
}

export default function WarehousesTable({
  data,
  loading,
  setLoading,
  refreshData,
}: WarehousesTableProps) {
  const [deleteModal, setDeleteModal] = useState<{
    open: boolean;
    id: number;
    name: string;
  } | null>(null);
  const [insUpModal, setInsUpModal] = useState<{
    open: boolean;
    data: WarehouseRecord | null;
  }>({ open: false, data: null });
  const [detailModal, setDetailModal] = useState<{
    open: boolean;
    data: WarehouseRecord | null;
  }>({ open: false, data: null });

  const columns = [
    {
      title: "جزئیات",
      key: "details",
      width: 80,
      align: "center" as const,
      render: (_: unknown, record: WarehouseRecord) => (
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
    { title: "کد انبار", dataIndex: "WarehouseCode", key: "WarehouseCode" },
    { title: "نام انبار", dataIndex: "WarehouseName", key: "WarehouseName" },
    {
      title: "موقعیت",
      dataIndex: "WarehouseLocation",
      key: "WarehouseLocation",
    },
    { title: "ظرفیت", dataIndex: "Capacity", key: "Capacity" },
    {
      title: "محدوده دما",
      dataIndex: "TemperatureRange",
      key: "TemperatureRange",
    },
    {
      title: "تاریخ تاسیس",
      key: "WarehouseCreatedAt",
      render: (_: unknown, record: WarehouseRecord) =>
        record.WarehouseCreatedAt
          ? new Date(record.WarehouseCreatedAt).toLocaleDateString("fa-IR")
          : "-",
    },
    {
      title: "مسئول انبار",
      dataIndex: "WarehouseManagerName",
      key: "WarehouseManagerName",
    },
    {
      title: "عملیات",
      key: "actions",
      render: (_: unknown, record: WarehouseRecord) => (
        <TableActions
          onDelete={() =>
            setDeleteModal({
              open: true,
              id: record.ID,
              name: record.WarehouseName ?? "—",
            })
          }
          onEdit={() => setInsUpModal({ open: true, data: record })}
        />
      ),
    },
  ];

  const handleDelete = async (id: number) => {
    await runDeletion(
      async () => {
        setLoading(true);
        const deleted = await deleteWarehouse(id);
        if (deleted.status !== "ok") throw new ActionFailure(deleted.message);
        setDeleteModal(null);
        refreshData();
      },
      () => {
        setLoading(false);
      },
    );
  };

  return (
    <div className="w-full">
      <InsertionRow
        text="انبار"
        insertOnclick={() => setInsUpModal({ open: true, data: null })}
        data={data}
        csvOnclick={async () => {
          const csvData = await warehousesCSVData(data);
          const options = mkConfig({
            useKeysAsHeaders: false,
            columnHeaders: headers,
            filename: "warehouses",
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

      <WarehousesInsUpModal
        open={insUpModal.open}
        setOpen={(open) => setInsUpModal((prev) => ({ ...prev, open }))}
        setLoading={setLoading}
        data={insUpModal.data}
        refreshData={refreshData}
      />

      <WarehousesDetailModal
        open={detailModal.open}
        onClose={() => setDetailModal({ open: false, data: null })}
        data={detailModal.data}
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
