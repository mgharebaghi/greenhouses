"use client";

import { useState } from "react";
import { SeedBatch } from "@/app/generated/prisma/client";
import Table from "@/app/dashboard/_components/UI/Table";
import TableActions from "../../_components/UI/TableActions";
import DeleteModal, { DeleteModalProps } from "../../_components/UI/DeleteModal";
import { getAllSeedBatches, deleteSeedBatch } from "@/app/lib/services/seedBatch";
import SeedBatchInsertModal from "./SeedBatchInsertModal";
import InsertionRow from "../../_components/UI/InsertionRow";
import { generateCsv, download, mkConfig } from "export-to-csv";

// CSV Configuration
const csvConfig = mkConfig({ useKeysAsHeaders: true, filename: "seed-batches" });

export default function SeedBatchTable({
    data,
    loading,
    handleEdit,
    setMainLoading,
    setMainData,
}: {
    data: any[];
    loading: boolean;
    handleEdit: (record: any) => void;
    setMainLoading: (loading: boolean) => void;
    setMainData: (data: any[]) => void;
}) {
    const [deleteModal, setDeleteModal] = useState<DeleteModalProps | null>(null);
    const [deleteModalMsg, setDeleteModalMsg] = useState("");
    const [deleteModalLoading, setDeleteModalLoading] = useState(false);
    const [insertModal, setInsertModal] = useState(false);

    const openInsertModal = () => {
        setInsertModal(true);
    };

    const columns = [
        {
            title: "کد بذر",
            dataIndex: "BatchCode",
            key: "BatchCode",
            render: (text: any) => <span className="font-semibold">{text}</span>,
        },
        {
            title: "تولید کننده",
            key: "Producer",
            render: (_: any, record: any) => {
                if (!record.Suppliers) return "-";
                const s = record.Suppliers;
                const company = s.CompanyName ? s.CompanyName.toString().trim() : "";
                const first = s.FirstName ? s.FirstName.toString().trim() : "";
                const last = s.LastName ? s.LastName.toString().trim() : "";
                const fullName = `${first} ${last}`.trim();
                const isCompanyValid = company.length > 0 && company !== "-";
                return <span>{isCompanyValid ? company : (fullName.length > 0 ? fullName : "نامشخص")}</span>;
            },
        },
        {
            title: "گونه گیاهی",
            key: "Variety",
            render: (_: any, record: any) => (
                <span>{record.PlantVarities ? record.PlantVarities.VarietyName : "-"}</span>
            ),
        },
        {
            title: "نرخ جوانه زنی (%)",
            dataIndex: "GerminationRate",
            key: "GerminationRate",
            render: (text: any) => <span>{text ? `${text}%` : "-"}</span>,
        },
        {
            title: "درصد خلوص (%)",
            dataIndex: "PurityPercent",
            key: "PurityPercent",
            render: (text: any) => <span>{text ? `${text}%` : "-"}</span>,
        },
        {
            title: "تاریخ تولید",
            key: "ProductionDate",
            render: (_: any, record: any) => {
                return <span>{record.ProductionDate ? new Date(record.ProductionDate).toLocaleDateString('fa-IR') : "-"}</span>;
            },
        },
        {
            title: "درجه کیفی",
            dataIndex: "QualityGrade",
            key: "QualityGrade",
        },
        {
            title: "",
            key: "action",
            render: (_: any, record: any) => (
                <TableActions
                    onEdit={() => handleEdit(record)}
                    onDelete={() =>
                        setDeleteModal({
                            open: true,
                            onClose() {
                                setDeleteModal(null);
                                setDeleteModalMsg("");
                            },
                            deleteLoading: deleteModalLoading,
                            id: record.SeedBatchID,
                            name: `بذر ${record.BatchCode}` || "این مورد",
                            onDelete() {
                                handleDelete(record.SeedBatchID);
                            },
                            msg: deleteModalMsg,
                        })
                    }
                />
            ),
        },
    ];

    const handleDelete = async (id: number) => {
        setDeleteModalLoading(true);
        const res: any = await deleteSeedBatch(id);
        setDeleteModalLoading(false);
        if (res.status === "error") {
            setDeleteModalMsg(res.message || "خطایی رخ داده است.");
            return;
        }
        setDeleteModal(null);
        setMainLoading(true);
        const newData = await getAllSeedBatches();
        setMainData(newData);
        setMainLoading(false);
    };

    const handleExportCsv = async () => {
        // Flatten data for CSV
        const csvData = data.map(item => ({
            SeedBatchID: item.SeedBatchID,
            BatchCode: item.BatchCode,
            Producer: (() => {
                if (!item.Suppliers) return "";
                const s = item.Suppliers;
                const company = s.CompanyName ? s.CompanyName.toString().trim() : "";
                const first = s.FirstName ? s.FirstName.toString().trim() : "";
                const last = s.LastName ? s.LastName.toString().trim() : "";
                const fullName = `${first} ${last}`.trim();
                const isCompanyValid = company.length > 0 && company !== "-";
                return isCompanyValid ? company : (fullName.length > 0 ? fullName : "نامشخص");
            })(),
            Variety: item.PlantVarities?.VarietyName || "",
            GerminationRate: item.GerminationRate,
            PurityPercent: item.PurityPercent,
            ProductionDate: item.ProductionDate ? new Date(item.ProductionDate).toLocaleDateString('fa-IR') : "",
            ExpirationDate: item.ExpirationDate ? new Date(item.ExpirationDate).toLocaleDateString('fa-IR') : "",
            QualityGrade: item.QualityGrade,
            Notes: item.BatchNotes
        }));
        const csv = generateCsv(csvConfig)(csvData);
        download(csvConfig)(csv);
    }

    return (
        <div className="w-full">
            <InsertionRow
                text="بذر"
                insertOnclick={openInsertModal}
                csvOnclick={handleExportCsv}
                data={data}
            />
            <Table columns={columns} dataSource={data} loading={loading} rowKey="SeedBatchID" pagination={{ pageSize: 5 }} />

            <SeedBatchInsertModal
                modalOpen={insertModal}
                setModalOpen={setInsertModal}
                setMainLoading={setMainLoading}
                setMainData={setMainData}
            />

            <DeleteModal
                open={deleteModal?.open || false}
                onClose={() => setDeleteModal(null)}
                onDelete={deleteModal?.onDelete}
                name={deleteModal?.name}
                id={deleteModal?.id}
                msg={deleteModalMsg}
                deleteLoading={deleteModalLoading}
                setMsg={setDeleteModalMsg}
            />
        </div>
    );
}
