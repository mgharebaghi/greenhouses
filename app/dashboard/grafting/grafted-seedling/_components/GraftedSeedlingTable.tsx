"use client";

import { useState } from "react";
import { Button, Tag, Progress, notification } from "antd";
import Image from "next/image";
import { InfoCircleOutlined, QrcodeOutlined } from "@ant-design/icons";
import Table from "@/app/dashboard/_components/UI/Table";
import InsertionRow from "@/app/dashboard/_components/UI/InsertionRow";
import TableActions from "@/app/dashboard/_components/UI/TableActions";
import DeleteModal from "@/app/dashboard/_components/UI/DeleteModal";
import GraftedSeedlingDetailsModal from "./GraftedSeedlingDetailsModal";
import GraftedSeedlingInsertModal from "./GraftedSeedlingInsertModal";
import GraftedSeedlingEditModal from "./GraftedSeedlingEditModal";
import { deleteGraftedSeedling } from "@/app/lib/services/grafting/grafted-seedling/delete";
import GraftedSeedlingPrintModal from "./GraftedSeedlingPrintModal";
import QRCodeModal from "@/app/dashboard/_components/UI/QRCodeModal";
// Fixed imports
import dayjs from "dayjs";
import jalaliday from "jalaliday";

dayjs.extend(jalaliday);

interface GraftedSeedlingTableProps {
    data: any[];
    loading: boolean;
    setLoading: (loading: boolean) => void;
    refreshData: () => void;
    options: { label: string, value: number }[];
}

