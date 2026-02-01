"use client";

import Table from "@/app/dashboard/_components/UI/Table";
import InsertionRow from "@/app/dashboard/_components/UI/InsertionRow";
import TableActions from "@/app/dashboard/_components/UI/TableActions";
import DeleteModal from "@/app/dashboard/_components/UI/DeleteModal";
import { useState } from "react";
import dayjs from "dayjs";
import jalaliday from "jalaliday";
import { useRouter } from "next/navigation";
import { deleteSeedWarehousing } from "@/app/lib/services/seedWarehousing";
import SeedWarehousingEditModal from "./SeedWarehousingEditModal";
import SeedWarehousingAddModal from "./SeedWarehousingAddModal";
import SeedWarehousingDetailModal from "./SeedWarehousingDetailModal";
import { InfoCircleOutlined } from "@ant-design/icons";
import { Button, Tooltip, Tag, message } from "antd";

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
    const [editModal, setEditModal] = useState<{ open: boolean; data: any }>({
        open: false,
        data: null,
    });
    const [addModalOpen, setAddModalOpen] = useState(false);
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
            dataIndex: "TransactionID",
            key: "TransactionID",
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
                <span>{record.SeedPackage?.SerialNumber} <span className="text-xs text-slate-400">({record.SeedPackage?.PackageType})</span></span>
            )
        },
        {
            title: "انبار",
            key: "Warehouse",
            width: 150,
            render: (_: any, record: any) => record.Warehouses?.WarehouseName || "-"
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
                    onEdit={() => setEditModal({ open: true, data: record })}
                    onDelete={() => setDeleteModal({ open: true, id: record.TransactionID, name: `تراکنش ${record.TransactionID}` })}
                />
            ),
        },
    ];

    return (
        <div className="w-full">
            <InsertionRow
                text="وردی یا خروجی"
                insertOnclick={() => setAddModalOpen(true)}
                data={data}
                csvOnclick={() => { }}
            />

            <Table
                dataSource={data}
                columns={columns}
                rowKey="TransactionID"
                loading={loading}
                pagination={{ pageSize: 10 }}
            />

            <SeedWarehousingAddModal
                open={addModalOpen}
                onCancel={() => setAddModalOpen(false)}
                seedPackages={seedPackages}
                warehouses={warehouses}
                onSuccess={refreshData}
            />

            <SeedWarehousingEditModal
                open={editModal.open}
                onCancel={() => setEditModal({ open: false, data: null })}
                data={editModal.data}
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
