"use client";

import Table from "@/shared/components/Table";
import InsertionRow from "@/shared/components/InsertionRow";
import TableActions from "@/shared/components/TableActions";
import DeleteModal from "@/shared/components/DeleteModal";
import WarehousesInsUpModal from "./WarehousesFormModal";
import WarehousesDetailModal from "./WarehousesDetailModal";
import { useState } from "react";
import { deleteWarehouse } from "@/features/warehouses/services";
import { Button, Tooltip } from "antd";
import { InfoCircleOutlined } from "@ant-design/icons";
import { generateCsv, download, mkConfig } from "export-to-csv";
import { warehousesCSVData, headers } from "../data/csvFileData";

interface WarehousesTableProps {
    data: any[];
    loading: boolean;
    setLoading: (loading: boolean) => void;
    setData: (data: any[]) => void;
    refreshData: () => void;
}

export default function WarehousesTable({ data, loading, setLoading, setData, refreshData }: WarehousesTableProps) {
    const [deleteModal, setDeleteModal] = useState<any>(null);
    const [insUpModal, setInsUpModal] = useState<{ open: boolean, data: any | null }>({ open: false, data: null });
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
            title: "تاریخ تاسیس",
            key: "WarehouseCreatedAt",
            render: (_: any, record: any) => record.WarehouseCreatedAt ? new Date(record.WarehouseCreatedAt).toLocaleDateString('fa-IR') : "-"
        },
        {
            title: "مسئول انبار",
            dataIndex: "WarehouseManagerName",
            key: "WarehouseManagerName",
        },
        {
            title: "عملیات",
            key: "actions",
            render: (_: any, record: any) => (
                <TableActions
                    onDelete={() => setDeleteModal({ open: true, id: record.ID, name: record.WarehouseName })}
                    onEdit={() => setInsUpModal({ open: true, data: record })}
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
        <div className="w-full" >
            <InsertionRow
                text="انبار"
                insertOnclick={() => setInsUpModal({ open: true, data: null })}
                data={data}
                csvOnclick={async () => {
                    const csvData = await warehousesCSVData(data);
                    const options = mkConfig({ useKeysAsHeaders: false, columnHeaders: headers, filename: "warehouses" });
                    const csv = generateCsv(options)(csvData);
                    download(options)(csv);
                }}
            />

            <Table
                columns={columns}
                dataSource={data}
                loading={loading}
                rowKey="ID"
                pagination={{ pageSize: 5 }}
            />

            <WarehousesInsUpModal
                open={insUpModal.open}
                setOpen={(open) => setInsUpModal(prev => ({ ...prev, open }))}
                setLoading={setLoading}
                data={insUpModal.data}
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
        </div >
    );
}
