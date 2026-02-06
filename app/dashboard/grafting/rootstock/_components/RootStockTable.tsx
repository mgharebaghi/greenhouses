"use client";

import Table from "@/app/dashboard/_components/UI/Table";
import InsertionRow from "@/app/dashboard/_components/UI/InsertionRow";
import TableActions from "@/app/dashboard/_components/UI/TableActions";
import DeleteModal from "@/app/dashboard/_components/UI/DeleteModal";
import { useState } from "react";
import { deleteRootStockPlant } from "@/app/lib/services/grafting/rootstock/delete";
import RootStockInsertModal from "./RootStockInsertModal";
import RootStockEditModal from "./RootStockEditModal";
import RootStockDetailsModal from "./RootStockDetailsModal";
import { Tag, Button, Tooltip } from "antd";
import { InfoCircleOutlined } from "@ant-design/icons";

interface RootStockTableProps {
    data: any[];
    loading: boolean;
    setLoading: (loading: boolean) => void;
    refreshData: () => void;
    options: {
        varieties: { label: string, value: number }[];
        suppliers: { label: string, value: number }[];
    };
}


export default function RootStockTable({
    data,
    loading,
    setLoading,
    refreshData,
    options
}: RootStockTableProps) {
    const [deleteModal, setDeleteModal] = useState<any>(null);
    const [insertModal, setInsertModal] = useState(false);
    const [editModal, setEditModal] = useState<{ open: boolean, data: any | null }>({ open: false, data: null });
    const [detailsModal, setDetailsModal] = useState<{ open: boolean, data: any | null }>({ open: false, data: null });

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
            title: "گونه گیاهی",
            key: "PlantVariety",
            render: (_: any, record: any) => record.PlantVarities?.VarietyName || "-"
        },
        {
            title: "تامین کننده",
            key: "Supplier",
            render: (_: any, record: any) => {
                const s = record.Suppliers;
                if (!s) return "-";

                const companyName = s.CompanyName ? s.CompanyName.trim() : "";
                const fullName = `${s.FirstName || ''} ${s.LastName || ''}`.trim();

                const isValidCompany = companyName.length > 0 && companyName !== '-';

                return isValidCompany ? companyName : (fullName.length > 0 ? fullName : "-");
            }
        },
        {
            title: "بچ کد",
            dataIndex: "BatchCode",
            key: "BatchCode"
        },
        {
            title: "تاریخ تولید",
            dataIndex: "ProductionDate",
            key: "ProductionDate",
            render: (date: any) => date ? new Date(date).toLocaleDateString('fa-IR') : '-'
        },
        {
            title: "قطر ساقه (mm)",
            dataIndex: "StemDiameter",
            key: "StemDiameter"
        },
        {
            title: "مرحله رشد",
            dataIndex: "GrowthStage",
            key: "GrowthStage",
            render: (text: string) => {
                const map: Record<string, string> = {
                    'Seedling': 'نشاء',
                    'Growing': 'در حال رشد',
                    'ReadyToGraft': 'آماده پیوند'
                };
                return <Tag color="blue">{map[text] || text}</Tag>;
            }
        },
        {
            title: "وضعیت سلامت",
            dataIndex: "HealthStatus",
            key: "HealthStatus",
            render: (text: string) => {
                const map: Record<string, { text: string, color: string }> = {
                    'Healthy': { text: 'سالم', color: 'green' },
                    'Sick': { text: 'بیمار', color: 'red' },
                    'Recovering': { text: 'در حال بهبود', color: 'orange' }
                };
                const info = map[text] || { text: text, color: 'default' };
                return <Tag color={info.color}>{info.text}</Tag>;
            }
        },
        {
            title: "عملیات",
            key: "actions",
            render: (_: any, record: any) => (
                <TableActions
                    onDelete={() => setDeleteModal({ open: true, id: record.RootstockID, name: `${record.PlantVarities?.VarietyName} - ${record.BatchCode}` })}
                    onEdit={() => setEditModal({ open: true, data: record })}
                />
            )
        }
    ];

    const [deleteError, setDeleteError] = useState<string>("");

    const handleDelete = async (id: number) => {
        setLoading(true);
        setDeleteError(""); // Clear previous errors

        try {
            const result = await deleteRootStockPlant(id);

            if (result.success) {
                setDeleteModal(null);
                refreshData();
            } else {
                // Show error message in modal instead of closing
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
                text="گیاه پایه"
                insertOnclick={() => setInsertModal(true)}
                data={data}
                csvOnclick={() => { }}
            />

            <Table
                columns={columns}
                dataSource={data}
                loading={loading}
                rowKey="RootstockID"
                pagination={{ pageSize: 10 }}
            />

            <RootStockInsertModal
                open={insertModal}
                setOpen={setInsertModal}
                setLoading={setLoading}
                refreshData={refreshData}
                options={options}
            />

            <RootStockEditModal
                open={editModal.open}
                setOpen={(open: boolean) => setEditModal(prev => ({ ...prev, open }))}
                setLoading={setLoading}
                data={editModal.data}
                refreshData={refreshData}
                options={options}
            />

            <RootStockDetailsModal
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
