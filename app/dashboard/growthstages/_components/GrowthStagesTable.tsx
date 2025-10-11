import type { PlantGrowthStages } from "@/app/generated/prisma";
import { DeleteOutlined, EditOutlined } from "@ant-design/icons";
import { Button, Table } from "antd";
import { useState } from "react";
import StagesInsUpModal, { GrowthStagesInsUpModalProps } from "./StagesInsUpModal";
import { deleteGrowthStage, getGrowthStages } from "@/app/lib/services/growthstages";
import DeleteModal, { DeleteModalProps } from "@/app/dashboard/_components/tools/DeleteModal";

type GrowthStagesTableProps = {
  loading?: boolean;
  data?: PlantGrowthStages[];
  setMainData?: (data: PlantGrowthStages[]) => void;
  setMainLoading?: (loading: boolean) => void;
};

export default function GrowthStagesTable(props: GrowthStagesTableProps) {
  const [editModal, setEditModal] = useState<GrowthStagesInsUpModalProps | null>(null);
  const [deleteModal, setDeleteModal] = useState<DeleteModalProps | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const columns = [
    { title: "گونه گیاهی", dataIndex: ["PlantVarieties", "VarietyName"], key: "varietyName" },
    { title: "مرحله رشد", dataIndex: "StageOrder", key: "stageOrder" },
    { title: "عنوان مرحله", dataIndex: "StageName", key: "stageName" },
    { title: "علایم ورود به این مرحله", dataIndex: "EntryCriteria", key: "entryCriteria" },
    { title: "روز مورد انتظار برای ورود به این مرحله", dataIndex: "StartDay", key: "startDay" },
    { title: "علائم خروج از این مرحله", dataIndex: "ExitCriteria", key: "exitCriteria" },
    { title: "روز مورد انتظار برای خروج از این مرحله", dataIndex: "EndDay", key: "endDay" },
    {
      title: "",
      key: "actions",
      render: (_: any, record: PlantGrowthStages) => (
        <div className="flex gap-2">
          <Button
            type="link"
            icon={<EditOutlined />}
            onClick={() =>
              setEditModal({
                isOpen: true,
                editData: record,
                isEditMode: true,
                setMainData: props.setMainData,
                setMainLoading: props.setMainLoading,
                StageID: record.StageID,
              })
            }
          />
          <Button
            type="link"
            icon={<DeleteOutlined />}
            danger
            onClick={() => {
              setDeleteModal({
                open: true,
                onClose: () => setDeleteModal(null),
                id: record.StageID,
                name: record.StageName || "",
                onDelete: () => handleDelete(record.StageID),
              });
            }}
          />
        </div>
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
      const newData: PlantGrowthStages[] = await getGrowthStages();
      props.setMainData?.(newData);
      props.setMainLoading?.(false);
    }
  };

  return (
    <>
      <Table
        columns={columns}
        dataSource={props.data}
        loading={props.loading}
        rowKey="StageID"
        scroll={{ x: "max-content" }}
      />

      <StagesInsUpModal
        isOpen={editModal?.isOpen || false}
        onClose={() => setEditModal(null)}
        editData={editModal?.editData}
        isEditMode={editModal?.isEditMode || false}
        setMainLoading={props.setMainLoading}
        setMainData={props.setMainData}
        StageID={editModal?.editData?.StageID}
      />

      <DeleteModal
        open={deleteModal?.open || false}
        onClose={() => setDeleteModal(null)}
        name={deleteModal?.name}
        id={deleteModal?.id}
        onDelete={() => handleDelete(deleteModal?.id!)}
        deleteLoading={deleteLoading}
      />
    </>
  );
}
