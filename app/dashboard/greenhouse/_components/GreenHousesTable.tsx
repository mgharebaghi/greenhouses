import { Tbl_Greenhouses as GreenHouse } from "@/app/generated/prisma/client";
import { useState } from "react";
import InsertionRow from "../../_components/UI/InsertionRow";
import Table from "@/app/dashboard/_components/UI/Table";
import TableActions from "../../_components/UI/TableActions";
import DeleteModal, { DeleteModalProps } from "../../_components/UI/DeleteModal";
import DetailModal, { InfoCard } from "@/app/dashboard/_components/UI/DetailModal";
import { allGreenHouses, deleteGreenHouse } from "@/app/lib/services/greenhouse";
import { generateCsv, download, mkConfig } from "export-to-csv";
import { greenhousesCSVData, headers } from "../data/csvFileData";
import { Button } from "antd";
import { InfoCircleOutlined, ShopOutlined, EnvironmentOutlined, CheckCircleOutlined, CloseCircleOutlined } from "@ant-design/icons";
import GreenHouseFormModal from "./GreenHouseFormModal";
import dayjs from "dayjs";
import jalaliday from "jalaliday";

dayjs.extend(jalaliday);

interface GreenHousesTableProps {
  data: GreenHouse[];
  loading: boolean;
  setMainLoading: (loading: boolean) => void;
  setMainData: (data: GreenHouse[]) => void;
}

