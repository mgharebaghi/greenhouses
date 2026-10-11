import {
  getGreenhouses,
  deleteGreenhouse,
} from "@/features/greenhouses/actions";
import type { GreenhouseRecord } from "@/features/greenhouses/types/record";
import DeleteModal, { DeleteModalProps } from "@/shared/components/DeleteModal";
import DetailModal, { InfoCard } from "@/shared/components/DetailModal";
import InsertionRow from "@/shared/components/InsertionRow";
import type { Column } from "@/shared/components/Table";
import Table from "@/shared/components/Table";
import TableActions from "@/shared/components/TableActions";
import { ActionFailure, runDeletion } from "@/shared/forms/delete-record";
import {
  EnvironmentOutlined,
  InfoCircleOutlined,
  ShopOutlined,
} from "@ant-design/icons";
import { Button } from "antd";
import dayjs from "dayjs";
import { download, generateCsv, mkConfig } from "export-to-csv";
import jalaliday from "jalaliday";
import { useState } from "react";
import { greenhousesCSVData } from "../exports/csv";
import type { GreenhouseDetails } from "../types";
import GreenhouseFormModal from "./GreenhouseFormModal";

dayjs.extend(jalaliday);

interface GreenHousesTableProps {
  data: GreenhouseDetails[];
  loading: boolean;
  setMainLoading: (loading: boolean) => void;
  setMainData: (data: GreenhouseDetails[]) => void;
}

export default function GreenhousesTable({
  data,
  loading,
  setMainData,
  setMainLoading,
}: GreenHousesTableProps) {
  const [deleteModal, setDeleteModal] = useState<DeleteModalProps | null>(null);
  const [deleteMsg, setDeleteMsg] = useState("");
  const [viewModal, setViewModal] = useState(false);
  const [viewRecord, setViewRecord] = useState<GreenhouseDetails | null>(null);

  const [formModal, setFormModal] = useState<{
    open: boolean;
    record: GreenhouseRecord | null;
  }>({
    open: false,
    record: null,
  });

  const columns: Column<GreenhouseDetails>[] = [
    {
      title: "جزئیات",
      key: "details",
      width: 80,
      align: "center",
      render: (_: unknown, record: GreenhouseRecord) => (
        <Button
          type="text"
          icon={
            <InfoCircleOutlined
              style={{ fontSize: "18px", color: "#10b981" }}
            />
          }
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
      render: (text: string) => (
        <span className="font-medium text-slate-700">{text}</span>
      ),
    },
    {
      title: "مالک",
      dataIndex: "OwnerID", // Ideally should join with Owner name, but keeping simple for now or need join in service
      key: "OwnerID",
      render: (val: number, record: GreenhouseDetails) => (
        <span className="text-slate-600">
          {record.Tbl_People
            ? `${record.Tbl_People.FirstName} ${record.Tbl_People.LastName}`
            : val}
        </span>
      ),
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
      render: (val: number) => (
        <span className="text-slate-600">
          {val ? Number(val).toLocaleString() : "-"}
        </span>
      ),
    },
    {
      title: "تاریخ احداث",
      dataIndex: "ConstructionDate",
      key: "ConstructionDate",
      render: (val: string) => (
        <span className="text-slate-600">
          {val ? dayjs(val).calendar("jalali").format("YYYY/MM/DD") : "-"}
        </span>
      ),
    },
    {
      title: "وضعیت",
      dataIndex: "IsActive",
      key: "IsActive",
      render: (isActive: boolean | null) => {
        const active = isActive ?? false;
        return (
          <span
            className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold ${
              active
                ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800"
                : "bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-400 border border-rose-200 dark:border-rose-800"
            }`}
          >
            <span
              className={`w-1.5 h-1.5 rounded-full ml-1.5 ${active ? "bg-emerald-500 animate-pulse" : "bg-rose-500"}`}
            ></span>
            {active ? "فعال" : "غیرفعال"}
          </span>
        );
      },
    },
    {
      title: "عملیات",
      dataIndex: "actions",
      key: "actions",
      render: (_: unknown, record: GreenhouseRecord) => (
        <TableActions
          onDelete={() =>
            setDeleteModal({
              open: true,
              id: record.ID,
              name: record.GreenhouseName || "",
              onClose: () => setDeleteModal(null),
              onDelete: handleDelete,
            })
          }
          onEdit={() => setFormModal({ open: true, record: record })}
        />
      ),
    },
  ];

  const handleDelete = async (id: number) => {
    await runDeletion(
      async () => {
        setMainLoading(true);
        setDeleteMsg("");
        const res = await deleteGreenhouse(id);
        if (res.status !== "ok") throw new ActionFailure(res.message);
        {
          setDeleteMsg(res.message);
          const newData = await getGreenhouses();
          setMainData(newData);
          setTimeout(() => {
            setDeleteModal(null);
            setDeleteMsg("");
          }, 1000);
        }
        setMainLoading(false);
      },
      () => {
        setMainLoading(false);
      },
    );
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
        <Table
          columns={columns}
          dataSource={data}
          rowKey="ID"
          loading={loading}
        />
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
                {
                  label: "متراژ",
                  value: viewRecord.AreaSqM
                    ? `${Number(viewRecord.AreaSqM).toLocaleString()} متر مربع`
                    : "—",
                },
                {
                  label: "مالک",
                  value: viewRecord.Tbl_People
                    ? `${viewRecord.Tbl_People.FirstName} ${viewRecord.Tbl_People.LastName}`
                    : "—",
                },
              ]}
            />
            <InfoCard
              title="اطلاعات تکمیلی و آدرس"
              icon={<EnvironmentOutlined />}
              color="#0ea5e9"
              items={[
                {
                  label: "تاریخ احداث",
                  value: viewRecord.ConstructionDate
                    ? dayjs(viewRecord.ConstructionDate)
                        .calendar("jalali")
                        .format("YYYY/MM/DD")
                    : "—",
                },
                {
                  label: "آدرس",
                  value: viewRecord.GreenhouseAddress,
                  span: true,
                },
                { label: "توضیحات", value: viewRecord.Notes, span: true },
              ]}
            />
          </div>
        </DetailModal>
      )}

      <GreenhouseFormModal
        modalOpen={formModal.open}
        setModalOpen={(open) => setFormModal((prev) => ({ ...prev, open }))}
        setMainData={setMainData}
        setMainLoading={setMainLoading}
        record={formModal.record}
      />
    </>
  );
}
