"use client";
import PlusOutlined from "@ant-design/icons/PlusOutlined";
import { Button, Col, Row } from "antd";
import { useState } from "react";
import GreenHousesTable from "./GreenHousesTable";
import { Greenhouses as GreenHouse } from "@/app/generated/prisma/client";
import GreenHouseDeleteModal, { deleteModalType } from "./GreenHouseDeleteModal";
import GreenHouseInsertModal from "./GreenHouseInsrtModal";
import GreenHouseEditModal, { EditModalProps } from "./GreenHouseEditModal";
import GlassMorphButton from "../../_components/tools/GlassMorphButton";

export type ModalMsg = {
  status: "ok" | "error";
  message: string;
};

export default function GreenHouses({ initialData }: { initialData?: GreenHouse[] }) {
  const [loading, setLoading] = useState(false);
  const [insertModal, setInsertModal] = useState(false);
  const [data, setData] = useState<GreenHouse[]>(initialData || []);
  const [deleteModal, setDeleteModal] = useState<deleteModalType>({
    isOpen: false,
  });
  const [editModal, setEditModal] = useState<EditModalProps>({ isOpen: false });

  const openInsertModal = () => {
    setInsertModal(true);
  };

  // Delete greenhouse (dummy function)
  const openDeleteModal = (record: GreenHouse) => {
    setDeleteModal({ isOpen: true, data: record });
  };

  // Edit greenhouse (dummy function)
  const openEditModal = (record: GreenHouse) => {
    setEditModal({ isOpen: true, data: record });
  };

  return (
    <div className="w-full p-4 overflow-hidden">
      <Row gutter={[16, 16]}>
        <Col span={24}>
          <Button type="primary" onClick={openInsertModal}>
            افزودن گلخانه <PlusOutlined />
          </Button>
        </Col>
        <Col span={24}>
          <GreenHousesTable data={data} loading={loading} handleEdit={openEditModal} handleDelete={openDeleteModal} />
        </Col>
      </Row>

      <GreenHouseInsertModal
        modalOpen={insertModal}
        setModalOpen={setInsertModal}
        setMainLoading={setLoading}
        setMainData={setData}
      />

      <GreenHouseEditModal
        isOpen={editModal.isOpen}
        onClose={() => setEditModal({ isOpen: false })}
        data={editModal.data}
        setMainLoading={setLoading}
        setMainData={setData}
      />

      <GreenHouseDeleteModal
        isOpen={deleteModal.isOpen}
        onClose={() => setDeleteModal({ isOpen: false })}
        data={deleteModal.data}
        setMainLoading={setLoading}
        setMainData={setData}
      />
    </div>
  );
}