export default function GreenHousesTable({
  data,
  loading,
  setMainData,
  setMainLoading,
}: GreenHousesTableProps) {
  const [deleteModal, setDeleteModal] = useState<DeleteModalProps | null>(null);
  const [deleteMsg, setDeleteMsg] = useState("");
  const [viewModal, setViewModal] = useState(false);
  const [viewRecord, setViewRecord] = useState<GreenHouse | null>(null);

  const [formModal, setFormModal] = useState<{ open: boolean; record: GreenHouse | null }>({
    open: false,
    record: null,
  });

  const columns: any[] = [
    {
      title: "جزئیات",
      key: "details",
      width: 80,
      align: "center",
      render: (_: any, record: GreenHouse) => (
        <Button
          type="text"
          icon={<InfoCircleOutlined style={{ fontSize: "18px", color: "#10b981" }} />}
          onClick={() => {
            setViewRecord(record);
            setViewModal(true);
          }}
        />
      ),
    },
    {
      title: "نام گلخانه",
      dataIndex: "GreenhouseName",
      key: "GreenhouseName",
      render: (text: string) => <span className="font-medium text-slate-700">{text}</span>,
    },
    {
      title: "مالک",
      dataIndex: "OwnerID", // Ideally should join with Owner name, but keeping simple for now or need join in service
      key: "OwnerID",
      render: (val: number, record: any) => <span className="text-slate-600">{record.Tbl_People ? `${record.Tbl_People.FirstName} ${record.Tbl_People.LastName}` : val}</span>,
    },
    {
      title: "نوع گلخانه",
      dataIndex: "GreenhouseType",
      key: "GreenhouseType",
      render: (text: string) => <span className="text-slate-600">{text}</span>,
    },
    {
      title: "متراژ (متر)",
      dataIndex: "AreaSqM",
      key: "AreaSqM",
      render: (val: number) => <span className="text-slate-600">{val ? Number(val).toLocaleString() : "-"}</span>,
    },
    {
      title: "تاریخ احداث",
      dataIndex: "ConstructionDate",
      key: "ConstructionDate",
      render: (val: string) => <span className="text-slate-600">{val ? dayjs(val).calendar("jalali").format("YYYY/MM/DD") : "-"}</span>,
    },
    {
      title: "وضعیت",
      dataIndex: "IsActive",
      key: "IsActive",
      render: (isActive: boolean | null) => {
        const active = isActive ?? false;
        return (
          <span
            className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold ${active
              ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800"
              : "bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-400 border border-rose-200 dark:border-rose-800"
              }`}
          >
            <span className={`w-1.5 h-1.5 rounded-full ml-1.5 ${active ? "bg-emerald-500 animate-pulse" : "bg-rose-500"}`}></span>
            {active ? "فعال" : "غیرفعال"}
          </span>
        );
      },
    },
    {
      title: "عملیات",
      dataIndex: "actions",
      key: "actions",
      render: (_: any, record: GreenHouse) => (
        <TableActions
          onDelete={() => setDeleteModal({
            open: true,
            id: record.ID,
            name: record.GreenhouseName || "",
            onClose: () => setDeleteModal(null),
            onDelete: handleDelete
          })}
          onEdit={() => setFormModal({ open: true, record: record })}
        />
      ),
    },
  ];

  const handleDelete = async (id: number) => {
    setMainLoading(true);
    setDeleteMsg("");
    const res = await deleteGreenHouse(id);
    if (res.status === "ok") {
      setDeleteMsg(res.message);
      const newData = await allGreenHouses();
      setMainData(newData);
      setTimeout(() => {
        setDeleteModal(null);
        setDeleteMsg("");
      }, 1000);
    } else {
      setDeleteMsg(res.message);
    }
    setMainLoading(false);
  };

  const handleExportCsv = async () => {
    const csvConfig = mkConfig({
      fieldSeparator: ",",
      decimalSeparator: ".",
      useKeysAsHeaders: true,
      filename: "greenhouses_export",
    });
    const csvDataPromise = greenhousesCSVData(data);
    const csvData = await csvDataPromise;
    const csv = generateCsv(csvConfig)(csvData);
    download(csvConfig)(csv);
  };

  return (
    <>
      <InsertionRow
        text="گلخانه"
        insertOnclick={() => setFormModal({ open: true, record: null })}
        csvOnclick={handleExportCsv}
        data={data}
      />

      <div className="bg-white dark:bg-slate-900 rounded-b-xl border border-t-0 border-slate-200 dark:border-slate-700 p-4 shadow-sm">
        <Table columns={columns} dataSource={data} rowKey="ID" loading={loading} />
      </div>

      {deleteModal && (
        <DeleteModal
          open={deleteModal.open}
          onClose={() => setDeleteModal(null)}
          onDelete={handleDelete}
          msg={deleteMsg}
          name={deleteModal.name}
          id={deleteModal.id}
          deleteLoading={loading}
        />
      )}

      {viewModal && viewRecord && (
        <DetailModal
          open={viewModal}
          onClose={() => setViewModal(false)}
          title={viewRecord.GreenhouseName || "جزئیات گلخانه"}
          icon={<ShopOutlined />}
          gradientFrom="emerald"
          gradientTo="teal"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <InfoCard
              title="اطلاعات کلی"
              icon={<ShopOutlined />}
              color="#10b981"
              items={[
                { label: "نام گلخانه", value: viewRecord.GreenhouseName },
                { label: "نوع سازه", value: viewRecord.GreenhouseType },
                { label: "متراژ", value: viewRecord.AreaSqM ? `${Number(viewRecord.AreaSqM).toLocaleString()} متر مربع` : "—" },
                { label: "مالک", value: (viewRecord as any).Tbl_People ? `${(viewRecord as any).Tbl_People.FirstName} ${(viewRecord as any).Tbl_People.LastName}` : "—" },
              ]}
            />
            <InfoCard
              title="اطلاعات تکمیلی و آدرس"
              icon={<EnvironmentOutlined />}
              color="#0ea5e9"
              items={[
                { label: "تاریخ احداث", value: viewRecord.ConstructionDate ? dayjs(viewRecord.ConstructionDate).calendar("jalali").format("YYYY/MM/DD") : "—" },
                { label: "آدرس", value: viewRecord.GreenhouseAddress, span: true },
                { label: "توضیحات", value: viewRecord.Notes, span: true },
              ]}
            />
          </div>
        </DetailModal>
      )}

      <GreenHouseFormModal
        modalOpen={formModal.open}
        setModalOpen={(open) => setFormModal((prev) => ({ ...prev, open }))}
        setMainData={setMainData}
        setMainLoading={setMainLoading}
        record={formModal.record}
      />
    </>
  );
}
