"use client";
import { Plants } from "@/app/generated/prisma";
import Table from "@/app/dashboard/_components/UI/Table";
import { useState } from "react";
import PlantsEditModal, { PlantsEditModalProps } from "@/app/dashboard/plants/_components/PlantsEditModal";
import PlantsDeleteModal, { PlantsDeleteModalProps } from "./PlantsDeleteModal";
import InsertionRow from "../../_components/UI/InsertionRow";
import TableActions from "../../_components/UI/TableActions";
import DeleteModal, { DeleteModalProps } from "../../_components/UI/DeleteModal";
import { deletePlant, getPlants } from "@/app/lib/services/plants";
import { generateCsv, download, mkConfig } from "export-to-csv";
import { plantsCSVData, headers } from "../data/csvFileData";

type PlantsTableProps = {
  data: Plants[];
  loading?: boolean;
  setMainData?: (data: Plants[]) => void;
  setMainLoading?: (loading: boolean) => void;
  setInsertModalOpen?: (open: boolean) => void;
};

export default function PlantsTable(props: PlantsTableProps) {
  const [openEditModal, setOpenEditModal] = useState<PlantsEditModalProps | null>(null);
  const [openDeleteModal, setOpenDeleteModal] = useState<DeleteModalProps | null>(null);
  const [deleteModalMsg, setDeleteModalMsg] = useState("");
  const [deleteModalLoading, setDeleteModalLoading] = useState(false);
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
        <TableActions
          onEdit={() => onEdit(record)}
          onDelete={() => {
            setOpenDeleteModal({
              open: true,
              onClose() {
                setOpenDeleteModal(null);
              },
              deleteLoading: deleteModalLoading,
              id: record.PlantID,
              name: record.CommonName || undefined,
              onDelete() {
                handleDelete(record.PlantID);
              },
              msg: deleteModalMsg,
            });
          }}
        />
      ),
    },
  ];

  const onEdit = (record: Plants) => {
    setOpenEditModal({
      isOpen: true,
      plant: record,
    });
  };

  const handleDelete = async (id: number) => {
    setDeleteModalLoading(true);
    const res = await deletePlant(id);
    if (res) {
      setDeleteModalLoading(false);
      setOpenDeleteModal(null);
      props.setMainLoading?.(true);
      const updateData = await getPlants();
      props.setMainData?.(updateData);
      props.setMainLoading?.(false);
    }
  };

  return (
    <>
      <InsertionRow
        text="اطلاعات پایه گیاهی"
        insertOnclick={() => props.setInsertModalOpen?.(true)}
        csvOnclick={async () => {
          const csvData = await plantsCSVData(props.data as any);
          const options = mkConfig({ useKeysAsHeaders: false, columnHeaders: headers, filename: "plants" });
          const csv = generateCsv(options)(csvData);
          download(options)(csv);
        }}
        data={props.data}
      />

      <Table columns={columns} dataSource={props.data} loading={props.loading} rowKey="PlantID" pagination={{ pageSize: 5 }} />

      <PlantsEditModal
        isOpen={openEditModal?.isOpen || false}
        onClose={() => setOpenEditModal({ isOpen: false })}
        plant={openEditModal?.plant}
        setMainData={props.setMainData}
        setMainLoading={props.setMainLoading}
      />

      <DeleteModal
        open={openDeleteModal?.open || false}
        onClose={openDeleteModal?.onClose || (() => setOpenDeleteModal(null))}
        deleteLoading={deleteModalLoading}
        id={openDeleteModal?.id}
        name={openDeleteModal?.name}
        onDelete={openDeleteModal?.onDelete}
        msg={deleteModalMsg}
      />
    </>
  );
}
