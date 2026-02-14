"use client";

import Table from "@/shared/components/Table";
import InsertionRow from "@/shared/components/InsertionRow";
import TableActions from "@/shared/components/TableActions";
import DeleteModal from "@/shared/components/DeleteModal";
import OrdersFormModal from "./OrdersFormModal";
import QRCodeModal from "@/shared/components/QRCodeModal"; // Reuse existing or create custom?
// User requested specific QR layout for orders
// So I will create a specific OrdersQRModal later in the plan.
// For now I'll use a placeholder.
import { useState } from "react";
import { Button, Tooltip } from "antd";
import { QrcodeOutlined } from "@ant-design/icons";
import { deleteOrder } from "@/features/orders/services";
import OrdersQRModal from "./OrdersQRModal";
import OrdersDetailModal from "./OrdersDetailModal";
import { EyeOutlined } from "@ant-design/icons";

interface OrdersTableProps {
    data: any[];
    loading: boolean;
    setLoading: (loading: boolean) => void;
    setData: (data: any[]) => void;
    refreshData: () => void;
}

export default function OrdersTable({ data, loading, setLoading, setData, refreshData }: OrdersTableProps) {
    const [deleteModal, setDeleteModal] = useState<any>(null);
    const [formModal, setFormModal] = useState<{ open: boolean, data: any | null }>({ open: false, data: null });
    const [qrModal, setQrModal] = useState<{ open: boolean, data: any | null }>({ open: false, data: null });
    const [detailModal, setDetailModal] = useState<{ open: boolean, data: any | null }>({ open: false, data: null });

    const handleDelete = async (id: number) => {
        setLoading(true);
        await deleteOrder(id);
        setDeleteModal(null);
        refreshData();
    };

    const columns = [
        {
            title: "جزئیات",
            key: "details",
            width: 80,
            align: "center" as const,
            render: (_: any, record: any) => (
                <Tooltip title="مشاهده جزئیات">
                    <Button
                        icon={<EyeOutlined />}
                        onClick={() => setDetailModal({ open: true, data: record })}
                    />
                </Tooltip>
            )
        },
        {
            title: "QR Code",
            key: "QRCode",
            width: 80,
            align: "center" as const,
            render: (_: any, record: any) => (
                <Tooltip title="چاپ QR Code">
                    <Button
                        icon={<QrcodeOutlined />}
                        onClick={() => setQrModal({ open: true, data: record })}
                    />
                </Tooltip>
            )
        },
        { title: "کد سفارش", dataIndex: "OrderCode", key: "OrderCode" },
        {
            title: "نام مشتری",
            key: "Customer",
            render: (_: any, record: any) => {
                const p = record.Tbl_People_Tbl_Orders_CustomerIDToTbl_People;
                return p ? `${p.FirstName} ${p.LastName}` : "—";
            }
        },
        {
            title: "مدیر پروژه",
            key: "ProjectManager",
            render: (_: any, record: any) => {
                const p = record.Tbl_People_Tbl_Orders_ProjectManagerToTbl_People;
                return p ? `${p.FirstName} ${p.LastName}` : "—";
            }
        },
        {
            title: "نام مجری (تامین کننده)",
            key: "Supplier",
            render: (_: any, record: any) => {
                const s = record.Tbl_suppliers;
                if (!s) return "—";
                return s.Legal ? s.CompanyName : `${s.FirstName} ${s.LastName}`;
            }
        },
        { title: "تعداد سفارش", dataIndex: "OrderCount", key: "OrderCount", render: (val: any) => val ? val.toLocaleString() : "—" },
        {
            title: "تاریخ ثبت",
            key: "OrderDate",
            render: (_: any, record: any) => record.OrderDate ? new Date(record.OrderDate).toLocaleDateString("fa-IR") : "—"
        },
        {
            title: "عملیات",
            key: "actions",
            render: (_: any, record: any) => (
                <TableActions
                    onDelete={() => setDeleteModal({ open: true, id: record.ID, name: record.OrderCode })}
                    onEdit={() => setFormModal({ open: true, data: record })}
                />
            )
        }
    ];

    return (
        <div className="w-full">
            <InsertionRow
                text="سفارش جدید"
                insertOnclick={() => setFormModal({ open: true, data: null })}
                data={data}
                csvOnclick={() => { }}
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
                setOpen={(open: boolean) => setFormModal(prev => ({ ...prev, open }))}
                setLoading={setLoading}
                data={formModal.data}
                refreshData={refreshData}
                onSuccess={(id) => {
                    setQrModal({ open: true, data: { ID: id, OrderCode: "New Order" } });
                }}
            />

            <OrdersQRModal
                open={qrModal.open}
                setOpen={(open: boolean) => setQrModal(prev => ({ ...prev, open }))}
                data={qrModal.data}
            />

            <OrdersDetailModal
                open={detailModal.open}
                onClose={() => setDetailModal(prev => ({ ...prev, open: false }))}
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
