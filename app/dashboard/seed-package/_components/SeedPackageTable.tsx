"use client";

import Table from "@/app/dashboard/_components/UI/Table";
import InsertionRow from "@/app/dashboard/_components/UI/InsertionRow";
import TableActions from "@/app/dashboard/_components/UI/TableActions";
import DeleteModal from "@/app/dashboard/_components/UI/DeleteModal";
import QRCodeModal from "@/app/dashboard/_components/UI/QRCodeModal";
import SeedPackageInsUpModal from "./SeedPackageInsUpModal";
import SeedPackageDetailModal from "./SeedPackageDetailModal";
import SeedPackagePrintModal from "./SeedPackagePrintModal";
import { useState } from "react";
import Image from "next/image";
import { deleteSeedPackage } from "@/app/lib/services/seedPackage";
import { Button, Tooltip } from "antd";
import { InfoCircleOutlined } from "@ant-design/icons";
import QRCodeCanvas from "@/app/components/UI/QRCodeCanvas";

interface SeedPackageTableProps {
    data: any[];
    loading: boolean;
    setLoading: (loading: boolean) => void;
    setData: (data: any[]) => void;
}

export default function SeedPackageTable({ data, loading, setLoading, setData }: SeedPackageTableProps) {
    const [deleteModal, setDeleteModal] = useState<any>(null);
    const [qrModal, setQrModal] = useState<{ open: boolean, code: string | null, id: number | null }>({ open: false, code: null, id: null });
    const [insUpModal, setInsUpModal] = useState<{ open: boolean, data: any | null }>({ open: false, data: null });
    const [detailModal, setDetailModal] = useState<{ open: boolean, data: any | null }>({ open: false, data: null });
    const [printModal, setPrintModal] = useState<{ open: boolean, data: any | null }>({ open: false, data: null });

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
        {
            title: "QR Code",
            key: "QRCode",
            render: (_: any, record: any) => (
                <div
                    className="cursor-pointer hover:opacity-80 transition-opacity border rounded-md p-1 bg-white w-fit"
                    onClick={() => setQrModal({ open: true, code: record.QRCode, id: record.ID })}
                >
                    {record.ID ? (
                        <QRCodeCanvas value={`https://mygreenhouses.ir/public/scan/seed-package/${record.ID}`} size={40} />
                    ) : (
                        <div className="w-10 h-10 bg-slate-100 flex items-center justify-center text-xs text-slate-400">N/A</div>
                    )}
                </div>
            )
        },
        { title: "سریال", dataIndex: "SerialNumber", key: "SerialNumber" },
        { title: "تولید کننده", dataIndex: "ProducerName", key: "ProducerName" },
        { title: "گونه", dataIndex: "VarietyName", key: "VarietyName" },
        { title: "تعداد", dataIndex: "SeedCount", key: "SeedCount", render: (val: any) => val ? val : "—" },
        { title: "وزن (g)", dataIndex: "WeightGram", key: "WeightGram", render: (val: any) => val ? val : "—" },
        {
            title: "تاریخ تولید",
            key: "ProductionDate",
            render: (_: any, record: any) => record.ProductionDate ? new Date(record.ProductionDate).toLocaleDateString('fa-IR') : "—"
        },
        {
            title: "عملیات",
            key: "actions",
            render: (_: any, record: any) => (
                <TableActions
                    onDelete={() => setDeleteModal({ open: true, id: record.ID, name: record.SerialNumber })}
                    onEdit={() => setInsUpModal({ open: true, data: record })}
                    onPrint={() => setPrintModal({ open: true, data: record })}
                />
            )
        }
    ];

    const handleDelete = async (id: number) => {
        setLoading(true);
        await deleteSeedPackage(id);
        setDeleteModal(null);
        window.location.reload();
    };

    const qrLink = qrModal.id ? `https://mygreenhouses.ir/public/scan/seed-package/${qrModal.id}` : "#";

    return (
        <div className="w-full">
            <InsertionRow
                text="بسته جدید"
                insertOnclick={() => setInsUpModal({ open: true, data: null })}
                data={data}
                csvOnclick={() => { }}
            />

            <Table
                columns={columns}
                dataSource={data}
                loading={loading}
                rowKey="ID"
                pagination={{ pageSize: 5 }}
            />

            <SeedPackageInsUpModal
                open={insUpModal.open}
                setOpen={(open) => setInsUpModal(prev => ({ ...prev, open }))}
                setLoading={setLoading}
                data={insUpModal.data}
                refreshData={() => window.location.reload()}
            />

            <SeedPackageDetailModal
                open={detailModal.open}
                onClose={() => setDetailModal({ open: false, data: null })}
                data={detailModal.data}
            />

            <SeedPackagePrintModal
                open={printModal.open}
                setOpen={(open) => setPrintModal(prev => ({ ...prev, open }))}
                data={printModal.data}
            />

            <DeleteModal
                open={deleteModal?.open || false}
                onClose={() => setDeleteModal(null)}
                id={deleteModal?.id}
                name={deleteModal?.name}
                onDelete={handleDelete}
                deleteLoading={loading}
            />

            <QRCodeModal
                visible={qrModal.open}
                onClose={() => setQrModal({ ...qrModal, open: false })}
                url={qrLink}
                title="شناسنامه دیجیتال بذر"
                serial={data.find(d => d.ID === qrModal.id)?.SerialNumber}
            />
        </div>
    );
}
