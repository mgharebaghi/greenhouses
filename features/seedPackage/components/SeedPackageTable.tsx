"use client";

import Table from "@/shared/components/Table";
import InsertionRow from "@/shared/components/InsertionRow";
import TableActions from "@/shared/components/TableActions";
import DeleteModal from "@/shared/components/DeleteModal";
import SeedPackageInsUpModal from "./SeedPackageFormModal";
import SeedPackageDetailModal from "./SeedPackageDetailModal";
import SeedPackagePrintModal from "./SeedPackagePrintModal";
import { useState } from "react";
import { deleteSeedPackage, getAllSeedPackages } from "@/features/seedPackage/services";
import { Button, Tooltip } from "antd";
import { InfoCircleOutlined } from "@ant-design/icons";
import { generateCsv, download, mkConfig } from "export-to-csv";
import { seedPackageCSVData, headers } from "../data/csvFileData";

interface SeedPackageTableProps {
    data: any[];
    loading: boolean;
    setLoading: (loading: boolean) => void;
    setData: (data: any[]) => void;
}

export default function SeedPackageTable({ data, loading, setLoading, setData }: SeedPackageTableProps) {
    const [deleteModal, setDeleteModal] = useState<any>(null);
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
        { title: "شماره سریال بسته", dataIndex: "SerialNumber", key: "SerialNumber" },
        {
            title: "تامین کننده",
            key: "Supplier",
            render: (_: any, record: any) => {
                const s = record.Tbl_suppliers;
                if (!s) return record.ProducerCompany || "—";
                return s.Legal ? s.CompanyName : `${s.FirstName} ${s.LastName}`;
            }
        },
        {
            title: "گونه",
            key: "VarietyName",
            render: (_: any, record: any) => record.Tbl_plantVariety?.VarietyName || "—"
        },
        { title: "تعداد", dataIndex: "SeedCount", key: "SeedCount", render: (val: any) => val ? val.toLocaleString() : "—" },
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

    const refreshData = async () => {
        setLoading(true);
        const res = await getAllSeedPackages();
        setData(res);
        setLoading(false);
    };

    const handleDelete = async (id: number) => {
        setLoading(true);
        await deleteSeedPackage(id);
        setDeleteModal(null);
        await refreshData();
    };

    return (
        <div className="w-full">
            <InsertionRow
                text="بسته جدید"
                insertOnclick={() => setInsUpModal({ open: true, data: null })}
                data={data}
                csvOnclick={async () => {
                    const csvData = await seedPackageCSVData(data);
                    const options = mkConfig({ useKeysAsHeaders: false, columnHeaders: headers, filename: "seed-packages" });
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

            <SeedPackageInsUpModal
                open={insUpModal.open}
                setOpen={(open) => setInsUpModal(prev => ({ ...prev, open }))}
                setLoading={setLoading}
                data={insUpModal.data}
                refreshData={refreshData}
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
        </div>
    );
}
