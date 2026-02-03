"use client";

import Table from "@/app/dashboard/_components/UI/Table";
import InsertionRow from "@/app/dashboard/_components/UI/InsertionRow";
import TableActions from "@/app/dashboard/_components/UI/TableActions";
import DeleteModal from "@/app/dashboard/_components/UI/DeleteModal";
import { useState } from "react";
import { deleteCareLog } from "@/app/lib/services/nursery/monitoring/delete";
import NurseryMonitoringInsertModal from "./NurseryMonitoringInsertModal";
import NurseryMonitoringEditModal from "./NurseryMonitoringEditModal";
import { Tag, Typography, Button, Tooltip, Space } from "antd";
import { InfoCircleOutlined, MonitorOutlined } from "@ant-design/icons";

const { Text } = Typography;

interface NurseryMonitoringTableProps {
    data: any[];
    loading: boolean;
    setLoading: (loading: boolean) => void;
    refreshData: () => void;
    nurserySeeds: any[];
}

export default function NurseryMonitoringTable({
    data,
    loading,
    setLoading,
    refreshData,
    nurserySeeds
}: NurseryMonitoringTableProps) {
    const [deleteModal, setDeleteModal] = useState<any>(null);
    const [insertModal, setInsertModal] = useState(false);
    const [editModal, setEditModal] = useState<{ open: boolean, data: any | null }>({ open: false, data: null });

    // Translation Maps
    const careTypeMap: Record<string, { text: string, color: string }> = {
        'Watering': { text: 'آبیاری', color: 'blue' },
        'Fertilization': { text: 'کوددهی', color: 'green' },
        'PestControl': { text: 'آفت‌کشی', color: 'red' },
        'Pruning': { text: 'هرس', color: 'orange' },
        'Inspection': { text: 'بازرسی', color: 'purple' },
        'Other': { text: 'سایر', color: 'default' }
    };

    const columns = [
        {
            title: "شناسه",
            dataIndex: "CareLogID",
            key: "CareLogID",
            width: 70,
        },
        {
            title: "مشخصات نشاء (Nursery Seed)",
            key: "NurserySeed",
            width: 250,
            render: (_: any, record: any) => (
                <div className="flex flex-col">
                    <div className="flex items-center gap-2">
                        <Tag>{record.NurserySeed?.NurserySeedID}</Tag>
                        <Text strong>{record.NurserySeed?.SeedPackage?.SeedBatch?.PlantVarities?.VarietyName}</Text>
                    </div>
                    <span className="text-xs text-slate-500 mt-1">
                        سریال: {record.NurserySeed?.SeedPackage?.SerialNumber} | بچ: {record.NurserySeed?.SeedPackage?.SeedBatch?.BatchCode}
                    </span>
                </div>
            )
        },
        {
            title: "نوع عملیات",
            dataIndex: "CareType",
            key: "CareType",
            render: (text: string) => {
                const info = careTypeMap[text] || { text: text, color: 'default' };
                return <Tag color={info.color}>{info.text}</Tag>;
            }
        },
        {
            title: "تاریخ",
            dataIndex: "CareDate",
            key: "CareDate",
            render: (date: any) => date ? new Date(date).toLocaleDateString('fa-IR') : '-'
        },
        {
            title: "ناظر / مسئول",
            dataIndex: "SupervisorName",
            key: "SupervisorName",
            render: (text: any) => text || "—"
        },
        {
            title: "جزئیات محیطی",
            key: "Environment",
            render: (_: any, record: any) => (
                <div className="flex flex-col text-xs gap-1">
                    {record.RoomTemperature && <span>دما: {record.RoomTemperature}°C</span>}
                    {record.RoomHumidity && <span>رطوبت: {record.RoomHumidity}%</span>}
                    {!record.RoomTemperature && !record.RoomHumidity && <span className="text-slate-400">—</span>}
                </div>
            )
        },
        {
            title: "توضیحات",
            dataIndex: "CareNote",
            key: "CareNote",
            width: 200,
            ellipsis: true,
            render: (text: any) => <Tooltip title={text}><span className="truncate block max-w-[180px]">{text || "—"}</span></Tooltip>
        },
        {
            title: "عملیات",
            key: "actions",
            render: (_: any, record: any) => (
                <TableActions
                    onDelete={() => setDeleteModal({ open: true, id: record.CareLogID, name: `رکورد پایش ${record.CareLogID}` })}
                    onEdit={() => setEditModal({ open: true, data: record })}
                />
            )
        }
    ];

    const handleDelete = async (id: number) => {
        setLoading(true);
        await deleteCareLog(id);
        setDeleteModal(null);
        refreshData();
        setLoading(false);
    };

    return (
        <div className="w-full">
            <InsertionRow
                text="ثبت پایش جدید"
                insertOnclick={() => setInsertModal(true)}
                data={data}
                csvOnclick={() => { }}
            />

            <Table
                columns={columns}
                dataSource={data}
                loading={loading}
                rowKey="CareLogID"
                pagination={{ pageSize: 10 }}
            />

            <NurseryMonitoringInsertModal
                open={insertModal}
                setOpen={setInsertModal}
                setLoading={setLoading}
                refreshData={refreshData}
                nurserySeeds={nurserySeeds}
            />

            <NurseryMonitoringEditModal
                open={editModal.open}
                setOpen={(open) => setEditModal(prev => ({ ...prev, open }))}
                setLoading={setLoading}
                data={editModal.data}
                refreshData={refreshData}
                nurserySeeds={nurserySeeds}
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
