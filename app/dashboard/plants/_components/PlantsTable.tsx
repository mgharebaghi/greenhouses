"use client";
import { Plants } from "@/app/generated/prisma";
import { DeleteOutlined, EditOutlined } from "@ant-design/icons";
import { Table } from "antd";
import { useState } from "react";
import PlantsEditModal, { PlantsEditModalProps } from "@/app/dashboard/plants/_components/PlantsEditModal";
import PlantsDeleteModal, { PlantsDeleteModalProps } from "./PlantsDeleteModal";

type PlantsTableProps = {
  data: Plants[];
  loading?: boolean;
  setMainData?: (data: Plants[]) => void;
  setMainLoading?: (loading: boolean) => void;
};

export default function PlantsTable(props: PlantsTableProps) {
  const [openEditModal, setOpenEditModal] = useState<PlantsEditModalProps | null>(null);
  const [openDeleteModal, setOpenDeleteModal] = useState<PlantsDeleteModalProps | null>(null);
  const columns = [
    {
      title: "نام رایج",
      dataIndex: "CommonName",
      key: "commonName",
    },
    {
      title: "نام علمی",
      dataIndex: "ScientificName",
      key: "scientificName",
    },
    {
      title: "خانواده",
      dataIndex: "Family",
      key: "family",
    },
    {
      title: "",
      dataIndex: "actions",
      key: "actions",
      render: (_: any, record: Plants) => (
        <div className="flex gap-4">
          <button className="text-blue-500 hover:underline cursor-pointer" onClick={() => onEdit(record)}>
            <EditOutlined />
          </button>
          <button className="text-red-500 hover:underline cursor-pointer" onClick={() => onDelete(record)}>
            <DeleteOutlined />
          </button>
        </div>
      ),
    },
  ];

  const onEdit = (record: Plants) => {
    setOpenEditModal({
      isOpen: true,
      plant: record,
    });
  };

  const onDelete = (record: Plants) => {
    setOpenDeleteModal({
      isOpen: true,
      plant: record
    });
  }

  return (
    <>
      <Table columns={columns} dataSource={props.data} loading={props.loading} rowKey="PlantID" />
      <PlantsEditModal
        isOpen={openEditModal?.isOpen || false}
        onClose={() => setOpenEditModal({ isOpen: false })}
        plant={openEditModal?.plant}
        setMainData={props.setMainData}
        setMainLoading={props.setMainLoading}
      />
      <PlantsDeleteModal
        isOpen={openDeleteModal?.isOpen || false}
        onClose={() => setOpenDeleteModal({ isOpen: false })}
        plant={openDeleteModal?.plant}
        setMainData={props.setMainData}
        setMainLoading={props.setMainLoading}
      />
    </>
  );
}
