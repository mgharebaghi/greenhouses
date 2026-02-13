"use client";

import Table from "@/shared/components/Table";
import InsertionRow from "@/shared/components/InsertionRow";
import TableActions from "@/shared/components/TableActions";
import DeleteModal from "@/shared/components/DeleteModal";
import NurseryRoomsInsUpModal from "./NurseryRoomsFormModal";
import NurseryRoomsDetailModal from "./NurseryRoomsDetailModal";
import { useState } from "react";
import { deleteNurseryRoom } from "@/features/nurseryRooms/services";
import { Button, Tooltip } from "antd";
import { InfoCircleOutlined } from "@ant-design/icons";
import { generateCsv, download, mkConfig } from "export-to-csv";
import { nurseryRoomsCSVData, headers } from "../data/csvFileData";

interface NurseryRoomsTableProps {
    data: any[];
    loading: boolean;
    setLoading: (loading: boolean) => void;
    setData: (data: any[]) => void;
    refreshData: () => void;
}

export default function NurseryRoomsTable({ data, loading, setLoading, setData, refreshData }: NurseryRoomsTableProps) {
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
                    onDelete={() => setDeleteModal({ open: true, id: record.ID, name: record.NurseryRoomName })}
                    onEdit={() => setInsUpModal({ open: true, data: record })}
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
                text="اتاق ریکاوری"
                insertOnclick={() => setInsUpModal({ open: true, data: null })}
                data={data}
                csvOnclick={async () => {
                    const csvData = await nurseryRoomsCSVData(data);
                    const options = mkConfig({ useKeysAsHeaders: false, columnHeaders: headers, filename: "nursery-rooms" });
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

            <NurseryRoomsInsUpModal
                open={insUpModal.open}
                setOpen={(open) => setInsUpModal(prev => ({ ...prev, open }))}
                setLoading={setLoading}
                data={insUpModal.data}
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
