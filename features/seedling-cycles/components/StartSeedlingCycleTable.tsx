"use client";

import { formatPersianDate } from "@/shared/dates/calendar";

import { ActionFailure, runDeletion } from "@/shared/forms/delete-record";

import type { CycleGreenhouseOption, CycleOrderOption } from "../types";

import { csvRows } from "@/shared/exports/csv";

import DeleteModal, { DeleteModalProps } from "@/shared/components/DeleteModal";
import InsertionRow from "@/shared/components/InsertionRow";
import { renderSeedInfo } from "@/shared/components/SeedType";
import Table, { detailsColumn } from "@/shared/components/Table";
import TableActions from "@/shared/components/TableActions";
import { download, generateCsv, mkConfig } from "export-to-csv";
import useRemoteList from "@/shared/hooks/useRemoteList";
import { useState } from "react";
import { deleteStartSeedlingCycle, getStartSeedlingCycles } from "../actions";
import { headers, startSeedlingCycleCSVData } from "../exports/csv";
import { StartSeedlingCycle } from "../types";
import StartSeedlingCycleDetailModal from "./StartSeedlingCycleDetailModal";
import StartSeedlingCycleFormModal from "./StartSeedlingCycleFormModal";

interface Props {
  data: StartSeedlingCycle[];
  orders: CycleOrderOption[];
  greenhouses: CycleGreenhouseOption[];
}

export default function StartSeedlingCycleTable({
  data: initialData,
  orders,
  greenhouses,
}: Props) {
  const { data, setData, loading, refresh } = useRemoteList(
    getStartSeedlingCycles,
    initialData,
  );
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingRecord, setEditingRecord] = useState<StartSeedlingCycle | null>(
    null,
  );

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
        const res = await deleteStartSeedlingCycle(id);
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
  const [detailOpen, setDetailOpen] = useState(false);
  const [detailRecord, setDetailRecord] = useState<StartSeedlingCycle | null>(
    null,
  );

  // ... (keep existing delete modal state)

  const columns = [
    detailsColumn<StartSeedlingCycle>((record) => {
      setDetailRecord(record);
      setDetailOpen(true);
    }),
    {
      title: "شناسه",
      dataIndex: "ID",
      key: "ID",
      width: 70,
      sortable: true,
    },
    {
      title: "کد سفارش",
      key: "OrderCode",
      render: (_: unknown, record: StartSeedlingCycle) => (
        <span className="font-semibold text-slate-700 dark:text-slate-200">
          {record.Tbl_Orders?.OrderCode}
        </span>
      ),
      searchable: true,
    },
    {
      title: "نوع بذر",
      dataIndex: "SeedType",
      key: "SeedType",
      render: (_: unknown, record: StartSeedlingCycle) =>
        renderSeedInfo(
          record.SeedType,
          (record.SeedType
            ? record.Tbl_Orders
                ?.Tbl_SeedPackage_Tbl_Orders_ScionIDToTbl_SeedPackage
            : record.Tbl_Orders
                ?.Tbl_SeedPackage_Tbl_Orders_RootstockIDToTbl_SeedPackage
          )?.Tbl_plantVariety,
        ),
    },
    {
      title: "نام گلخانه",
      key: "GreenhouseName",
      render: (_: unknown, record: StartSeedlingCycle) =>
        record.Tbl_Greenhouses?.GreenhouseName,
    },
    {
      title: "نام سالن",
      dataIndex: "SalonName",
      key: "SalonName",
      render: (val: string) => val || "---",
    },
    {
      title: "تعداد سینی",
      dataIndex: "NumberOfTrays",
      key: "NumberOfTrays",
      render: (val: number) => (val != null ? val.toLocaleString() : "---"),
    },
    {
      title: "تاریخ ورود به گلخانه",
      dataIndex: "GreenhouseEntryDate",
      key: "GreenhouseEntryDate",
      render: (val: Date) => formatPersianDate(val, { fallback: "---" }),
    },
    {
      title: "عملیات",
      key: "action",
      width: 120,
      align: "center" as const,
      render: (_: unknown, record: StartSeedlingCycle) => (
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
              name: `رکورد ${record.ID}`,
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
      {/* ... (keep existing InsertionRow) */}
      <InsertionRow
        text="سیکل جدید"
        insertOnclick={() => {
          setEditingRecord(null);
          setIsModalOpen(true);
        }}
        csvOnclick={async () => {
          const csvData = await startSeedlingCycleCSVData(data);
          const options = mkConfig({
            useKeysAsHeaders: false,
            columnHeaders: headers,
            filename: "start-seedling-cycle",
          });
          const csv = generateCsv(options)(csvRows(csvData, headers));
          download(options)(csv);
        }}
        data={data}
      />

      <Table
        columns={columns}
        dataSource={data}
        rowKey="ID"
        loading={loading}
      />

      <StartSeedlingCycleFormModal
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        refreshData={refresh}
        orders={orders}
        greenhouses={greenhouses}
        record={editingRecord}
      />

      <StartSeedlingCycleDetailModal
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
