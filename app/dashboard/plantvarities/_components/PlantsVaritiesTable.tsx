import { Button, Table } from "antd";
import { PlantVarietyDTO } from "../page";
import { DeleteOutlined, EditOutlined } from "@ant-design/icons";
import PlantVaritiesEditModal from "./PlantVaritiesEditModal";
import { useState } from "react";
import PlantVaritiesDeleteModal from "./PlantVaritiesDeletModal";

type PlantVarietiesTableProps = {
  data: PlantVarietyDTO[];
  loading?: boolean;
  setMainData?: (data: PlantVarietyDTO[]) => void;
  setMainLoading?: (loading: boolean) => void;
};

type editModalProps = {
  isOpen: boolean;
  onClose?: () => void;
  record?: PlantVarietyDTO;
  setMainLoading?: (loading: boolean) => void;
  setMainData?: (data: PlantVarietyDTO[]) => void;
};

export default function PlantVaritiesTable({ data, loading, setMainData, setMainLoading }: PlantVarietiesTableProps) {
  const [editModalOpen, setEditModalOpen] = useState<editModalProps | null>(null);
  const [deleteModalOpen, setDeleteModalOpen] = useState<editModalProps | null>(null);

  const columns = [
    {
      title: "نام گونه",
      dataIndex: "VarietyName",
      key: "VarietyName",
    },
    {
      title: "نام گیاه",
      dataIndex: ["Plants", "CommonName"],
      key: "CommonName",
    },
    {
      title: "شرکت بذر",
      dataIndex: "SeedCompany",
      key: "SeedCompany",
    },
    {
      title: "روز تا جوانه زنی",
      dataIndex: "DaysToGermination",
      key: "DaysToGermination",
    },
    {
      title: "روز تا رویش",
      dataIndex: "DaysToSprout",
      key: "DaysToSprout",
    },
    {
      title: "روز تا نشاء",
      dataIndex: "DaysToSeedling",
      key: "DaysToSeedling",
    },
    {
      title: "روز تا بلوغ",
      dataIndex: "DaysToMaturity",
      key: "DaysToMaturity",
    },
    {
      title: "عملکرد معمول کیلوگرم بر متر مربع",
      dataIndex: "TypicalYieldKgPerM2",
      key: "TypicalYieldKgPerM2",
    },
    {
      title: "حداقل دمای ایده آل ",
      dataIndex: "IdealTempMin",
      key: "IdealTempMin",
    },
    {
      title: "حداکثر دمای ایده آل",
      dataIndex: "IdealTempMax",
      key: "IdealTempMax",
    },
    {
      title: "حداقل رطوبت ایده آل",
      dataIndex: "IdealHumidityMin",
      key: "IdealHumidityMin",
    },
    {
      title: "حداکثر رطوبت ایده آل",
      dataIndex: "IdealHumidityMax",
      key: "IdealHumidityMax",
    },
    {
      title: "نیاز نوری",
      dataIndex: "LightRequirement",
      key: "LightRequirement",
    },
    {
      title: "چرخه رشد (روز)",
      dataIndex: "GrowthCycleDays",
      key: "GrowthCycleDays",
    },
    {
      title: "",
      dataIndex: "actions",
      key: "actions",
      render: (_: any, record: PlantVarietyDTO) => (
        <div className="flex gap-2">
          <Button type="link" onClick={() => setEditModalOpen({ isOpen: true, record })}>
            <EditOutlined />
          </Button>
          <Button type="link" danger onClick={() => setDeleteModalOpen({ isOpen: true, record })}>
            <DeleteOutlined />
          </Button>
        </div>
      ),
    },
  ];

  return (
    <>
      <Table
        columns={columns}
        dataSource={data}
        rowKey="VarietyID"
        pagination={{ pageSize: 10 }}
        scroll={{ x: "max-content" }}
        loading={loading}
      />

      <PlantVaritiesEditModal
        isOpen={editModalOpen?.isOpen || false}
        onClose={() => setEditModalOpen(null)}
        record={editModalOpen?.record}
        setMainLoading={setMainLoading}
        setMainData={setMainData}
      />

      <PlantVaritiesDeleteModal
        isOpen={deleteModalOpen?.isOpen || false}
        onClose={() => setDeleteModalOpen(null)}
        record={deleteModalOpen?.record}
        setMainLoading={setMainLoading}
        setMainData={setMainData}
      />
    </>
  );
}
