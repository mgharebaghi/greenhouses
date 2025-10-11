import type { Plantings } from "@/app/generated/prisma";
import { DeleteOutlined, EditOutlined } from "@ant-design/icons";
import { Button, Table } from "antd";
import PlantingInsUpModal, { PlantingInsUpModalProps } from "./PlantingInsUpModal";
import { useState } from "react";
import DeleteModal, { DeleteModalProps } from "../../_components/tools/DeleteModal";
import { deletePlanting, getAllPlantings } from "@/app/lib/services/planting";
import dayjs from "dayjs";
import jalaliday from "jalaliday";

dayjs.extend(jalaliday);

type PlantingTableProps = {
  data: Plantings[];
  loading: boolean;
  setMainData?: (props: Plantings[]) => void;
  setMainLoading?: (loading: boolean) => void;
};

export default function PlantingTable({ data, loading, setMainData, setMainLoading }: PlantingTableProps) {
  const [editModal, setEditModal] = useState<PlantingInsUpModalProps | null>(null);
  const [onDeleteModal, setOnDeleteModal] = useState<DeleteModalProps | null>(null);
  const [onDeleteLoading, setOnDeleteLoading] = useState<boolean>(false);

  const columns = [
    {
      title: "شناسه کاشت",
      dataIndex: "PlantingID",
      key: "plantingID",
    },
    {
      title: "نام گلخانه",
      dataIndex: ["Zones", "Greenhouses", "GreenhouseName"],
      key: "greenhouseName",
    },
    {
      title: "سالن",
      dataIndex: ["Zones", "Name"],
      key: "zoneID",
    },
    {
      title: "گونه گیاهی",
      dataIndex: ["PlantVarieties", "VarietyName"],
      key: "varietyName",
    },
    {
      title: "تاریخ کاشت",
      dataIndex: "PlantDate",
      key: "plantDate",
      render: (date: string) => (
        <span>{date ? dayjs(date).calendar("jalali").locale("fa").format("YYYY/MM/DD") : "-"}</span>
      ),
    },
    {
      title: "بسته منبع",
      dataIndex: "SourceBatch",
      key: "sourceBatch",
    },
    {
      title: "تعداد گیاهان",
      dataIndex: "NumPlants",
      key: "numPlants",
    },
    {
      title: "تراکمِ بوته (گیاه در هر مترمربع)",
      dataIndex: "PlantsPerM2",
      key: "plantsPerM2",
    },
    {
      title: "تاریخِ برداشتِ مورد انتظار",
      dataIndex: "ExpectedHarvestDate",
      key: "expectedHarvestDate",
      render: (date: string) => (
        <span>{date ? dayjs(date).calendar("jalali").locale("fa").format("YYYY/MM/DD") : "-"}</span>
      ),
    },
    {
      title: "تاریخِ برداشتِ واقعی",
      dataIndex: "ActualHarvestDate",
      key: "actualHarvestDate",
      render: (date: string) => (
        <span>{date ? dayjs(date).calendar("jalali").locale("fa").format("YYYY/MM/DD") : "-"}</span>
      ),
    },
    {
      title: "روشِ کاشت",
      dataIndex: "SeedingMethod",
      key: "seedingMethod",
    },
    {
      title: "تاریخِ نشاکاری (انتقال نشاء)",
      dataIndex: "TransplantDate",
      key: "transplantDate",
      render: (date: string) => (
        <span>{date ? dayjs(date).calendar("jalali").locale("fa").format("YYYY/MM/DD") : "-"}</span>
      ),
    },
    {
      title: "تعدادِ گیاهِ شمارش‌شده",
      dataIndex: "PlantCountMeasured",
      key: "plantCountMeasured",
    },
    {
      title: "",
      dataIndex: "actions",
      key: "actions",
      render: (_: any, record: Plantings) => (
        <div className="flex items-center gap-2">
          <Button
            type="link"
            onClick={() =>
              setEditModal({
                open: true,
                isInEditing: true,
                initialData: record,
                setMainData,
                setMainLoading,
                plantingId: Number(record.PlantingID),
              })
            }
          >
            <EditOutlined />
          </Button>
          <Button type="link" danger onClick={() => handleDelete(record)}>
            <DeleteOutlined />
          </Button>
        </div>
      ),
    },
  ];

  const handleDelete = (record: Plantings) => {
    setOnDeleteModal({
      open: true,
      name: record.PlantingID + "",
      onClose: () => setOnDeleteModal(null),
      onDelete: onDelete,
      id: Number(record.PlantingID),
      deleteLoading: onDeleteLoading,
    });
  };

  const onDelete = async (id: number) => {
    setOnDeleteLoading(true);
    const res = await deletePlanting(id);
    if (res) {
      setOnDeleteLoading(false);
      setOnDeleteModal(null);
      setMainLoading?.(true);
      const newData: any = await getAllPlantings();
      setMainData?.(newData);
      setMainLoading?.(false);
    }
  };

  return (
    <>
      <Table columns={columns} dataSource={data} loading={loading} rowKey="PlantingID" scroll={{ x: "max-content" }} />

      <PlantingInsUpModal
        open={editModal?.open || false}
        setMainData={setMainData}
        setMainLoading={setMainLoading}
        onClose={() => setEditModal(null)}
        isInEditing={!!editModal?.isInEditing}
        initialData={editModal?.initialData}
        plantingId={Number(editModal?.initialData?.PlantingID)}
      />

      <DeleteModal
        open={onDeleteModal?.open || false}
        name={onDeleteModal?.name}
        onClose={() => setOnDeleteModal(null)}
        onDelete={() => onDeleteModal?.onDelete?.(Number(onDeleteModal?.id))}
        deleteLoading={onDeleteLoading}
      />
    </>
  );
}
