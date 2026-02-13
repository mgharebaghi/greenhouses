"use client";

import Table from "@/shared/components/Table";
import InsertionRow from "@/shared/components/InsertionRow";
import TableActions from "@/shared/components/TableActions";
import DeleteModal from "@/shared/components/DeleteModal";
import { useState } from "react";
import dayjs from "dayjs";
import jalaliday from "jalaliday";
import { useRouter } from "next/navigation";
import { deleteSeedWarehousing } from "@/features/seedWarehousing/services";
import SeedWarehousingFormModal from "./SeedWarehousingFormModal";
import SeedWarehousingDetailModal from "./SeedWarehousingDetailModal";
import { InfoCircleOutlined } from "@ant-design/icons";
import { Button, Tooltip, Tag, message } from "antd";
import { generateCsv, download, mkConfig } from "export-to-csv";
import { seedWarehousingCSVData, headers } from "../data/csvFileData";

dayjs.extend(jalaliday);

interface Props {
    data: any[];
    seedPackages: any[];
    warehouses: any[];
}

export default function SeedWarehousingTable({
    data,
    seedPackages,
    warehouses,
}: Props) {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [formModal, setFormModal] = useState<{ open: boolean; data: any | null }>({
        open: false,
        data: null,
    });
    const [detailModal, setDetailModal] = useState<{ open: boolean; data: any }>({
        open: false,
        data: null,
    });
    const [deleteModal, setDeleteModal] = useState<{ open: boolean; id: number; name: string } | null>(null);

    const handleDelete = async (id: number) => {
        setLoading(true);
        try {
            const result = await deleteSeedWarehousing(id);
            if (result.success) {
                message.success("تراکنش با موفقیت حذف شد");
                setDeleteModal(null);
                router.refresh();
            } else {
                message.error(result.error);
            }
        } catch (error) {
            console.error("Delete failed:", error);
        } finally {
            setLoading(false);
        }
    };

    const refreshData = () => {
        router.refresh();
    };

    const columns = [
        {
            title: "جزئیات",
            key: "details",
            width: 80,
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
            title: "شماره تراکنش",
            dataIndex: "ID",
            key: "ID",
        },
        {
            title: "نوع",
            dataIndex: "TransactionType",
            key: "TransactionType",
            render: (val: boolean) => (
                <Tag color={val ? "green" : "red"}>{val ? "ورودی" : "خروجی"}</Tag>
            ),
        },
        {
            title: "تعداد",
            dataIndex: "PackageQuantity",
            key: "PackageQuantity",
        },
        {
            title: "بسته بذر",
            key: "SeedPackage",
            width: 150,
            render: (_: any, record: any) => (
                <span>{record.Tbl_SeedPackage?.SerialNumber} <span className="text-xs text-slate-400">({record.Tbl_SeedPackage?.PackageType})</span></span>
            )
        },
        {
            title: "انبار",
            key: "Warehouse",
            width: 150,
            render: (_: any, record: any) => record.Tbl_Warehouses?.WarehouseName || "-"
        },
        {
            title: "تاریخ",
            dataIndex: "TransactionDate",
            key: "TransactionDate",
            render: (date: any) =>
                date ? dayjs(date).calendar("jalali").format("YYYY/MM/DD") : "-",
        },
        {
            title: "عملیات",
            key: "actions",
            render: (_: any, record: any) => (
                <TableActions
                    onEdit={() => setFormModal({ open: true, data: record })}
                    onDelete={() => setDeleteModal({ open: true, id: record.ID, name: `تراکنش ${record.ID}` })}
                />
            ),
        },
    ];

    return (
        <div className="w-full">
            <InsertionRow
                text="وردی یا خروجی"
                insertOnclick={() => setFormModal({ open: true, data: null })}
                data={data}
                csvOnclick={async () => {
                    const csvData = await seedWarehousingCSVData(data);
                    const options = mkConfig({ useKeysAsHeaders: false, columnHeaders: headers, filename: "seed-warehousing" });
                    const csv = generateCsv(options)(csvData);
                    download(options)(csv);
                }}
            />

            <Table
                dataSource={data}
                columns={columns}
                rowKey="ID"
                loading={loading}
                pagination={{ pageSize: 10 }}
            />

            <SeedWarehousingFormModal
                open={formModal.open}
                onCancel={() => setFormModal({ open: false, data: null })}
                data={formModal.data}
                seedPackages={seedPackages}
                warehouses={warehouses}
                onSuccess={refreshData}
            />

            <SeedWarehousingDetailModal
                open={detailModal.open}
                onCancel={() => setDetailModal({ open: false, data: null })}
                data={detailModal.data}
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