export default function GraftedSeedlingTable({
    data,
    loading,
    setLoading,
    refreshData,
    options
}: GraftedSeedlingTableProps) {
    // Modal States
    const [insertOpen, setInsertOpen] = useState(false);
    const [editModal, setEditModal] = useState<{ open: boolean, data: any | null }>({ open: false, data: null });
    const [detailsModal, setDetailsModal] = useState<{ open: boolean, data: any | null }>({ open: false, data: null });
    const [deleteModal, setDeleteModal] = useState<{ open: boolean, id: number | null, name: string }>({ open: false, id: null, name: "" });
    const [printModal, setPrintModal] = useState<{ open: boolean, data: any | null }>({ open: false, data: null });
    const [qrModal, setQrModal] = useState<{ open: boolean, url: string, title: string }>({ open: false, url: "", title: "" });

    const handleDelete = async (id: number) => {
        setLoading(true);
        try {
            const result = await deleteGraftedSeedling(id);
            if (result.status === 'success') {
                notification.success({ message: result.message });
                refreshData();
                setDeleteModal({ open: false, id: null, name: "" });
            } else {
                notification.error({ message: result.message });
            }
        } catch (error) {
            notification.error({ message: "خطا در حذف رکورد" });
        } finally {
            setLoading(false);
        }
    };

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
            width: 70,
            align: "center" as const,
            render: (_: any, record: any) => (
                <Button
                    type="text"
                    icon={<InfoCircleOutlined className="text-blue-500 text-lg" />}
                    onClick={() => setDetailsModal({ open: true, data: record })}
                />
            ),
        },
        {
            title: "شناسه",
            dataIndex: "GraftedPlantID",
            key: "GraftedPlantID",
            width: 80,
            sorter: (a: any, b: any) => a.GraftedPlantID - b.GraftedPlantID,
            render: (id: number) => <span className="font-semibold text-slate-700 dark:text-slate-300">#{id}</span>
        },
        {
            title: "والد (بذر)",
            key: "ParentInfo",
            width: 220,
            render: (_: any, record: any) => {
                // QR data is now pre-processed on server
                const src = record.GraftingOperation?.NurserySeed?.SeedPackage?.QRCode;
                const seedPackage = record.GraftingOperation?.NurserySeed?.SeedPackage;
                const variety = seedPackage?.SeedBatch?.PlantVarities?.VarietyName;
                const serial = seedPackage?.SerialNumber;

                const qrUrl = `https://mygreenhouses.ir/public/scan/seed-package/${record.GraftedPlantID}`;

                return (
                    <div className="flex items-center gap-3">
                        {src ? (
                            <div
                                className="relative group cursor-pointer"
                                onClick={() => setQrModal({ open: true, url: qrUrl, title: "شناسنامه دیجیتال نشاء" })}
                            >
                                <Image
                                    src={src}
                                    alt="QR"
                                    width={48}
                                    height={48}
                                    className="object-contain border border-slate-200 dark:border-slate-700 rounded-md p-0.5 bg-white shadow-sm group-hover:scale-110 transition-transform"
                                />
                                <div className="absolute -bottom-1 -right-1 bg-blue-500 text-white text-[10px] px-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                                    <QrcodeOutlined />
                                </div>
                            </div>
                        ) : (
                            <div className="w-12 h-12 flex items-center justify-center bg-slate-100 dark:bg-slate-800 rounded-md border border-dashed border-slate-300">
                                <span className="text-slate-400 text-xs">No QR</span>
                            </div>
                        )}
                        <div className="flex flex-col">
                            <span className="font-medium text-slate-800 dark:text-slate-200 text-sm">
                                {variety || "نامشخص"}
                            </span>
                            <span className="text-xs text-slate-500">
                                سریال والد: {serial || "---"}
                            </span>
                        </div>
                    </div>
                );
            }
        },
        {
            title: "پایه (Rootstock)",
            key: "RootstockName",
            render: (_: any, record: any) => {
                const variety = record.GraftingOperation?.RootStockPlant?.PlantVarities?.VarietyName;
                return <span className="text-slate-600 dark:text-slate-400">{variety || "—"}</span>;
            }
        },
        {
            title: "روش پیوند",
            key: "GraftingMethod",
            render: (_: any, record: any) => {
                const method = record.GraftingOperation?.GraftingMethod;
                return methodMap[method] || method || "—";
            }
        },
        {
            title: "اپراتور",
            key: "OperatorName",
            render: (_: any, record: any) => record.GraftingOperation?.OperatorName || "—"
        },
        {
            title: "تاریخ آماده‌سازی",
            key: "ReadyForSaleDate",
            dataIndex: "ReadyForSaleDate",
            render: (date: string) => date ? dayjs(date).calendar("jalali").format("YYYY/MM/DD") : "—"
        },
        {
            title: "تعداد",
            dataIndex: "GraftedNumber",
            key: "GraftedNumber",
            width: 80,
            render: (value: number) => <span className="text-slate-700 dark:text-slate-300 font-medium">{value}</span>
        },
        {
            title: "کیفیت",
            dataIndex: "QualityGrade",
            key: "QualityGrade",
            render: (grade: string) => {
                let color = 'default';
                if (grade === 'A' || grade === 'Excellent') color = 'success';
                if (grade === 'B' || grade === 'Good') color = 'processing';
                if (grade === 'C' || grade === 'Fair') color = 'warning';
                return grade ? <Tag color={color}>{grade}</Tag> : "—";
            }
        },
        {
            title: "نرخ بقا",
            dataIndex: "SurvivalRate",
            key: "SurvivalRate",
            width: 150,
            render: (rate: number | null) => (
                rate ? <Progress percent={rate} size="small" steps={5} strokeColor="#10b981" /> : "—"
            )
        },
        {
            title: "توضیحات",
            dataIndex: "GraftedPlantNotes",
            key: "GraftedPlantNotes",
            ellipsis: true,
            render: (text: string) => <span className="text-gray-500 text-xs">{text || "—"}</span>
        },
        {
            title: "عملیات",
            key: "actions",
            width: 160,
            render: (_: any, record: any) => (
                <TableActions
                    onEdit={() => setEditModal({ open: true, data: record })}
                    onDelete={() => setDeleteModal({ open: true, id: record.GraftedPlantID, name: `رکورد #${record.GraftedPlantID}` })}
                    onPrint={() => setPrintModal({ open: true, data: record })}
                />
            )
        }
    ];

    return (
        <div className="w-full space-y-4">
            <InsertionRow
                text="نشاء پیوندی"
                insertOnclick={() => setInsertOpen(true)}
                csvOnclick={() => { }}
                data={data}
            />

            <Table
                dataSource={data}
                columns={columns}
                loading={loading}
                rowKey="GraftedPlantID"
                pagination={{ pageSize: 10 }}
            />

            <GraftedSeedlingDetailsModal
                open={detailsModal.open}
                setOpen={(open) => setDetailsModal(prev => ({ ...prev, open }))}
                data={detailsModal.data}
            />

            <GraftedSeedlingInsertModal
                open={insertOpen}
                setOpen={setInsertOpen}
                refreshData={refreshData}
                options={options}
            />

            <GraftedSeedlingEditModal
                open={editModal.open}
                setOpen={(open) => setEditModal(prev => ({ ...prev, open }))}
                data={editModal.data}
                refreshData={refreshData}
                options={options}
            />

            <GraftedSeedlingPrintModal
                open={printModal.open}
                setOpen={(open) => setPrintModal(prev => ({ ...prev, open }))}
                data={printModal.data}
            />

            <QRCodeModal
                visible={qrModal.open}
                onClose={() => setQrModal({ ...qrModal, open: false })}
                url={qrModal.url}
                title={qrModal.title}
                serial={data.find(d => `https://mygreenhouses.ir/public/scan/grafted-seedling/${d.GraftedPlantID}` === qrModal.url)?.GraftedPlantID.toString()}
            />

            <DeleteModal
                open={deleteModal.open}
                onClose={() => setDeleteModal({ ...deleteModal, open: false })}
                onDelete={handleDelete}
                id={deleteModal.id || 0}
                name={deleteModal.name}
                deleteLoading={loading}
            />
        </div>
    );
}
