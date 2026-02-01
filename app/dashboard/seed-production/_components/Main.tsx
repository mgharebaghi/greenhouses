"use client";

import { Col, Row } from "antd";
import { useState } from "react";
import SeedBatchTable from "./SeedBatchTable";
import SeedBatchEditModal, { EditModalProps } from "./SeedBatchEditModal";
import { SeedBatch } from "@/app/generated/prisma/client";

export default function SeedBatches({ initialData }: { initialData?: any[] }) {
    const [loading, setLoading] = useState(false);
    const [data, setData] = useState<any[]>(initialData || []);
    const [editModal, setEditModal] = useState<EditModalProps>({ isOpen: false });

    const openEditModal = (record: any) => {
        setEditModal({ isOpen: true, data: record });
    };

    return (
        <div className="w-full p-4 overflow-hidden">
            <Row gutter={[16, 16]}>
                <Col span={24}>
                    <SeedBatchTable
                        data={data}
                        loading={loading}
                        handleEdit={openEditModal}
                        setMainLoading={setLoading}
                        setMainData={setData}
                    />
                </Col>
            </Row>

            <SeedBatchEditModal
                isOpen={editModal.isOpen}
                onClose={() => setEditModal({ isOpen: false })}
                data={editModal.data}
                setMainLoading={setLoading}
                setMainData={setData}
            />
        </div>
    );
}
