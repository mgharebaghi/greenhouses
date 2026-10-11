import {
  deletePlantVariety,
  getPlantVarieties,
} from "@/features/plant-varieties/actions";
import type { PlantVarietyRecord } from "@/features/plant-varieties/types/record";
import DeleteModal, { DeleteModalProps } from "@/shared/components/DeleteModal";
import InsertionRow from "@/shared/components/InsertionRow";
import Table from "@/shared/components/Table";
import TableActions from "@/shared/components/TableActions";
import { csvRows } from "@/shared/exports/csv";
import { ActionFailure, runDeletion } from "@/shared/forms/delete-record";
import { InfoCircleOutlined } from "@ant-design/icons";
import { Button, Tooltip } from "antd";
import { download, generateCsv, mkConfig } from "export-to-csv";
import { useState } from "react";
import { headers, plantVarietiesCSVData } from "../exports/csv";
import { PlantVarietyDTO } from "../types";
import PlantVarietyDetailModal from "./PlantVarietyDetailModal";
import VarietyFormModal from "./VarietyFormModal";

type PlantVarietiesTableProps = {
  data: PlantVarietyDTO[];
  loading?: boolean;
  setMainData?: (data: PlantVarietyDTO[]) => void;
  setMainLoading?: (loading: boolean) => void;
};

export default function PlantVarietiesTable({
  data,
  loading,
  setMainData,
  setMainLoading,
}: PlantVarietiesTableProps) {
  const [formModal, setFormModal] = useState<{
    open: boolean;
    record: PlantVarietyRecord | null;
  }>({
    open: false,
    record: null,
  });
  const [deleteModalOpen, setDeleteModalOpen] =
    useState<DeleteModalProps | null>(null);
  const [deleteModalLoading, setDeleteModalLoading] = useState(false);
  const [deleteModalMsg, setDeleteModalMsg] = useState("");
  const [detailModal, setDetailModal] = useState<{
    open: boolean;
    data: PlantVarietyDTO | null;
  }>({
    open: false,
    data: null,
  });

  const columns = [
    {
      title: "جزئیات",
      key: "details",
      width: 80,
      align: "center" as const,
      render: (_: unknown, record: PlantVarietyDTO) => (
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
      title: "واریته",
      dataIndex: "VarietyName",
      key: "VarietyName",
      width: 140,
      align: "center" as const,
    },
    {
      title: "نام گیاه",
      dataIndex: "CommonName",
      key: "CommonName",
      width: 140,
      align: "center" as const,
      render: (_: unknown, record: PlantVarietyDTO) =>
        record.Tbl_Plants?.CommonName,
    },
    {
      title: "جوانه زنی",
      dataIndex: "DaysToGermination",
      key: "DaysToGermination",
      width: 110,
      align: "center" as const,
      render: (value: number) => (value ? `${value} روز` : "-"),
    },
    {
      title: "رویش",
      dataIndex: "DaysToSprout",
      key: "DaysToSprout",
      width: 110,
      align: "center" as const,
      render: (value: number) => (value ? `${value} روز` : "-"),
    },
    {
      title: "نشاء",
      dataIndex: "DaysToSeedling",
      key: "DaysToSeedling",
      width: 110,
      align: "center" as const,
      render: (value: number) => (value ? `${value} روز` : "-"),
    },
    {
      title: "بلوغ",
      dataIndex: "DaysToMaturity",
      key: "DaysToMaturity",
      width: 110,
      align: "center" as const,
      render: (value: number) => (value ? `${value} روز` : "-"),
    },
    {
      title: "عملیات",
      dataIndex: "actions",
      key: "actions",
      width: 120,
      align: "center" as const,
      render: (_: unknown, record: PlantVarietyDTO) => (
        <TableActions
          onEdit={() =>
            setFormModal({
              open: true,
              record: record as unknown as PlantVarietyRecord,
            })
          }
          onDelete={() =>
            setDeleteModalOpen({
              open: true,
              onClose: () => setDeleteModalOpen(null),
              id: record.ID,
              name: record.VarietyName || "",
              deleteLoading: deleteModalLoading,
              onDelete: () => handleDelete(record),
              msg: deleteModalMsg,
            })
          }
        />
      ),
    },
  ];

  const handleDelete = async (record: PlantVarietyDTO) => {
    await runDeletion(
      async () => {
        setDeleteModalLoading(true);
        setDeleteModalMsg("");
        const res = await deletePlantVariety(record.ID!);
        if (res.status !== "ok") throw new ActionFailure(res.message);
        {
          setDeleteModalLoading(false);
          setDeleteModalOpen(null);
          setMainLoading?.(true);
          const newData = await getPlantVarieties();
          setMainData?.(newData);
          setMainLoading?.(false);
        }
      },
      () => {
        setDeleteModalLoading(false);
        setMainLoading?.(false);
      },
    );
  };

  return (
    <>
      <InsertionRow
        text="افزودن واریته"
        insertOnclick={() => setFormModal({ open: true, record: null })}
        csvOnclick={async () => {
          const csvData = await plantVarietiesCSVData(data);
          const options = mkConfig({
            useKeysAsHeaders: false,
            columnHeaders: headers,
            filename: "plant-varieties",
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
        pagination={{ pageSize: 5 }}
        scroll={{ x: 1000 }}
      />

      <VarietyFormModal
        isOpen={formModal.open}
        onClose={() => setFormModal({ open: false, record: null })}
        setMainLoading={setMainLoading}
        setMainData={setMainData}
        record={formModal.record}
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

      <PlantVarietyDetailModal
        open={detailModal.open}
        data={detailModal.data}
        onClose={() => setDetailModal({ open: false, data: null })}
      />
    </>
  );
}
