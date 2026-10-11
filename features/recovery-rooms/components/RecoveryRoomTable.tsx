"use client";

import { ActionFailure, runDeletion } from "@/shared/forms/delete-record";

import { csvRows } from "@/shared/exports/csv";

import { deleteRecoveryRoom } from "@/features/recovery-rooms/actions";
import DeleteModal, {
  type DeleteModalProps,
} from "@/shared/components/DeleteModal";
import InsertionRow from "@/shared/components/InsertionRow";
import Table from "@/shared/components/Table";
import TableActions from "@/shared/components/TableActions";
import { EyeOutlined } from "@ant-design/icons";
import { Button, Tooltip } from "antd";
import { download, generateCsv, mkConfig } from "export-to-csv";
import { useState } from "react";
import { headers, recoveryRoomCSVData } from "../exports/csv";
import { RecoveryRoomListItem } from "../types";
import RecoveryRoomDetailModal from "./RecoveryRoomDetailModal";
import RecoveryRoomFormModal from "./RecoveryRoomFormModal";

interface RecoveryRoomTableProps {
  data: RecoveryRoomListItem[];
  loading: boolean;
  setLoading: (loading: boolean) => void;
  setData: (data: RecoveryRoomListItem[]) => void;
  refreshData: () => void;
}

export default function RecoveryRoomTable({
  data,
  loading,
  setLoading,
  refreshData,
}: RecoveryRoomTableProps) {
  const [deleteModal, setDeleteModal] = useState<Pick<
    DeleteModalProps,
    "open" | "id" | "name"
  > | null>(null);
  const [formModal, setFormModal] = useState<{
    open: boolean;
    data: RecoveryRoomListItem | null;
  }>({ open: false, data: null });
  const [detailModal, setDetailModal] = useState<{
    open: boolean;
    data: RecoveryRoomListItem | null;
  }>({ open: false, data: null });

  const handleDelete = async (id: number) => {
    await runDeletion(
      async () => {
        setLoading(true);
        const deleted = await deleteRecoveryRoom(id);
        if (deleted.status !== "ok") throw new ActionFailure(deleted.message);
        setDeleteModal(null);
        refreshData();
      },
      () => {
        setLoading(false);
      },
    );
  };

  const columns = [
    {
      title: "جزئیات",
      key: "details",
      width: 80,
      align: "center" as const,
      render: (_: unknown, record: RecoveryRoomListItem) => (
        <Tooltip title="مشاهده جزئیات">
          <Button
            icon={<EyeOutlined />}
            onClick={() => setDetailModal({ open: true, data: record })}
          />
        </Tooltip>
      ),
    },
    {
      title: "کد سفارش",
      key: "OrderCode",
      render: (_: unknown, record: RecoveryRoomListItem) =>
        record.Tbl_GraftingOperation?.Tbl_Orders?.OrderCode || "—",
    },
    {
      title: "نام مشتری",
      key: "Customer",
      render: (_: unknown, record: RecoveryRoomListItem) => {
        const p =
          record.Tbl_GraftingOperation?.Tbl_Orders
            ?.Tbl_People_Tbl_Orders_CustomerIDToTbl_People;
        return p ? `${p.FirstName} ${p.LastName}` : "—";
      },
    },
    {
      title: "تاریخ ورود",
      key: "RecoveryEntryDate",
      render: (_: unknown, record: RecoveryRoomListItem) =>
        record.RecoveryEntryDate
          ? new Date(record.RecoveryEntryDate).toLocaleDateString("fa-IR")
          : "—",
    },
    {
      title: "تاریخ خروج",
      key: "RecoveryExitDate",
      render: (_: unknown, record: RecoveryRoomListItem) =>
        record.RecoveryExitDate
          ? new Date(record.RecoveryExitDate).toLocaleDateString("fa-IR")
          : "—",
    },
    {
      title: "تلفات کل",
      key: "GraftedLossCount",
      dataIndex: "GraftedLossCount",
      render: (val: number | null) =>
        val !== null ? val.toLocaleString() : "—",
    },
    {
      title: "عملیات",
      key: "actions",
      render: (_: unknown, record: RecoveryRoomListItem) => (
        <TableActions
          onDelete={() =>
            setDeleteModal({
              open: true,
              id: record.ID,
              name:
                record.Tbl_GraftingOperation?.Tbl_Orders?.OrderCode || "سفارش",
            })
          }
          onEdit={() => setFormModal({ open: true, data: record })}
        />
      ),
    },
  ];

  return (
    <div className="w-full">
      <InsertionRow
        text="ریکاوری جدید"
        insertOnclick={() => setFormModal({ open: true, data: null })}
        data={data}
        csvOnclick={async () => {
          const csvData = await recoveryRoomCSVData(data);
          const options = mkConfig({
            useKeysAsHeaders: false,
            columnHeaders: headers,
            filename: "recovery-room",
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

      {formModal.open && (
        <RecoveryRoomFormModal
          open={formModal.open}
          setOpen={(open: boolean) =>
            setFormModal((prev) => ({ ...prev, open }))
          }
          setLoading={setLoading}
          data={formModal.data}
          refreshData={refreshData}
        />
      )}

      {detailModal.open && (
        <RecoveryRoomDetailModal
          open={detailModal.open}
          onClose={() => setDetailModal((prev) => ({ ...prev, open: false }))}
          data={detailModal.data}
        />
      )}

      {deleteModal?.open && (
        <DeleteModal
          open={deleteModal.open}
          onClose={() => setDeleteModal(null)}
          id={deleteModal.id}
          name={deleteModal.name}
          onDelete={handleDelete}
          deleteLoading={loading}
        />
      )}
    </div>
  );
}
