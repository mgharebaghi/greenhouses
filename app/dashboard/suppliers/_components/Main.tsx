"use client";

import { useState } from "react";
import type { SupplierDTO } from "../types";
import SuppliersTable from "./SuppliersTable";
import SupplierInsertModal from "./SupplierInsertModal";
import SupplierEditModal, { SupplierEditModalProps } from "./SupplierEditModal";

export default function SuppliersDashboard({ initialData }: { initialData: SupplierDTO[] }) {
  const [data, setData] = useState<SupplierDTO[]>(initialData);
  const [loading, setLoading] = useState(false);
  const [insertOpen, setInsertOpen] = useState(false);
  const [editModal, setEditModal] = useState<SupplierEditModalProps>({ isOpen: false });

  return (
    <div className="w-full h-full">
      <div className="w-full p-4 flex justify-center items-center">
        <SuppliersTable
          data={data}
          loading={loading}
          setData={setData}
          setLoading={setLoading}
          onEdit={(record: SupplierDTO) => setEditModal({ isOpen: true, record })}
          setInsertModal={setInsertOpen}
        />
      </div>

      <SupplierInsertModal
        isOpen={insertOpen}
        setIsOpen={setInsertOpen}
        setMainData={setData}
        setMainLoading={setLoading}
      />

      <SupplierEditModal
        isOpen={editModal.isOpen}
        setIsOpen={() => setEditModal({ isOpen: false })}
        record={editModal.record}
        setMainData={setData}
        setMainLoading={setLoading}
      />
    </div>
  );
}
