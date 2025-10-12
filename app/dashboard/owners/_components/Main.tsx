"use client";

import { Owner_Observer } from "@/app/generated/prisma";
import { useState } from "react";
import OwnersTable from "./OwnersTable";
import OwnersInsertModal from "./OwnerInsertModal";
import OwnersEditModal, { OwnerEditModalProps } from "./OwnerEditModal";

type OwnersDashboardProps = {
  initialData: Owner_Observer[];
};

export default function OwnersDashboard({ initialData }: OwnersDashboardProps) {
  const [data, setData] = useState<Owner_Observer[]>(initialData);
  const [loading, setLoading] = useState(false);
  const [insertModal, setInsertModal] = useState(false);
  const [editModal, setEditModal] = useState<OwnerEditModalProps>({ isOpen: false });

  const onEdit = (record: Owner_Observer) => {
    setEditModal({ isOpen: true, record });
  };

  // const onDelete = (record: Owner_Observer) => {
  //   setDeleteModal({ isOpen: true, record: record });
  // };

  return (
    <div className="w-full h-full">
      <div className="w-full p-4 flex justify-center items-center">
        <OwnersTable
          data={data}
          loading={loading}
          onEdit={onEdit}
          setInsertModal={setInsertModal}
          setData={setData}
          setLoading={setLoading}
        />
      </div>

      <OwnersInsertModal
        isOpen={insertModal}
        setIsOpen={setInsertModal}
        setMainData={setData}
        setMainLoading={setLoading}
      />

      {/* <OwnerDeleteModal
        isOpen={deleteModal.isOpen}
        setIsOpen={() => setDeleteModal({ isOpen: false })}
        record={deleteModal.record}
        setMainData={setData}
        setMainLoading={setLoading}
      /> */}

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
