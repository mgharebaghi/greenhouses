"use client";

import { ActionFailure, runDeletion } from "@/shared/forms/delete-record";

import type { OrderDetails } from "../types/details";

import DeleteModal from "@/shared/components/DeleteModal";
import InsertionRow from "@/shared/components/InsertionRow";
import Table from "@/shared/components/Table";
import TableActions from "@/shared/components/TableActions";
import OrdersFormModal from "./OrdersFormModal";
// User requested specific QR layout for orders
// So I will create a specific OrdersQRModal later in the plan.
// For now I'll use a placeholder.
import { deleteOrder } from "@/features/orders/actions";
import { EyeOutlined, QrcodeOutlined } from "@ant-design/icons";
import { Button, Tooltip } from "antd";
import { useState } from "react";
import OrdersDetailModal from "./OrdersDetailModal";
import OrdersQRModal from "./OrdersQRModal";

interface OrdersTableProps {
  data: OrderDetails[];
  loading: boolean;
  setLoading: (loading: boolean) => void;
  setData: (data: OrderDetails[]) => void;
  refreshData: () => void;
}

export default function OrdersTable({
  data,
  loading,
  setLoading,
  refreshData,
}: OrdersTableProps) {
  const [deleteModal, setDeleteModal] = useState<{
    open: boolean;
    id: number;
    name: string;
  } | null>(null);
  const [formModal, setFormModal] = useState<{
    open: boolean;
    data: OrderDetails | null;
  }>({ open: false, data: null });
  const [qrModal, setQrModal] = useState<{
    open: boolean;
    data: Pick<OrderDetails, "ID" | "OrderCode"> | null;
  }>({ open: false, data: null });
  const [detailModal, setDetailModal] = useState<{
    open: boolean;
    data: OrderDetails | null;
  }>({ open: false, data: null });

  const handleDelete = async (id: number) => {
    await runDeletion(
      async () => {
        setLoading(true);
        const deleted = await deleteOrder(id);
        if (deleted.status !== "ok") throw new ActionFailure(deleted.message);
        setDeleteModal(null);
        refreshData();
      },
      () => {
        setLoading(false);
      },
    );
  };

  const columns = [
    {
      title: "جزئیات",
      key: "details",
      width: 80,
      align: "center" as const,
      render: (_: unknown, record: OrderDetails) => (
        <Tooltip title="مشاهده جزئیات">
          <Button
            icon={<EyeOutlined />}
            onClick={() => setDetailModal({ open: true, data: record })}
          />
        </Tooltip>
      ),
    },
    {
      title: "QR Code",
      key: "QRCode",
      width: 80,
      align: "center" as const,
      render: (_: unknown, record: OrderDetails) => (
        <Tooltip title="چاپ QR Code">
          <Button
            icon={<QrcodeOutlined />}
            onClick={() => setQrModal({ open: true, data: record })}
          />
        </Tooltip>
      ),
    },
    { title: "کد سفارش", dataIndex: "OrderCode", key: "OrderCode" },
    {
      title: "نام مشتری",
      key: "Customer",
      render: (_: unknown, record: OrderDetails) => {
        const p = record.Tbl_People_Tbl_Orders_CustomerIDToTbl_People;
        return p ? `${p.FirstName} ${p.LastName}` : "—";
      },
    },
    {
      title: "مدیر پروژه",
      key: "ProjectManager",
      render: (_: unknown, record: OrderDetails) => {
        const p = record.Tbl_People_Tbl_Orders_ProjectManagerToTbl_People;
        return p ? `${p.FirstName} ${p.LastName}` : "—";
      },
    },
    {
      title: "نام مجری ",
      key: "Supplier",
      render: (_: unknown, record: OrderDetails) => {
        const s = record.Tbl_suppliers;
        if (!s) return "—";
        return s.Legal ? s.CompanyName : `${s.FirstName} ${s.LastName}`;
      },
    },
    {
      title: "تعداد سفارش",
      dataIndex: "OrderCount",
      key: "OrderCount",
      render: (val: number | null) => (val ? val.toLocaleString() : "—"),
    },
    {
      title: "تاریخ ثبت",
      key: "OrderDate",
      render: (_: unknown, record: OrderDetails) =>
        record.OrderDate
          ? new Date(record.OrderDate).toLocaleDateString("fa-IR")
          : "—",
    },
    {
      title: "عملیات",
      key: "actions",
      render: (_: unknown, record: OrderDetails) => (
        <TableActions
          onDelete={() =>
            setDeleteModal({
              open: true,
              id: record.ID,
              name: record.OrderCode ?? "—",
            })
          }
          onEdit={() => setFormModal({ open: true, data: record })}
        />
      ),
    },
  ];

  return (
    <div className="w-full">
      <InsertionRow
        text="سفارش جدید"
        insertOnclick={() => setFormModal({ open: true, data: null })}
        data={data}
        csvOnclick={() => {}}
      />

      <Table
        columns={columns}
        dataSource={data}
        loading={loading}
        rowKey="ID"
        pagination={{ pageSize: 5 }}
      />

      <OrdersFormModal
        open={formModal.open}
        setOpen={(open: boolean) => setFormModal((prev) => ({ ...prev, open }))}
        setLoading={setLoading}
        data={formModal.data}
        refreshData={refreshData}
        onSuccess={(id) => {
          setQrModal({ open: true, data: { ID: id, OrderCode: "New Order" } });
        }}
      />

      <OrdersQRModal
        open={qrModal.open}
        setOpen={(open: boolean) => setQrModal((prev) => ({ ...prev, open }))}
        data={qrModal.data}
      />

      <OrdersDetailModal
        open={detailModal.open}
        onClose={() => setDetailModal((prev) => ({ ...prev, open: false }))}
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
