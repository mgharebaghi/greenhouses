"use client";
import { Tbl_Plants } from "@/app/generated/prisma";
import Table from "@/shared/components/Table";
import { useState } from "react";
import PlantFormModal from "@/features/plants/components/PlantFormModal";

import InsertionRow from "@/shared/components/InsertionRow";
import TableActions from "@/shared/components/TableActions";
import DeleteModal, { DeleteModalProps } from "@/shared/components/DeleteModal";
import { deletePlant, getPlants } from "@/features/plants/services";
import { generateCsv, download, mkConfig } from "export-to-csv";
import { plantsCSVData, headers } from "../data/csvFileData";

type PlantsTableProps = {
  data: Tbl_Plants[];
  loading?: boolean;
  setMainData?: (data: Tbl_Plants[]) => void;
  setMainLoading?: (loading: boolean) => void;
};

export default function PlantsTable(props: PlantsTableProps) {
  const [formModal, setFormModal] = useState<{ open: boolean; record: Tbl_Plants | null }>({
    open: false,
    record: null,
  });
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
      dataIndex: "PlantFamily",
      key: "plantFamily",
    },
    {
      title: "",
      dataIndex: "actions",
      key: "actions",
      render: (_: any, record: Tbl_Plants) => (
        <TableActions
          onEdit={() => onEdit(record)}
          onDelete={() => {
            setOpenDeleteModal({
              open: true,
              onClose() {
                setOpenDeleteModal(null);
              },
              deleteLoading: deleteModalLoading,
              id: record.ID,
              name: record.CommonName || undefined,
              onDelete() {
                handleDelete(record.ID);
              },
              msg: deleteModalMsg,
            });
          }}
        />
      ),
    },
  ];

  const onEdit = (record: Tbl_Plants) => {
    setFormModal({
      open: true,
      record: record,
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
        insertOnclick={() => setFormModal({ open: true, record: null })}
        csvOnclick={async () => {
          const csvData = await plantsCSVData(props.data as any);
          const options = mkConfig({ useKeysAsHeaders: false, columnHeaders: headers, filename: "plants" });
          const csv = generateCsv(options)(csvData);
          download(options)(csv);
        }}
        data={props.data}
      />

      <Table columns={columns} dataSource={props.data} loading={props.loading} rowKey="ID" pagination={{ pageSize: 5 }} />

      <PlantFormModal
        modalOpen={formModal.open}
        setModalOpen={(open) => setFormModal((prev) => ({ ...prev, open }))}
        record={formModal.record}
        setMainData={props.setMainData!} // Assume provided, or handle optional
        setMainLoading={props.setMainLoading!} // Assume provided
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
