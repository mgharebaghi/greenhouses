"use client";
import { Col, Row } from "antd";
import { useState } from "react";
import GreenHousesTable from "./GreenHousesTable";
import { Greenhouses as GreenHouse } from "@/app/generated/prisma/client";
import GreenHouseEditModal, { EditModalProps } from "./GreenHouseEditModal";

export type ModalMsg = {
  status: "ok" | "error";
  message: string;
};

export default function GreenHouses({ initialData }: { initialData?: GreenHouse[] }) {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<GreenHouse[]>(initialData || []);
  const [editModal, setEditModal] = useState<EditModalProps>({ isOpen: false });

  // Edit greenhouse (dummy function)
  const openEditModal = (record: GreenHouse) => {
    setEditModal({ isOpen: true, data: record });
  };

  return (
    <div className="w-full p-4 overflow-hidden">
      <Row gutter={[16, 16]}>
        <Col span={24}>
          <GreenHousesTable
            data={data}
            loading={loading}
            handleEdit={openEditModal}
            setMainLoading={setLoading}
            setMainData={setData}
          />
        </Col>
      </Row>

      <GreenHouseEditModal
        isOpen={editModal.isOpen}
        onClose={() => setEditModal({ isOpen: false })}
        data={editModal.data}
        setMainLoading={setLoading}
        setMainData={setData}
      />
    </div>
  );
}
