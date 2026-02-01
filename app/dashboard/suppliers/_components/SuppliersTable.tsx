import Table from "@/app/dashboard/_components/UI/Table";
import InsertionRow from "@/app/dashboard/_components/UI/InsertionRow";
import TableActions from "@/app/dashboard/_components/UI/TableActions";
import DeleteModal, { DeleteModalProps } from "@/app/dashboard/_components/UI/DeleteModal";
import { useState } from "react";
import type { SupplierDTO } from "../types";
import { deleteSupplier, getSuppliers, SupplierResponse } from "@/app/lib/services/suppliers";
import { generateCsv, download, mkConfig } from "export-to-csv";
import { suppliersCSVData, headers } from "../data/csvFileData";

interface SuppliersTableProps {
  data: SupplierDTO[];
  loading: boolean;
  setLoading: (val: boolean) => void;
  setData: (data: SupplierDTO[]) => void;
  onEdit: (record: SupplierDTO) => void;
  setInsertModal: (open: boolean) => void;
}

export default function SuppliersTable({
  data,
  loading,
  setLoading,
  setData,
  onEdit,
  setInsertModal,
}: SuppliersTableProps) {
  const [deleteModal, setDeleteModal] = useState<DeleteModalProps | null>(null);
  const [deleteMsg, setDeleteMsg] = useState("");
  const [deleteLoading, setDeleteLoading] = useState(false);

  const columns = [
    { title: "نام شرکت", dataIndex: "CompanyName", key: "CompanyName" },
    { title: "آدرس", dataIndex: "CompanyAddress", key: "CompanyAddress" },
    { title: "نام", dataIndex: "FirstName", key: "FirstName" },
    { title: "نام خانوادگی", dataIndex: "LastName", key: "LastName" },
    { title: "تلفن", dataIndex: "ContactTel", key: "ContactTel" },
    { title: "ایمیل", dataIndex: "ContactEmail", key: "ContactEmail" },
    {
      title: "عملیات",
      key: "actions",
      render: (_: any, record: SupplierDTO) => (
        <TableActions
          onEdit={() => onEdit(record)}
          onDelete={() => {
            setDeleteModal({
              open: true,
              onClose: () => setDeleteModal(null),
              deleteLoading,
              id: record.ID,
              name: record.CompanyName || record.FirstName || "تامین کننده",
              onDelete: () => handleDelete(record.ID),
              msg: deleteMsg,
            });
          }}
        />
      ),
    },
  ];

  const handleDelete = async (id: number) => {
    setDeleteMsg("");
    setDeleteLoading(true);
    const res: SupplierResponse = await deleteSupplier(id);
    if (res.status === "ok") {
      setDeleteLoading(false);
      setDeleteModal(null);
    } else {
      setDeleteLoading(false);
      setDeleteMsg(res.message);
      return;
    }
    setLoading(true);
    const fresh = await getSuppliers();
    setData(fresh);
    setLoading(false);
  };

  return (
    <div className="w-full">
      <InsertionRow
        text="اطلاعات تامین کنندگان"
        insertOnclick={() => setInsertModal(true)}
        csvOnclick={async () => {
          const csvData = await suppliersCSVData(data as any);
          const options = mkConfig({ useKeysAsHeaders: false, columnHeaders: headers, filename: "suppliers" });
          const csv = generateCsv(options)(csvData);
          download(options)(csv);
        }}
        data={data}
      />

      <Table columns={columns} dataSource={data} rowKey="ID" pagination={{ pageSize: 5 }} loading={loading} />

      <DeleteModal
        open={deleteModal?.open || false}
        onClose={() => setDeleteModal(null)}
        deleteLoading={deleteLoading}
        id={deleteModal?.id}
        msg={deleteMsg}
        name={deleteModal?.name}
        onDelete={deleteModal?.onDelete}
        setMsg={setDeleteMsg}
      />
    </div>
  );
}
