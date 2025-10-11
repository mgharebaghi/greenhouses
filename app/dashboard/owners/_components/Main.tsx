"use client";

import { Owner_Observer } from "@/app/generated/prisma";
import { PlusOutlined } from "@ant-design/icons";
import { Button } from "antd";
import { useState } from "react";
import OwnersTable from "./OwnersTable";
import OwnersInsertModal from "./OwnerInsertModal";
import OwnerDeleteModal, { OwnerDeleteModalProps } from "./OwnerDeleteModal";
import OwnersEditModal, { OwnerEditModalProps } from "./OwnerEditModal";

type OwnersDashboardProps = {
  initialData: Owner_Observer[];
};

export default function OwnersDashboard({ initialData }: OwnersDashboardProps) {
  const [data, setData] = useState<Owner_Observer[]>(initialData);
  const [loading, setLoading] = useState(false);
  const [insertModal, setInsertModal] = useState(false);
  const [deleteModal, setDeleteModal] = useState<OwnerDeleteModalProps>({ isOpen: false });
  const [editModal, setEditModal] = useState<OwnerEditModalProps>({ isOpen: false });

  const onEdit = (record: Owner_Observer) => {
    setEditModal({ isOpen: true, record });
  };

  const onDelete = (record: Owner_Observer) => {
    setDeleteModal({ isOpen: true, record: record });
  };

  return (
    <div className="w-full h-full">
      <div className="w-full p-4">
        <Button type="primary" onClick={() => setInsertModal(true)} className="mb-4">
          افزودن شخص جدید
          <PlusOutlined />
        </Button>
      </div>
      <div className="w-ful p-4 flex justify-center items-center">
        <OwnersTable data={data} loading={loading} onEdit={onEdit} onDelete={onDelete} />
      </div>

      <OwnersInsertModal
        isOpen={insertModal}
        setIsOpen={setInsertModal}
        setMainData={setData}
        setMainLoading={setLoading}
      />

      <OwnerDeleteModal
        isOpen={deleteModal.isOpen}
        setIsOpen={() => setDeleteModal({ isOpen: false })}
        record={deleteModal.record}
        setMainData={setData}
        setMainLoading={setLoading}
      />

      <OwnersEditModal
        isOpen={editModal.isOpen}
        setIsOpen={() => setEditModal({ isOpen: false })}
        record={editModal.record}
        setMainData={setData}
        setMainLoading={setLoading}
      />
    </div>
  );
}
