"use client";

import Table from "@/app/dashboard/_components/UI/Table";
import InsertionRow from "@/app/dashboard/_components/UI/InsertionRow";
import TableActions from "@/app/dashboard/_components/UI/TableActions";
import DeleteModal from "@/app/dashboard/_components/UI/DeleteModal";
import { useState } from "react";
import Image from "next/image";
import { deleteNurserySeed } from "@/app/lib/services/nursery/planting";
import NurseryPlantingInsertModal from "./NurseryPlantingInsertModal";
import NurseryPlantingEditModal from "./NurseryPlantingEditModal";
import NurseryPlantingDetailsModal from "./NurseryPlantingDetailsModal";
import { Tag, Typography, Button, Tooltip } from "antd";
import { InfoCircleOutlined } from "@ant-design/icons";

const { Text } = Typography;

interface NurseryPlantingTableProps {
    data: any[];
    loading: boolean;
    setLoading: (loading: boolean) => void;
    refreshData: () => void;
    seedPackages: any[];
    nurseryRooms: any[];
}

export default function NurseryPlantingTable({
    data,
    loading,
    setLoading,
    refreshData,
    seedPackages,
    nurseryRooms
}: NurseryPlantingTableProps) {
    const [deleteModal, setDeleteModal] = useState<any>(null);
    const [insertModal, setInsertModal] = useState(false);
    const [editModal, setEditModal] = useState<{ open: boolean, data: any | null }>({ open: false, data: null });
    const [detailsModal, setDetailsModal] = useState<{ open: boolean, data: any | null }>({ open: false, data: null });

    // Translation Maps
    const stageMap: Record<string, string> = {
        'Seedling': 'کاشت بذر',
        'Germination': 'جوانه‌زنی',
        'ReadyForGraft': 'آماده پیوند'
    };

    const healthMap: Record<string, { text: string, color: string }> = {
        'Healthy': { text: 'سالم', color: 'green' },
        'Sick': { text: 'بیمار', color: 'red' },
        'Recovering': { text: 'در حال بهبود', color: 'orange' }
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
                        type="text"
                        icon={<InfoCircleOutlined style={{ color: "#3b82f6", fontSize: "18px" }} />}
                        onClick={() => setDetailsModal({ open: true, data: record })}
                    />
                </Tooltip>
            ),
        },
        {
            title: "شناسه",
            dataIndex: "NurserySeedID",
            key: "NurserySeedID",
            width: 80,
        },
        {
            title: "بسته بذر",
            key: "SeedPackage",
            render: (_: any, record: any) => (
                <div className="flex flex-col">
                    <Text strong>{record.SeedPackage?.SerialNumber}</Text>
                    <Text type="secondary" className="text-xs">{record.SeedPackage?.SeedBatch?.PlantVarities?.VarietyName}</Text>
                </div>
            )
        },
        {
            title: "اتاق نشاء",
            key: "NurseryRoom",
            render: (_: any, record: any) => record.NurseryRoom?.NurseryRoomName
        },
        {
            title: "تاریخ کاشت",
            dataIndex: "PlantingDate",
            key: "PlantingDate",
            render: (date: any) => date ? new Date(date).toLocaleDateString('fa-IR') : '-'
        },
        {
            title: "مرحله",
            dataIndex: "CurrentStage",
            key: "CurrentStage",
            render: (text: string) => <Tag color="blue">{stageMap[text] || text}</Tag>
        },
        {
            title: "وضعیت سلامت",
            dataIndex: "HealthStatus",
            key: "HealthStatus",
            render: (text: string) => {
                const info = healthMap[text] || { text: text, color: 'default' };
                return (
                    <Tag color={info.color}>
                        {info.text}
                    </Tag>
                );
            }
        },
        {
            title: "عملیات",
            key: "actions",
            render: (_: any, record: any) => (
                <TableActions
                    onDelete={() => setDeleteModal({ open: true, id: record.NurserySeedID, name: `نشاء ${record.NurserySeedID}` })}
                    onEdit={() => setEditModal({ open: true, data: record })}
                />
            )
        }
    ];

    const handleDelete = async (id: number) => {
        setLoading(true);
        await deleteNurserySeed(id);
        setDeleteModal(null);
        refreshData();
        setLoading(false);
    };

    return (
        <div className="w-full">
            <InsertionRow
                text="نشاء "
                insertOnclick={() => setInsertModal(true)}
                data={data}
                csvOnclick={() => { }}
            />

            <Table
                columns={columns}
                dataSource={data}
                loading={loading}
                rowKey="NurserySeedID"
                pagination={{ pageSize: 10 }}
            />

            <NurseryPlantingInsertModal
                open={insertModal}
                setOpen={setInsertModal}
                setLoading={setLoading}
                refreshData={refreshData}
                seedPackages={seedPackages}
                nurseryRooms={nurseryRooms}
            />

            <NurseryPlantingEditModal
                open={editModal.open}
                setOpen={(open) => setEditModal(prev => ({ ...prev, open }))}
                setLoading={setLoading}
                data={editModal.data}
                refreshData={refreshData}
                seedPackages={seedPackages}
                nurseryRooms={nurseryRooms}
            />

            <NurseryPlantingDetailsModal
                open={detailsModal.open}
                setOpen={(open) => setDetailsModal(prev => ({ ...prev, open }))}
                data={detailsModal.data}
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
