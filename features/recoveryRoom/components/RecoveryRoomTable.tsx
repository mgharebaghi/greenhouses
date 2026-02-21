"use client";

import Table from "@/shared/components/Table";
import InsertionRow from "@/shared/components/InsertionRow";
import TableActions from "@/shared/components/TableActions";
import DeleteModal from "@/shared/components/DeleteModal";
import RecoveryRoomFormModal from "./RecoveryRoomFormModal";
import RecoveryRoomDetailModal from "./RecoveryRoomDetailModal";
import { useState } from "react";
import { Button, Tooltip } from "antd";
import { EyeOutlined } from "@ant-design/icons";
import { deleteRecoveryRoom } from "@/features/recoveryRoom/services/delete";
import { RecoveryRoomListItem } from "../types";
import { generateCsv, download, mkConfig } from "export-to-csv";
import { recoveryRoomCSVData, headers } from "../data/csvFileData";

interface RecoveryRoomTableProps {
    data: RecoveryRoomListItem[];
    loading: boolean;
    setLoading: (loading: boolean) => void;
    setData: (data: RecoveryRoomListItem[]) => void;
    refreshData: () => void;
}

export default function RecoveryRoomTable({ data, loading, setLoading, setData, refreshData }: RecoveryRoomTableProps) {
    const [deleteModal, setDeleteModal] = useState<any>(null);
    const [formModal, setFormModal] = useState<{ open: boolean, data: RecoveryRoomListItem | null }>({ open: false, data: null });
    const [detailModal, setDetailModal] = useState<{ open: boolean, data: RecoveryRoomListItem | null }>({ open: false, data: null });

    const handleDelete = async (id: number) => {
        setLoading(true);
        await deleteRecoveryRoom(id);
        setDeleteModal(null);
        refreshData();
    };

    const columns = [
        {
            title: "جزئیات",
            key: "details",
            width: 80,
            align: "center" as const,
            render: (_: any, record: RecoveryRoomListItem) => (
                <Tooltip title="مشاهده جزئیات">
                    <Button
                        icon={<EyeOutlined />}
                        onClick={() => setDetailModal({ open: true, data: record })}
                    />
                </Tooltip>
            )
        },
        {
            title: "کد سفارش",
            key: "OrderCode",
            render: (_: any, record: RecoveryRoomListItem) => record.Tbl_GraftingOperation?.Tbl_Orders?.OrderCode || "—"
        },
        {
            title: "نام مشتری",
            key: "Customer",
            render: (_: any, record: RecoveryRoomListItem) => {
                const p = record.Tbl_GraftingOperation?.Tbl_Orders?.Tbl_People_Tbl_Orders_CustomerIDToTbl_People;
                return p ? `${p.FirstName} ${p.LastName}` : "—";
            }
        },
        {
            title: "تاریخ ورود",
            key: "RecoveryEntryDate",
            render: (_: any, record: RecoveryRoomListItem) => record.RecoveryEntryDate ? new Date(record.RecoveryEntryDate).toLocaleDateString("fa-IR") : "—"
        },
        {
            title: "تاریخ خروج",
            key: "RecoveryExitDate",
            render: (_: any, record: RecoveryRoomListItem) => record.RecoveryExitDate ? new Date(record.RecoveryExitDate).toLocaleDateString("fa-IR") : "—"
        },
        {
            title: "تلفات کل",
            key: "GraftedLossCount",
            dataIndex: "GraftedLossCount",
            render: (val: number | null) => val !== null ? val.toLocaleString() : "—"
        },
        {
            title: "عملیات",
            key: "actions",
            render: (_: any, record: RecoveryRoomListItem) => (
                <TableActions
                    onDelete={() => setDeleteModal({ open: true, id: record.ID, name: record.Tbl_GraftingOperation?.Tbl_Orders?.OrderCode || "سفارش" })}
                    onEdit={() => setFormModal({ open: true, data: record })}
                />
            )
        }
    ];

    return (
        <div className="w-full">
            <InsertionRow
                text="گیاه پیوند زده شده"
                insertOnclick={() => setFormModal({ open: true, data: null })}
                data={data}
                csvOnclick={async () => {
                    const csvData = await recoveryRoomCSVData(data);
                    const options = mkConfig({ useKeysAsHeaders: false, columnHeaders: headers, filename: "recovery-room" });
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

            {formModal.open && (
                <RecoveryRoomFormModal
                    open={formModal.open}
                    setOpen={(open: boolean) => setFormModal(prev => ({ ...prev, open }))}
                    setLoading={setLoading}
                    data={formModal.data}
                    refreshData={refreshData}
                />
            )}

            {detailModal.open && (
                <RecoveryRoomDetailModal
                    open={detailModal.open}
                    onClose={() => setDetailModal(prev => ({ ...prev, open: false }))}
                    data={detailModal.data}
                />
            )}

            {deleteModal?.open && (
                <DeleteModal
                    open={deleteModal.open}
                    onClose={() => setDeleteModal(null)}
                    id={deleteModal.id}
                    name={deleteModal.name}
                    onDelete={handleDelete}
                    deleteLoading={loading}
                />
            )}
        </div>
    );
}
