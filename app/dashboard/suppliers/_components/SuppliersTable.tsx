import Table from "@/app/dashboard/_components/UI/Table";
import InsertionRow from "@/app/dashboard/_components/UI/InsertionRow";
import TableActions from "@/app/dashboard/_components/UI/TableActions";
import DeleteModal, { DeleteModalProps } from "@/app/dashboard/_components/UI/DeleteModal";
import DetailModal, { InfoCard } from "@/app/dashboard/_components/UI/DetailModal";
import SupplierFormModal from "./SupplierFormModal";
import { useState } from "react";
import type { SupplierDTO } from "../types";
import { deleteSupplier, getSuppliers, SupplierResponse } from "@/app/lib/services/suppliers";
import { generateCsv, download, mkConfig } from "export-to-csv";
import { suppliersCSVData, headers } from "../data/csvFileData";
import { Button } from "antd";
import { ShopOutlined, UserOutlined, GlobalOutlined, CheckCircleOutlined, InfoCircleOutlined, UserAddOutlined } from "@ant-design/icons";

interface SuppliersTableProps {
  data: SupplierDTO[];
  loading: boolean;
  setLoading: (val: boolean) => void;
  setData: (data: SupplierDTO[]) => void;
}

export default function SuppliersTable({
  data,
  loading,
  setLoading,
  setData,
}: SuppliersTableProps) {
  const [deleteModal, setDeleteModal] = useState<DeleteModalProps | null>(null);
  const [deleteMsg, setDeleteMsg] = useState("");
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [viewModal, setViewModal] = useState(false);
  const [viewRecord, setViewRecord] = useState<SupplierDTO | null>(null);

  // Unified Modal State: { open: boolean, record: SupplierDTO | null }
  // When record is null, it's an Insert operation. When record is set, it's an Edit operation.
  const [formModal, setFormModal] = useState<{ open: boolean; record: SupplierDTO | null }>({
    open: false,
    record: null,
  });

  const columns = [
    {
      title: "جزئیات",
      key: "details",
      width: 70,
      align: "center" as const,
      render: (_: any, record: SupplierDTO) => (
        <Button
          type="text"
          icon={<InfoCircleOutlined className="text-blue-500 text-lg" />}
          onClick={() => {
            setViewRecord(record);
            setViewModal(true);
          }}
        />
      ),
    },
    {
      title: "نام شرکت / شخص",
      key: "Name",
      render: (_: any, r: SupplierDTO) => r.CompanyName || `${r.FirstName || ""} ${r.LastName || ""}`
    },
    { title: "برند", dataIndex: "BrandName", key: "BrandName" },
    { title: "شماره مجوز", dataIndex: "LicenseNumber", key: "LicenseNumber" },
    { title: "کشور", dataIndex: "SupplierCountry", key: "SupplierCountry" },
    { title: "شهر", dataIndex: "SupplierCity", key: "SupplierCity" },
    { title: "تلفن", dataIndex: "ContactTel", key: "ContactTel" },
    {
      title: "عملیات",
      key: "actions",
      render: (_: any, record: SupplierDTO) => (
        <TableActions
          onEdit={() => setFormModal({ open: true, record: record })}
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
        insertOnclick={() => setFormModal({ open: true, record: null })}
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

      {/* Unified Insert/Edit Modal */}
      <SupplierFormModal
        isOpen={formModal.open}
        setIsOpen={(open) => setFormModal(prev => ({ ...prev, open }))}
        record={formModal.record}
        setMainData={setData}
        setMainLoading={setLoading}
      />

      {viewRecord && (
        <DetailModal
          open={viewModal}
          onClose={() => setViewModal(false)}
          title={viewRecord.CompanyName || `${viewRecord.FirstName || ""} ${viewRecord.LastName || ""}`}
          icon={<ShopOutlined />}
          gradientFrom="emerald"
          gradientTo="teal"
        >
          <InfoCard
            title="اطلاعات کلی"
            icon={<UserOutlined />}
            color="#10b981"
            items={[
              { label: "نوع شخص", value: viewRecord.Legal ? <><CheckCircleOutlined className="text-emerald-500 ml-1" /> حقوقی</> : <><UserOutlined className="text-blue-500 ml-1" /> حقیقی</> },
              { label: "نام شرکت", value: viewRecord.CompanyName },
              { label: "برند", value: viewRecord.BrandName },
              { label: "نام شخص", value: `${viewRecord.FirstName || ""} ${viewRecord.LastName || ""}` },
              { label: "شماره مجوز", value: viewRecord.LicenseNumber },
            ]}
          />
          <InfoCard
            title="اطلاعات تماس و آدرس"
            icon={<GlobalOutlined />}
            color="#0ea5e9"
            items={[
              { label: "کشور", value: viewRecord.SupplierCountry },
              { label: "شهر", value: viewRecord.SupplierCity },
              { label: "تلفن", value: viewRecord.ContactTel },
              { label: "ایمیل", value: viewRecord.ContactEmail },
              { label: "آدرس", value: viewRecord.CompanyAddress, span: true },
            ]}
          />
        </DetailModal>
      )}
    </div>
  );
}
