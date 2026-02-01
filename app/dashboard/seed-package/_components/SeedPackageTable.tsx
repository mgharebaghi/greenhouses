"use client";

import Table from "@/app/dashboard/_components/UI/Table";
import InsertionRow from "@/app/dashboard/_components/UI/InsertionRow";
import TableActions from "@/app/dashboard/_components/UI/TableActions";
import DeleteModal from "@/app/dashboard/_components/UI/DeleteModal";
import QRCodeModal from "@/app/dashboard/_components/UI/QRCodeModal";
import SeedPackageInsertModal from "./SeedPackageInsertModal";
import SeedPackageEditModal from "./SeedPackageEditModal";
import SeedPackagePrintModal from "./SeedPackagePrintModal"; // Import Print Modal
import { useState, useEffect } from "react";
import Image from "next/image";
import { deleteSeedPackage } from "@/app/lib/services/seedPackage";

interface SeedPackageTableProps {
    data: any[];
    loading: boolean;
    setLoading: (loading: boolean) => void;
    setData: (data: any[]) => void;
}

export default function SeedPackageTable({ data, loading, setLoading, setData }: SeedPackageTableProps) {
    const [deleteModal, setDeleteModal] = useState<any>(null);
    const [qrModal, setQrModal] = useState<{ open: boolean, code: string | null, id: number | null }>({ open: false, code: null, id: null });
    const [insertModal, setInsertModal] = useState(false);
    const [editModal, setEditModal] = useState<{ open: boolean, data: any | null }>({ open: false, data: null });
    const [printModal, setPrintModal] = useState<{ open: boolean, data: any | null }>({ open: false, data: null }); // Print Modal State

    const columns = [
        {
            title: "QR Code",
            key: "QRCode",
            render: (_: any, record: any) => (
                <div
                    className="cursor-pointer hover:opacity-80 transition-opacity border rounded-md p-1 bg-white w-fit"
                    onClick={() => setQrModal({ open: true, code: record.QRCode, id: record.SeedPackageID })}
                >
                    {record.QRCode ? (
                        <Image src={record.QRCode} alt="QR" width={40} height={40} className="object-cover" />
                    ) : (
                        <div className="w-10 h-10 bg-slate-100 flex items-center justify-center text-xs text-slate-400">N/A</div>
                    )}
                </div>
            )
        },
        { title: "سریال", dataIndex: "SerialNumber", key: "SerialNumber" },
        { title: "نوع بسته", dataIndex: "PackageType", key: "PackageType" },
        {
            title: "بچ کد",
            key: "BatchCode",
            render: (_: any, record: any) => record.SeedBatch?.BatchCode || "-"
        },
        { title: "تعداد", dataIndex: "SeedCount", key: "SeedCount" },
        { title: "وزن (گرم)", dataIndex: "WeightGram", key: "WeightGram" },
        { title: "وضعیت", dataIndex: "Status", key: "Status" },
        {
            title: "عملیات",
            key: "actions",
            render: (_: any, record: any) => (
                <TableActions
                    onDelete={() => setDeleteModal({ open: true, id: record.SeedPackageID, name: record.SerialNumber })}
                    onEdit={() => setEditModal({ open: true, data: record })}
                    onPrint={() => setPrintModal({ open: true, data: record })} // Print Action
                />
            )
        }
    ];

    const handleDelete = async (id: number) => {
        setLoading(true);
        await deleteSeedPackage(id);
        setDeleteModal(null);
        window.location.reload(); // Simple reload to refresh data
    };

    const qrLink = qrModal.id ? `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/public/scan/seed-package/${qrModal.id}` : "#";

    return (
        <div className="w-full">
            <InsertionRow
                text="بسته جدید"
                insertOnclick={() => setInsertModal(true)}
                data={data}
                csvOnclick={() => { }}
            />

            <Table
                columns={columns}
                dataSource={data}
                loading={loading}
                rowKey="SeedPackageID"
                pagination={{ pageSize: 5 }}
            />

            <SeedPackageInsertModal
                open={insertModal}
                setOpen={setInsertModal}
                setLoading={setLoading}
                setData={setData}
            />

            <SeedPackageEditModal
                open={editModal.open}
                setOpen={(open) => setEditModal(prev => ({ ...prev, open }))}
                setLoading={setLoading}
                data={editModal.data}
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
                serial={data.find(d => d.SeedPackageID === qrModal.id)?.SerialNumber}
            />
        </div>
    );
}
