"use client";

import { ActionFailure, runDeletion } from "@/shared/forms/delete-record";

import { csvRows } from "@/shared/exports/csv";

import type { NurseryRoomRecord } from "../types/record";

import { deleteNurseryRoom } from "@/features/nursery-rooms/actions";
import DeleteModal from "@/shared/components/DeleteModal";
import InsertionRow from "@/shared/components/InsertionRow";
import Table from "@/shared/components/Table";
import TableActions from "@/shared/components/TableActions";
import { InfoCircleOutlined } from "@ant-design/icons";
import { Button, Tooltip } from "antd";
import { download, generateCsv, mkConfig } from "export-to-csv";
import { useState } from "react";
import { headers, nurseryRoomsCSVData } from "../exports/csv";
import NurseryRoomsDetailModal from "./NurseryRoomsDetailModal";
import NurseryRoomsInsUpModal from "./NurseryRoomsFormModal";

interface NurseryRoomsTableProps {
  data: NurseryRoomRecord[];
  loading: boolean;
  setLoading: (loading: boolean) => void;
  setData: (data: NurseryRoomRecord[]) => void;
  refreshData: () => void;
}

export default function NurseryRoomsTable({
  data,
  loading,
  setLoading,
  refreshData,
}: NurseryRoomsTableProps) {
  const [deleteModal, setDeleteModal] = useState<{
    open: boolean;
    id: number;
    name: string;
  } | null>(null);
  const [insUpModal, setInsUpModal] = useState<{
    open: boolean;
    data: NurseryRoomRecord | null;
  }>({ open: false, data: null });
  const [detailModal, setDetailModal] = useState<{
    open: boolean;
    data: NurseryRoomRecord | null;
  }>({ open: false, data: null });

  const columns = [
    {
      title: "جزئیات",
      key: "details",
      width: 80,
      align: "center" as const,
      render: (_: unknown, record: NurseryRoomRecord) => (
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
    { title: "کد اتاق", dataIndex: "NurseryRoomCode", key: "NurseryRoomCode" },
    { title: "نام اتاق", dataIndex: "NurseryRoomName", key: "NurseryRoomName" },
    {
      title: "دما (C)",
      key: "Temperature",
      render: (_: unknown, record: NurseryRoomRecord) =>
        `${record.TemperatureMin || 0} - ${record.TemperatureMax || 0}`,
    },
    {
      title: "رطوبت (%)",
      key: "Humidity",
      render: (_: unknown, record: NurseryRoomRecord) =>
        `${record.HumidityMin || 0} - ${record.HumidityMax || 0}`,
    },
    { title: "نوع نور", dataIndex: "LightType", key: "LightType" },
    {
      title: "ساعات نوردهی",
      dataIndex: "LightHoursPerDay",
      key: "LightHoursPerDay",
    },
    {
      title: "عملیات",
      key: "actions",
      render: (_: unknown, record: NurseryRoomRecord) => (
        <TableActions
          onDelete={() =>
            setDeleteModal({
              open: true,
              id: record.ID,
              name: record.NurseryRoomName ?? "—",
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
        const deleted = await deleteNurseryRoom(id);
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
        text="اتاق ریکاوری"
        insertOnclick={() => setInsUpModal({ open: true, data: null })}
        data={data}
        csvOnclick={async () => {
          const csvData = await nurseryRoomsCSVData(data);
          const options = mkConfig({
            useKeysAsHeaders: false,
            columnHeaders: headers,
            filename: "nursery-rooms",
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

      <NurseryRoomsInsUpModal
        open={insUpModal.open}
        setOpen={(open) => setInsUpModal((prev) => ({ ...prev, open }))}
        setLoading={setLoading}
        data={insUpModal.data}
        refreshData={refreshData}
      />

      <NurseryRoomsDetailModal
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
