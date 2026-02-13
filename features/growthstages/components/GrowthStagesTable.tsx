import type { Tbl_PlantGrowthStage } from "@/app/generated/prisma";
import { DeleteOutlined, EditOutlined, InfoCircleOutlined } from "@ant-design/icons";
import { Button } from "antd";
import Table from "@/shared/components/Table";
import { useState } from "react";
import GrowthStageFormModal from "./GrowthStageFormModal";
import GrowthStageDetailModal from "./GrowthStageDetailModal";
import { deleteGrowthStage, getGrowthStages } from "@/features/growthstages/services";
import DeleteModal, { DeleteModalProps } from "@/shared/components/DeleteModal";
import InsertionRow from "@/shared/components/InsertionRow";
import TableActions from "@/shared/components/TableActions";
import { generateCsv, download, mkConfig } from "export-to-csv";
import { growthStagesCSVData, headers } from "../data/csvFileData";

type GrowthStagesTableProps = {
  loading?: boolean;
  data?: Tbl_PlantGrowthStage[];
  setMainData?: (data: Tbl_PlantGrowthStage[]) => void;
  setMainLoading?: (loading: boolean) => void;
};

export default function GrowthStagesTable(props: GrowthStagesTableProps) {
  const [formModal, setFormModal] = useState<{ open: boolean; record: Tbl_PlantGrowthStage | null }>({
    open: false,
    record: null,
  });
  const [detailModal, setDetailModal] = useState<{ open: boolean; data: Tbl_PlantGrowthStage | null }>({
    open: false,
    data: null,
  });
  const [deleteModal, setDeleteModal] = useState<DeleteModalProps | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const columns = [
    {
      title: "جزئیات",
      key: "details",
      width: 80,
      align: "center" as const,
      render: (_: any, record: Tbl_PlantGrowthStage) => (
        <Button
          type="text"
          shape="circle"
          className="text-slate-500 hover:text-blue-500 hover:bg-blue-50 dark:text-slate-400 dark:hover:text-blue-400 dark:hover:bg-blue-900/20"
          icon={<InfoCircleOutlined />}
          onClick={() => setDetailModal({ open: true, data: record })}
        />
      ),
    },
    {
      title: "گونه گیاهی",
      key: "varietyName",
      width: 150,
      align: "center" as const,
      render: (_: any, record: any) => record.Tbl_plantVariety?.VarietyName,
    },
    { title: "مرحله رشد", dataIndex: "StageOrder", key: "stageOrder", width: 100, align: "center" as const },
    { title: "عنوان مرحله", dataIndex: "StageName", key: "stageName", width: 120, align: "center" as const },
    { title: "علایم ورود", dataIndex: "EntryCriteria", key: "entryCriteria", width: 150, align: "center" as const },
    { title: "تا روز شروع", dataIndex: "StartDay", key: "startDay", width: 100, align: "center" as const },
    { title: "علائم خروج", dataIndex: "ExitCriteria", key: "exitCriteria", width: 150, align: "center" as const },
    { title: "تا روز پایان", dataIndex: "EndDay", key: "endDay", width: 100, align: "center" as const },
    {
      title: "عملیات",
      key: "actions",
      width: 120,
      align: "center" as const,
      render: (_: any, record: Tbl_PlantGrowthStage) => (
        <TableActions
          onEdit={() =>
            setFormModal({
              open: true,
              record: record,
            })
          }
          onDelete={() => {
            setDeleteModal({
              open: true,
              onClose: () => setDeleteModal(null),
              id: record.ID,
              name: "مرحله " + record.StageName || "",
              onDelete: () => handleDelete(record.ID),
            });
          }}
        />
      ),
    },
  ];

  const handleDelete = async (id: number) => {
    setDeleteLoading(true);
    const res = await deleteGrowthStage(id);
    if (res) {
      setDeleteLoading(false);
      setDeleteModal(null);
      props.setMainLoading?.(true);
      const newData: any = await getGrowthStages();
      props.setMainData?.(newData);
      props.setMainLoading?.(false);
    }
  };

  return (
    <div className="w-full">
      <InsertionRow
        text=" مرحله رشد گیاه"
        insertOnclick={() =>
          setFormModal({
            open: true,
            record: null,
          })
        }
        csvOnclick={async () => {
          const csvData = await growthStagesCSVData(props.data as any);
          const options = mkConfig({ useKeysAsHeaders: false, columnHeaders: headers, filename: "growth-stages" });
          const csv = generateCsv(options)(csvData);
          download(options)(csv);
        }}
        data={props.data}
      />

      <Table
        columns={columns}
        dataSource={props.data || []}
        loading={props.loading}
        rowKey="ID"
        scroll={{ x: 1000 }}
        pagination={{ pageSize: 5 }}
      />

      <GrowthStageFormModal
        isOpen={formModal.open}
        onClose={() => setFormModal({ open: false, record: null })}
        record={formModal.record}
        setMainLoading={props.setMainLoading}
        setMainData={props.setMainData as any}
      />

      <GrowthStageDetailModal
        open={detailModal.open}
        onClose={() => setDetailModal({ open: false, data: null })}
        data={detailModal.data}
      />

      <DeleteModal
        open={deleteModal?.open || false}
        onClose={() => setDeleteModal(null)}
        name={deleteModal?.name}
        id={deleteModal?.id}
        onDelete={() => handleDelete(deleteModal?.id!)}
        deleteLoading={deleteLoading}
      />
    </div>
  );
}
