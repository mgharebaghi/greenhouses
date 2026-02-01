"use client";

import Table from "@/app/dashboard/_components/UI/Table";
import InsertionRow from "@/app/dashboard/_components/UI/InsertionRow";
import TableActions from "@/app/dashboard/_components/UI/TableActions";
import DeleteModal from "@/app/dashboard/_components/UI/DeleteModal";
import NurseryRoomsInsertModal from "./NurseryRoomsInsertModal";
import NurseryRoomsEditModal from "./NurseryRoomsEditModal";
import NurseryRoomsDetailModal from "./NurseryRoomsDetailModal";
import { useState } from "react";
import { deleteNurseryRoom } from "@/app/lib/services/nurseryRooms";
import { Button, Tooltip } from "antd";
import { InfoCircleOutlined } from "@ant-design/icons";

interface NurseryRoomsTableProps {
    data: any[];
    loading: boolean;
    setLoading: (loading: boolean) => void;
    setData: (data: any[]) => void;
    refreshData: () => void;
}

export default function NurseryRoomsTable({ data, loading, setLoading, setData, refreshData }: NurseryRoomsTableProps) {
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
        { title: "کد اتاق", dataIndex: "NurseryRoomCode", key: "NurseryRoomCode" },
        { title: "نام اتاق", dataIndex: "NurseryRoomName", key: "NurseryRoomName" },
        {
            title: "دما (C)",
            key: "Temperature",
            render: (_: any, record: any) => `${record.TemperatureMin || 0} - ${record.TemperatureMax || 0}`
        },
        {
            title: "رطوبت (%)",
            key: "Humidity",
            render: (_: any, record: any) => `${record.HumidityMin || 0} - ${record.HumidityMax || 0}`
        },
        { title: "نوع نور", dataIndex: "LightType", key: "LightType" },
        { title: "ساعات نوردهی", dataIndex: "LightHoursPerDay", key: "LightHoursPerDay" },
        {
            title: "عملیات",
            key: "actions",
            render: (_: any, record: any) => (
                <TableActions
                    onDelete={() => setDeleteModal({ open: true, id: record.NurseryRoomID, name: record.NurseryRoomName })}
                    onEdit={() => setEditModal({ open: true, data: record })}
                />
            )
        }
    ];

    const handleDelete = async (id: number) => {
        setLoading(true);
        await deleteNurseryRoom(id);
        setDeleteModal(null);
        refreshData();
    };

    return (
        <div className="w-full">
            <InsertionRow
                text="اتاق نشاء"
                insertOnclick={() => setInsertModal(true)}
                data={data}
                csvOnclick={() => { }}
            />

            <Table
                columns={columns}
                dataSource={data}
                loading={loading}
                rowKey="NurseryRoomID"
                pagination={{ pageSize: 5 }}
            />

            <NurseryRoomsInsertModal
                open={insertModal}
                setOpen={setInsertModal}
                setLoading={setLoading}
                setData={setData}
                refreshData={refreshData}
            />

            <NurseryRoomsEditModal
                open={editModal.open}
                setOpen={(open) => setEditModal(prev => ({ ...prev, open }))}
                setLoading={setLoading}
                data={editModal.data}
                refreshData={refreshData}
            />

            <NurseryRoomsDetailModal
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
