"use client";

import { Tbl_People } from "@/app/generated/prisma";
import { useState } from "react";
import OwnersTable from "./OwnersTable";
import OwnersInsertModal from "./OwnerInsertModal";
import OwnersEditModal, { OwnerEditModalProps } from "./OwnerEditModal";
import { OwnerResponse } from "@/app/lib/services/owners";

type OwnersDashboardProps = {
  initialData: OwnerResponse;
};

export default function OwnersDashboard({ initialData }: OwnersDashboardProps) {
  const [data, setData] = useState<Tbl_People[]>(initialData.dta);
  const [loading, setLoading] = useState(false);
  const [insertModal, setInsertModal] = useState(false);
  const [editModal, setEditModal] = useState<OwnerEditModalProps>({ isOpen: false });

  const onEdit = (record: Tbl_People) => {
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
