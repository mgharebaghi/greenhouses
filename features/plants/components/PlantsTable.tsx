"use client";

import { ActionFailure, runDeletion } from "@/shared/forms/delete-record";

import { csvRows } from "@/shared/exports/csv";

import PlantFormModal from "@/features/plants/components/PlantFormModal";
import type { PlantRecord } from "@/features/plants/types/record";
import Table from "@/shared/components/Table";
import { useState } from "react";

import { deletePlant, getPlants } from "@/features/plants/actions";
import DeleteModal, { DeleteModalProps } from "@/shared/components/DeleteModal";
import InsertionRow from "@/shared/components/InsertionRow";
import TableActions from "@/shared/components/TableActions";
import { download, generateCsv, mkConfig } from "export-to-csv";
import { headers, plantsCSVData } from "../exports/csv";

type PlantsTableProps = {
  data: PlantRecord[];
  loading?: boolean;
  setMainData?: (data: PlantRecord[]) => void;
  setMainLoading?: (loading: boolean) => void;
};

export default function PlantsTable(props: PlantsTableProps) {
  const [formModal, setFormModal] = useState<{
    open: boolean;
    record: PlantRecord | null;
  }>({
    open: false,
    record: null,
  });
  const [openDeleteModal, setOpenDeleteModal] =
    useState<DeleteModalProps | null>(null);
  const [deleteModalMsg] = useState("");
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
      render: (_: unknown, record: PlantRecord) => (
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

  const onEdit = (record: PlantRecord) => {
    setFormModal({
      open: true,
      record: record,
    });
  };

  const handleDelete = async (id: number) => {
    await runDeletion(
      async () => {
        setDeleteModalLoading(true);
        const res = await deletePlant(id);
        if (res.status !== "ok") throw new ActionFailure(res.message);
        {
          setDeleteModalLoading(false);
          setOpenDeleteModal(null);
          props.setMainLoading?.(true);
          const updateData = await getPlants();
          props.setMainData?.(updateData);
          props.setMainLoading?.(false);
        }
      },
      () => {
        setDeleteModalLoading(false);
        props.setMainLoading?.(false);
      },
    );
  };

  return (
    <>
      <InsertionRow
        text="اطلاعات پایه گیاهی"
        insertOnclick={() => setFormModal({ open: true, record: null })}
        csvOnclick={async () => {
          const csvData = await plantsCSVData(props.data);
          const options = mkConfig({
            useKeysAsHeaders: false,
            columnHeaders: headers,
            filename: "plants",
          });
          const csv = generateCsv(options)(csvRows(csvData, headers));
          download(options)(csv);
        }}
        data={props.data}
      />

      <Table
        columns={columns}
        dataSource={props.data}
        loading={props.loading}
        rowKey="ID"
        pagination={{ pageSize: 5 }}
      />

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
