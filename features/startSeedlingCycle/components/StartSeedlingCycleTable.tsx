"use client";

import { useState } from "react";
import Table from "@/shared/components/Table";
import { StartSeedlingCycle } from "../types";
import { Button, Tooltip } from "antd";
import StartSeedlingCycleFormModal from "./StartSeedlingCycleFormModal";
import StartSeedlingCycleDetailModal from "./StartSeedlingCycleDetailModal";
import { EyeOutlined } from "@ant-design/icons";
import { deleteStartSeedlingCycle } from "../services/delete";
import { useRouter } from "next/navigation";
import InsertionRow from "@/shared/components/InsertionRow";
import TableActions from "@/shared/components/TableActions";
import DeleteModal, { DeleteModalProps } from "@/shared/components/DeleteModal";
import { generateCsv, download, mkConfig } from "export-to-csv";
import { startSeedlingCycleCSVData, headers } from "../data/csvFileData";

interface Props {
    data: StartSeedlingCycle[];
    orders: any[];
    greenhouses: any[];
}

export default function StartSeedlingCycleTable({ data, orders, greenhouses }: Props) {
    const router = useRouter();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingRecord, setEditingRecord] = useState<StartSeedlingCycle | null>(null);

    // Delete Modal State
    const [deleteModalOpen, setDeleteModalOpen] = useState<DeleteModalProps | null>(null);
    const [deleteModalLoading, setDeleteModalLoading] = useState(false);
    const [deleteModalMsg, setDeleteModalMsg] = useState("");

    const handleDelete = async (id: number) => {
        setDeleteModalLoading(true);
        setDeleteModalMsg("");
        const res = await deleteStartSeedlingCycle(id);
        if (res.status === "ok") {
            setDeleteModalLoading(false);
            setDeleteModalOpen(null);
            router.refresh(); // Refresh server data
        } else {
            setDeleteModalLoading(false);
            setDeleteModalMsg(res.message);
        }
    };
    const [detailOpen, setDetailOpen] = useState(false);
    const [detailRecord, setDetailRecord] = useState<StartSeedlingCycle | null>(null);

    // ... (keep existing delete modal state)

    const columns = [
        {
            title: "جزئیات",
            key: "details",
            width: 80,
            align: "center" as const,
            render: (_: any, record: StartSeedlingCycle) => (
                <Tooltip title="مشاهده جزئیات">
                    <Button
                        icon={<EyeOutlined />}
                        shape="circle"
                        type="text"
                        onClick={() => {
                            setDetailRecord(record);
                            setDetailOpen(true);
                        }}
                        className="text-blue-500 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20"
                    />
                </Tooltip>
            ),
        },
        {
            title: "شناسه",
            dataIndex: "ID",
            key: "ID",
            width: 70,
            sortable: true,
        },
        {
            title: "کد سفارش",
            key: "OrderCode",
            render: (_: any, record: StartSeedlingCycle) => <span className="font-semibold text-slate-700 dark:text-slate-200">{record.Tbl_Orders?.OrderCode}</span>,
            searchable: true,
        },
        {
            title: "نوع بذر",
            dataIndex: "SeedType",
            key: "SeedType",
            render: (val: boolean | null) => (
                <span className={`px-2 py-0.5 rounded text-xs font-medium ${val === true ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400" : (val === false ? "bg-cyan-100 text-cyan-700 dark:bg-cyan-900/30 dark:text-cyan-400" : "bg-slate-100 text-slate-600")}`}>
                    {val === true ? "پیوندک" : (val === false ? "پایه" : "---")}
                </span>
            ),
        },
        {
            title: "نام گلخانه",
            key: "GreenhouseName",
            render: (_: any, record: StartSeedlingCycle) => record.Tbl_Greenhouses?.GreenhouseName,
        },
        {
            title: "نام سالن",
            dataIndex: "SalonName",
            key: "SalonName",
            render: (val: string) => val || "---",
        },
        {
            title: "تعداد سینی",
            dataIndex: "NumberOfTrays",
            key: "NumberOfTrays",
            render: (val: number) => val ? val.toLocaleString() : "---",
        },
        {
            title: "تاریخ ورود به گلخانه",
            dataIndex: "GreenhouseEntryDate",
            key: "GreenhouseEntryDate",
            render: (val: Date) => val ? new Date(val).toLocaleDateString('fa-IR') : "---",
        },
        {
            title: "عملیات",
            key: "action",
            width: 120,
            align: "center" as const,
            render: (_: any, record: StartSeedlingCycle) => (
                <TableActions
                    onEdit={() => {
                        setEditingRecord(record);
                        setIsModalOpen(true);
                    }}
                    onDelete={() =>
                        setDeleteModalOpen({
                            open: true,
                            onClose: () => setDeleteModalOpen(null),
                            id: record.ID,
                            name: `رکورد ${record.ID}`,
                            deleteLoading: deleteModalLoading,
                            onDelete: () => handleDelete(record.ID),
                            msg: deleteModalMsg,
                        })
                    }
                />
            ),
        },
    ];

    return (
        <div className="space-y-4">
            {/* ... (keep existing InsertionRow) */}
            <InsertionRow
                text="سیکل جدید"
                insertOnclick={() => {
                    setEditingRecord(null);
                    setIsModalOpen(true);
                }}
                csvOnclick={async () => {
                    const csvData = await startSeedlingCycleCSVData(data);
                    const options = mkConfig({ useKeysAsHeaders: false, columnHeaders: headers, filename: "start-seedling-cycle" });
                    const csv = generateCsv(options)(csvData);
                    download(options)(csv);
                }}
                data={data}
            />

            <Table
                columns={columns}
                dataSource={data}
                rowKey="ID"
                pagination={{ pageSize: 10 }}
            />

            <StartSeedlingCycleFormModal
                open={isModalOpen}
                onCancel={() => setIsModalOpen(false)}
                onSuccess={() => {
                    setIsModalOpen(false);
                    router.refresh(); // Refresh server data
                }}
                orders={orders}
                greenhouses={greenhouses}
                record={editingRecord}
            />

            <StartSeedlingCycleDetailModal
                open={detailOpen}
                onCancel={() => setDetailOpen(false)}
                record={detailRecord}
            />

            <DeleteModal
                open={deleteModalOpen?.open || false}
                onClose={() => setDeleteModalOpen(null)}
                id={deleteModalOpen?.id}
                name={deleteModalOpen?.name}
                deleteLoading={deleteModalLoading}
                onDelete={deleteModalOpen?.onDelete}
                msg={deleteModalMsg}
            />
        </div>
    );
}
