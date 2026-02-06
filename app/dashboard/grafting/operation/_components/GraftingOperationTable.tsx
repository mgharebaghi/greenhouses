"use client";

import Table from "@/app/dashboard/_components/UI/Table";
import InsertionRow from "@/app/dashboard/_components/UI/InsertionRow";
import TableActions from "@/app/dashboard/_components/UI/TableActions";
import DeleteModal from "@/app/dashboard/_components/UI/DeleteModal";
import { useState } from "react";
import { deleteGraftingOperation } from "@/app/lib/services/grafting/operation/delete";
import GraftingOperationInsertModal from "./GraftingOperationInsertModal";
import GraftingOperationEditModal from "./GraftingOperationEditModal";
import GraftingOperationDetailsModal from "./GraftingOperationDetailsModal";
import { Tag, Button, Tooltip, Progress } from "antd";
import { InfoCircleOutlined } from "@ant-design/icons";

interface GraftingOperationTableProps {
    data: any[];
    loading: boolean;
    setLoading: (loading: boolean) => void;
    refreshData: () => void;
    options: {
        seeds: { label: string, value: number }[];
        rootstocks: { label: string, value: number }[];
    };
}

export default function GraftingOperationTable({
    data,
    loading,
    setLoading,
    refreshData,
    options
}: GraftingOperationTableProps) {
    const [deleteModal, setDeleteModal] = useState<any>(null);
    const [insertModal, setInsertModal] = useState(false);
    const [editModal, setEditModal] = useState<{ open: boolean, data: any | null }>({ open: false, data: null });
    const [detailsModal, setDetailsModal] = useState<{ open: boolean, data: any | null }>({ open: false, data: null });

    const [deleteError, setDeleteError] = useState<string>("");

    const methodMap: Record<string, string> = {
        'Hole Insertion': 'پیوند حفره‌ای',
        'Tongue Approach': 'پیوند نیم‌نیم',
        'Splice': 'پیوند اسپلایس',
        'Other': 'سایر'
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
            dataIndex: "GraftingID",
            key: "GraftingID",
            width: 80,
        },
        {
            title: "نشاء",
            key: "Scion",
            render: (_: any, record: any) => (
                <div className="flex flex-col">
                    <span className="font-medium text-xs">#{record.NurserySeedID}</span>
                    <span className="text-xs text-gray-500">{record.NurserySeed?.SeedPackage?.SeedBatch?.PlantVarities?.VarietyName}</span>
                </div>
            )
        },
        {
            title: "پایه",
            key: "Rootstock",
            render: (_: any, record: any) => (
                <div className="flex flex-col">
                    <span className="font-medium text-xs">#{record.RootstockID}</span>
                    <span className="text-xs text-gray-500">{record.RootStockPlant?.PlantVarities?.VarietyName}</span>
                </div>
            )
        },
        {
            title: "روش پیوند",
            dataIndex: "GraftingMethod",
            key: "GraftingMethod",
            render: (text: string) => methodMap[text] || text
        },
        {
            title: "تعداد",
            dataIndex: "GraftedNumber",
            key: "GraftedNumber",
            width: 70,
        },
        {
            title: "موفق",
            dataIndex: "SucceedGrafted",
            key: "SucceedGrafted",
            width: 70,
        },
        {
            title: "نرخ موفقیت",
            dataIndex: "SuccessRate",
            key: "SuccessRate",
            render: (rate: any) => rate ? (
                <div className="w-[100px]">
                    <Progress percent={rate} size="small" status={rate >= 70 ? 'success' : (rate < 40 ? 'exception' : 'active')} />
                </div>
            ) : '-'
        },
        {
            title: "عملیات",
            key: "actions",
            render: (_: any, record: any) => (
                <TableActions
                    onDelete={() => setDeleteModal({ open: true, id: record.GraftingID, name: `پیوند #${record.GraftingID}` })}
                    onEdit={() => setEditModal({ open: true, data: record })}
                />
            )
        }
    ];

    const handleDelete = async (id: number) => {
        setLoading(true);
        setDeleteError("");
        try {
            const result = await deleteGraftingOperation(id);
            if (result.success) {
                setDeleteModal(null);
                refreshData();
            } else {
                setDeleteError(result.error || "خطا در حذف اطلاعات");
            }
        } catch (error) {
            setDeleteError("خطا در برقراری ارتباط با سرور");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="w-full">
            <InsertionRow
                text="پیوند"
                insertOnclick={() => setInsertModal(true)}
                data={data}
                csvOnclick={() => { }}
            />

            <Table
                columns={columns}
                dataSource={data}
                loading={loading}
                rowKey="GraftingID"
                pagination={{ pageSize: 10 }}
            />

            <GraftingOperationInsertModal
                open={insertModal}
                setOpen={setInsertModal}
                setLoading={setLoading}
                refreshData={refreshData}
                options={options}
            />

            <GraftingOperationEditModal
                open={editModal.open}
                setOpen={(open) => setEditModal(prev => ({ ...prev, open }))}
                setLoading={setLoading}
                data={editModal.data}
                refreshData={refreshData}
                options={options}
            />

            <GraftingOperationDetailsModal
                open={detailsModal.open}
                setOpen={(open) => setDetailsModal(prev => ({ ...prev, open }))}
                data={detailsModal.data}
            />

            <DeleteModal
                open={deleteModal?.open || false}
                onClose={() => {
                    setDeleteModal(null);
                    setDeleteError("");
                }}
                id={deleteModal?.id}
                name={deleteModal?.name}
                onDelete={handleDelete}
                deleteLoading={loading}
                msg={deleteError}
                setMsg={setDeleteError}
            />
        </div>
    );
}
