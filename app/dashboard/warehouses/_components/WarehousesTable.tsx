"use client";

import Table from "@/app/dashboard/_components/UI/Table";
import InsertionRow from "@/app/dashboard/_components/UI/InsertionRow";
import TableActions from "@/app/dashboard/_components/UI/TableActions";
import DeleteModal from "@/app/dashboard/_components/UI/DeleteModal";
import WarehousesInsertModal from "./WarehousesInsertModal";
import WarehousesEditModal from "./WarehousesEditModal";
import WarehousesDetailModal from "./WarehousesDetailModal";
import { useState } from "react";
import { deleteWarehouse } from "@/app/lib/services/warehouses";
import { Button, Tooltip } from "antd";
import { InfoCircleOutlined } from "@ant-design/icons";

interface WarehousesTableProps {
    data: any[];
    loading: boolean;
    setLoading: (loading: boolean) => void;
    setData: (data: any[]) => void;
    refreshData: () => void;
}

export default function WarehousesTable({ data, loading, setLoading, setData, refreshData }: WarehousesTableProps) {
    const [deleteModal, setDeleteModal] = useState<any>(null);
    const [insertModal, setInsertModal] = useState(false);
    const [editModal, setEditModal] = useState<{ open: boolean, data: any | null }>({ open: false, data: null });
    const [detailModal, setDetailModal] = useState<{ open: boolean, data: any | null }>({ open: false, data: null });

    const columns = [
        {
            title: "جزئیات",
            key: "details",
            width: 80,
            align: "center" as const,
            render: (_: any, record: any) => (
                <Tooltip title="مشاهده جزئیات">
                    <Button
                        type="text"
                        icon={<InfoCircleOutlined style={{ color: "#3b82f6", fontSize: "18px" }} />}
                        onClick={() => setDetailModal({ open: true, data: record })}
                    />
                </Tooltip>
            ),
        },
        { title: "کد انبار", dataIndex: "WarehouseCode", key: "WarehouseCode" },
        { title: "نام انبار", dataIndex: "WarehouseName", key: "WarehouseName" },
        { title: "موقعیت", dataIndex: "WarehouseLocation", key: "WarehouseLocation" },
        { title: "ظرفیت", dataIndex: "Capacity", key: "Capacity" },
        { title: "محدوده دما", dataIndex: "TemperatureRange", key: "TemperatureRange" },
        {
            title: "مسئول انبار",
            key: "Manager",
            render: (_: any, record: any) => record.Owner_Observer ? `${record.Owner_Observer.FirstName} ${record.Owner_Observer.LastName}` : "-"
        },
        {
            title: "عملیات",
            key: "actions",
            render: (_: any, record: any) => (
                <TableActions
                    onDelete={() => setDeleteModal({ open: true, id: record.WarehouseID, name: record.WarehouseName })}
                    onEdit={() => setEditModal({ open: true, data: record })}
                />
            )
        }
    ];

    const handleDelete = async (id: number) => {
        setLoading(true);
        await deleteWarehouse(id);
        setDeleteModal(null);
        refreshData();
    };

    return (
        <div className="w-full">
            <InsertionRow
                text="انبار"
                insertOnclick={() => setInsertModal(true)}
                data={data}
                csvOnclick={() => { }}
            />

            <Table
                columns={columns}
                dataSource={data}
                loading={loading}
                rowKey="WarehouseID"
                pagination={{ pageSize: 5 }}
            />

            <WarehousesInsertModal
                open={insertModal}
                setOpen={setInsertModal}
                setLoading={setLoading}
                setData={setData}
                refreshData={refreshData}
            />

            <WarehousesEditModal
                open={editModal.open}
                setOpen={(open) => setEditModal(prev => ({ ...prev, open }))}
                setLoading={setLoading}
                data={editModal.data}
                refreshData={refreshData}
            />

            <WarehousesDetailModal
                open={detailModal.open}
                onClose={() => setDetailModal({ open: false, data: null })}
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
