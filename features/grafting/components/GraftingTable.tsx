"use client";

import { formatPersianDate } from "@/shared/dates/calendar";

import { ActionFailure, runDeletion } from "@/shared/forms/delete-record";

import { csvRows } from "@/shared/exports/csv";

import DeleteModal, { DeleteModalProps } from "@/shared/components/DeleteModal";
import InsertionRow from "@/shared/components/InsertionRow";
import Table, { detailsColumn } from "@/shared/components/Table";
import TableActions from "@/shared/components/TableActions";
import { download, generateCsv, mkConfig } from "export-to-csv";
import useRemoteList from "@/shared/hooks/useRemoteList";
import { useState } from "react";
import { deleteGraftingOperation, getAllGraftingOperations } from "../actions";
import { graftingCSVData, headers } from "../exports/csv";
import { GraftingFormData, GraftingOperationWithDetails } from "../types";
import GraftingDetailModal from "./GraftingDetailModal";
import GraftingFormModal from "./GraftingFormModal";

interface Props {
  initialData: GraftingOperationWithDetails[];
  formData: GraftingFormData;
}

async function loadGraftingOperations() {
  const result = await getAllGraftingOperations();
  if (result.status === "error") throw new ActionFailure(result.message);
  return result.data ?? [];
}

export default function GraftingTable({ initialData, formData }: Props) {
  const { data, setData, loading, refresh } = useRemoteList(
    loadGraftingOperations,
    initialData,
  );

  // Modal & Record State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingRecord, setEditingRecord] =
    useState<GraftingOperationWithDetails | null>(null); // Use proper type if possible, or cast when passing

  // Detail Modal State
  const [detailOpen, setDetailOpen] = useState(false);
  const [detailRecord, setDetailRecord] =
    useState<GraftingOperationWithDetails | null>(null);

  // Delete Modal State
  const [deleteModalOpen, setDeleteModalOpen] =
    useState<DeleteModalProps | null>(null);
  const [deleteModalLoading, setDeleteModalLoading] = useState(false);
  const [deleteModalMsg, setDeleteModalMsg] = useState("");

  const handleDelete = async (id: number) => {
    await runDeletion(
      async () => {
        setDeleteModalLoading(true);
        setDeleteModalMsg("");
        const res = await deleteGraftingOperation(id);
        if (res.status !== "ok") throw new ActionFailure(res.message);
        setDeleteModalLoading(false);
        setDeleteModalOpen(null);
        setData((rows) => rows.filter((row) => row.ID !== id));
      },
      () => {
        setDeleteModalLoading(false);
      },
    );
  };

  const columns = [
    detailsColumn<GraftingOperationWithDetails>((record) => {
      setDetailRecord(record);
      setDetailOpen(true);
    }),
    {
      title: "کد سفارش",
      key: "OrderCode",
      render: (_: unknown, record: GraftingOperationWithDetails) => (
        <span className="font-semibold text-slate-700 dark:text-slate-200">
          {record.Tbl_Orders?.OrderCode}
        </span>
      ),
      searchable: true,
    },
    {
      title: "تاریخ پیوند",
      key: "GraftingDate",
      render: (_: unknown, record: GraftingOperationWithDetails) =>
        formatPersianDate(record.GraftingDate, { fallback: "---" }),
      sortable: true,
    },
    {
      title: "تکنسین",
      key: "Technician",
      render: (_: unknown, record: GraftingOperationWithDetails) =>
        `${record.Tbl_People?.FirstName} ${record.Tbl_People?.LastName}`,
    },
    {
      title: "سینی/حفره",
      key: "Trays",
      render: (_: unknown, record: GraftingOperationWithDetails) => (
        <span className="text-xs">
          {record.TrayNumber} سینی / {record.CellPerTrayNumber} حفره
        </span>
      ),
    },
    {
      title: "بستر کشت",
      key: "PlantingBed",
      render: (_: unknown, record: GraftingOperationWithDetails) => (
        <span
          className="text-xs truncate max-w-[100px] block"
          title={record.PlantingBed ?? undefined}
        >
          {record.PlantingBed}
        </span>
      ),
    },
    {
      title: "گیره",
      key: "GraftingClamp",
      render: (_: unknown, record: GraftingOperationWithDetails) => (
        <span className="text-xs text-slate-500">{record.GraftingClamp}</span>
      ),
    },
    {
      title: "تعداد کارگر",
      key: "WorkerCount",
      render: (_: unknown, record: GraftingOperationWithDetails) => (
        <span className="badge bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 px-2.5 py-0.5 rounded-lg border border-slate-200 dark:border-slate-700 font-mono">
          {record.Tbl_GraftWorkers.length}
        </span>
      ),
      sorter: (
        a: GraftingOperationWithDetails,
        b: GraftingOperationWithDetails,
      ) => a.Tbl_GraftWorkers.length - b.Tbl_GraftWorkers.length,
    },
    {
      title: "عملیات",
      key: "action",
      width: 120,
      align: "center" as const,
      render: (_: unknown, record: GraftingOperationWithDetails) => (
        <TableActions
          onEdit={() => {
            setEditingRecord(record);
            setIsModalOpen(true);
          }}
          onDelete={() =>
            setDeleteModalOpen({
              open: true,
              onClose: () => setDeleteModalOpen(null),
              id: record.ID,
              name: `عملیات سفارش ${record.Tbl_Orders?.OrderCode}`,
              deleteLoading: deleteModalLoading,
              onDelete: () => handleDelete(record.ID),
              msg: deleteModalMsg,
            })
          }
        />
      ),
    },
  ];

  return (
    <div className="space-y-4">
      <InsertionRow
        text="عملیات پیوند"
        insertOnclick={() => {
          setEditingRecord(null);
          setIsModalOpen(true);
        }}
        csvOnclick={async () => {
          const csvData = await graftingCSVData(data);
          const options = mkConfig({
            useKeysAsHeaders: false,
            columnHeaders: headers,
            filename: "grafting-operations",
          });
          const csv = generateCsv(options)(csvRows(csvData, headers));
          download(options)(csv);
        }}
        data={data}
      />

      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-700 overflow-hidden shadow-sm">
        <Table
          columns={columns}
          dataSource={data}
          rowKey="ID"
          loading={loading}
        />
      </div>

      <GraftingFormModal
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        refreshData={refresh}
        formData={formData}
        initialData={editingRecord} // Pass editing record if any
      />

      <GraftingDetailModal
        open={detailOpen}
        onCancel={() => setDetailOpen(false)}
        record={detailRecord}
      />

      <DeleteModal
        open={deleteModalOpen?.open || false}
        onClose={() => setDeleteModalOpen(null)}
        id={deleteModalOpen?.id}
        name={deleteModalOpen?.name}
        deleteLoading={deleteModalLoading}
        onDelete={deleteModalOpen?.onDelete}
        msg={deleteModalMsg}
      />
    </div>
  );
}
