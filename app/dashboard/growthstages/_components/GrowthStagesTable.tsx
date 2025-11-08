import type { PlantGrowthStages } from "@/app/generated/prisma";
import { DeleteOutlined, EditOutlined } from "@ant-design/icons";
import { Button } from "antd";
import Table from "@/app/dashboard/_components/UI/Table";
import { useState } from "react";
import StagesInsUpModal, { GrowthStagesInsUpModalProps } from "./StagesInsUpModal";
import { deleteGrowthStage, getGrowthStages } from "@/app/lib/services/growthstages";
import DeleteModal, { DeleteModalProps } from "@/app/dashboard/_components/UI/DeleteModal";
import InsertionRow from "../../_components/UI/InsertionRow";
import { downloadCSVFromAntd } from "../../_components/tools/CSVoutput";
import TableActions from "../../_components/UI/TableActions";

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
    {
      title: "گونه گیاهی",
      key: "varietyName",
      render: (_: any, record: any) => record.PlantVarieties?.VarietyName,
    },
    { title: "مرحله رشد", dataIndex: "StageOrder", key: "stageOrder" },
    { title: "عنوان مرحله", dataIndex: "StageName", key: "stageName" },
    { title: "علایم ورود به این مرحله", dataIndex: "EntryCriteria", key: "entryCriteria" },
    { title: "تعداد روز مورد انتظار برای ورود به این مرحله", dataIndex: "StartDay", key: "startDay" },
    { title: "علائم خروج از این مرحله", dataIndex: "ExitCriteria", key: "exitCriteria" },
    { title: "تعداد روز مورد انتظار برای خروج از این مرحله", dataIndex: "EndDay", key: "endDay" },
    {
      title: "",
      key: "actions",
      render: (_: any, record: PlantGrowthStages) => (
        <TableActions
          onEdit={() =>
            setEditModal({
              isOpen: true,
              editData: record,
              isEditMode: true,
              setMainData: props.setMainData,
              setMainLoading: props.setMainLoading,
              StageID: record.StageID,
            })
          }
          onDelete={() => {
            setDeleteModal({
              open: true,
              onClose: () => setDeleteModal(null),
              id: record.StageID,
              name: "مرحله " + record.StageName || "",
              onDelete: () => handleDelete(record.StageID),
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
      const newData: PlantGrowthStages[] = await getGrowthStages();
      props.setMainData?.(newData);
      props.setMainLoading?.(false);
    }
  };

  return (
    <div className="w-full">
      <InsertionRow
        text=" مرحله رشد گیاه"
        insertOnclick={() =>
          setEditModal({
            isOpen: true,
            isEditMode: false,
            setMainData: props.setMainData,
            setMainLoading: props.setMainLoading,
          })
        }
        csvOnclick={() => {
          downloadCSVFromAntd<PlantGrowthStages>(props.data || [], columns, "growth-stages", {
            forceExcelSeparatorLine: false,
            excludeKeys: ["actions"],
          });
        }}
        data={props.data}
      />

      <Table
        columns={columns}
        dataSource={props.data || []}
        loading={props.loading}
        rowKey="StageID"
        scroll={{ x: 300 }}
        pagination={false}
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
    </div>
  );
}
