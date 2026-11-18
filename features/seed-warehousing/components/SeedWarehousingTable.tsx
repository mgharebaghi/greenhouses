"use client";

import { formatPersianDate } from "@/shared/dates/calendar";

import { runDeletion, ActionFailure } from "@/shared/forms/delete-record";

import type { SeedPackageDetails } from "@/features/seed-packages/types/details";
import type { WarehouseRecord } from "@/features/warehouses/types/record";

import { csvRows } from "@/shared/exports/csv";

import type { WarehouseTransactionDetails } from "../types/details";

import {
  deleteSeedWarehousing,
  getAllSeedWarehousing,
} from "@/features/seed-warehousing/actions";
import DeleteModal from "@/shared/components/DeleteModal";
import InsertionRow from "@/shared/components/InsertionRow";
import Table, { detailsColumn } from "@/shared/components/Table";
import TableActions from "@/shared/components/TableActions";
import { Tag, message } from "antd";
import { download, generateCsv, mkConfig } from "export-to-csv";
import useRemoteList from "@/shared/hooks/useRemoteList";
import { useState } from "react";
import { headers, seedWarehousingCSVData } from "../exports/csv";
import SeedWarehousingDetailModal from "./SeedWarehousingDetailModal";
import SeedWarehousingFormModal from "./SeedWarehousingFormModal";

interface Props {
  data: WarehouseTransactionDetails[];
  seedPackages: SeedPackageDetails[];
  warehouses: WarehouseRecord[];
}

export default function SeedWarehousingTable({
  data: initialData,
  seedPackages,
  warehouses,
}: Props) {
  const { data, setData, loading, refresh, setLoading } = useRemoteList(
    getAllSeedWarehousing,
    initialData,
  );
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
        message.success("تراکنش با موفقیت حذف شد");
        setDeleteModal(null);
        setData((rows) => rows.filter((row) => row.ID !== id));
      },
      () => {
        setLoading(false);
      },
    );
  };

  const columns = [
    detailsColumn<WarehouseTransactionDetails>((record) =>
      setDetailModal({ open: true, data: record }),
    ),
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
        formatPersianDate(date, { kind: "timestamp", fallback: "-" }),
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
      />

      <SeedWarehousingFormModal
        open={formModal.open}
        onCancel={() => setFormModal({ open: false, data: null })}
        data={formModal.data}
        seedPackages={seedPackages}
        warehouses={warehouses}
        refreshData={refresh}
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
