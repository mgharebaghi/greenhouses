"use client";

import { runDeletion, ActionFailure } from "@/shared/forms/delete-record";

import type { SeedPackageRecord } from "@/features/seed-packages/types/record";
import type { WarehouseRecord } from "@/features/warehouses/types/record";

import { csvRows } from "@/shared/exports/csv";

import type { WarehouseTransactionDetails } from "../types/details";

import { deleteSeedWarehousing } from "@/features/seed-warehousing/actions";
import DeleteModal from "@/shared/components/DeleteModal";
import InsertionRow from "@/shared/components/InsertionRow";
import Table from "@/shared/components/Table";
import TableActions from "@/shared/components/TableActions";
import { InfoCircleOutlined } from "@ant-design/icons";
import { Button, Tag, Tooltip, message } from "antd";
import dayjs from "dayjs";
import { download, generateCsv, mkConfig } from "export-to-csv";
import jalaliday from "jalaliday";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { headers, seedWarehousingCSVData } from "../exports/csv";
import SeedWarehousingDetailModal from "./SeedWarehousingDetailModal";
import SeedWarehousingFormModal from "./SeedWarehousingFormModal";

dayjs.extend(jalaliday);

interface Props {
  data: WarehouseTransactionDetails[];
  seedPackages: SeedPackageRecord[];
  warehouses: WarehouseRecord[];
}

export default function SeedWarehousingTable({
  data,
  seedPackages,
  warehouses,
}: Props) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formModal, setFormModal] = useState<{
    open: boolean;
    data: WarehouseTransactionDetails | null;
  }>({
    open: false,
    data: null,
  });
  const [detailModal, setDetailModal] = useState<{
    open: boolean;
    data: WarehouseTransactionDetails | null;
  }>({
    open: false,
    data: null,
  });
  const [deleteModal, setDeleteModal] = useState<{
    open: boolean;
    id: number;
    name: string;
  } | null>(null);

  const handleDelete = async (id: number) => {
    await runDeletion(
      async () => {
        setLoading(true);
        const result = await deleteSeedWarehousing(id);
        if (result.status !== "ok") throw new ActionFailure(result.message);
        {
          message.success("تراکنش با موفقیت حذف شد");
          setDeleteModal(null);
          router.refresh();
        }
      },
      () => {
        setLoading(false);
      },
    );
  };

  const refreshData = () => {
    router.refresh();
  };

  const columns = [
    {
      title: "جزئیات",
      key: "details",
      width: 80,
      render: (_: unknown, record: WarehouseTransactionDetails) => (
        <Tooltip title="مشاهده جزئیات">
          <Button
            type="text"
            icon={
              <InfoCircleOutlined
                style={{ color: "#3b82f6", fontSize: "18px" }}
              />
            }
            onClick={() => setDetailModal({ open: true, data: record })}
          />
        </Tooltip>
      ),
    },
    {
      title: "شماره تراکنش",
      dataIndex: "ID",
      key: "ID",
    },
    {
      title: "نوع",
      dataIndex: "TransactionType",
      key: "TransactionType",
      render: (val: boolean) => (
        <Tag color={val ? "green" : "red"}>{val ? "ورودی" : "خروجی"}</Tag>
      ),
    },
    {
      title: "تعداد",
      dataIndex: "PackageQuantity",
      key: "PackageQuantity",
    },
    {
      title: "بسته بذر",
      key: "SeedPackage",
      width: 150,
      render: (_: unknown, record: WarehouseTransactionDetails) => (
        <span>
          {record.Tbl_SeedPackage?.SerialNumber}{" "}
          <span className="text-xs text-slate-400">
            ({record.Tbl_SeedPackage?.PackageType})
          </span>
        </span>
      ),
    },
    {
      title: "انبار",
      key: "Warehouse",
      width: 150,
      render: (_: unknown, record: WarehouseTransactionDetails) =>
        record.Tbl_Warehouses?.WarehouseName || "-",
    },
    {
      title: "تاریخ",
      dataIndex: "TransactionDate",
      key: "TransactionDate",
      render: (date: Date | string | null) =>
        date ? dayjs(date).calendar("jalali").format("YYYY/MM/DD") : "-",
    },
    {
      title: "عملیات",
      key: "actions",
      render: (_: unknown, record: WarehouseTransactionDetails) => (
        <TableActions
          onEdit={() => setFormModal({ open: true, data: record })}
          onDelete={() =>
            setDeleteModal({
              open: true,
              id: record.ID,
              name: `تراکنش ${record.ID}`,
            })
          }
        />
      ),
    },
  ];

  return (
    <div className="w-full">
      <InsertionRow
        text="وردی یا خروجی"
        insertOnclick={() => setFormModal({ open: true, data: null })}
        data={data}
        csvOnclick={async () => {
          const csvData = await seedWarehousingCSVData(data);
          const options = mkConfig({
            useKeysAsHeaders: false,
            columnHeaders: headers,
            filename: "seed-warehousing",
          });
          const csv = generateCsv(options)(csvRows(csvData, headers));
          download(options)(csv);
        }}
      />

      <Table
        dataSource={data}
        columns={columns}
        rowKey="ID"
        loading={loading}
        pagination={{ pageSize: 10 }}
      />

      <SeedWarehousingFormModal
        open={formModal.open}
        onCancel={() => setFormModal({ open: false, data: null })}
        data={formModal.data}
        seedPackages={seedPackages}
        warehouses={warehouses}
        onSuccess={refreshData}
      />

      <SeedWarehousingDetailModal
        open={detailModal.open}
        onCancel={() => setDetailModal({ open: false, data: null })}
        data={detailModal.data}
      />

      <DeleteModal
        open={deleteModal?.open || false}
        onClose={() => setDeleteModal(null)}
        id={deleteModal?.id}
        name={deleteModal?.name}
        onDelete={handleDelete}
        deleteLoading={loading}
      />
    </div>
  );
}
