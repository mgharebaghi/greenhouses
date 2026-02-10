"use client";

import { useState } from "react";
import type { SupplierDTO } from "../types";
import SuppliersTable from "./SuppliersTable";
// import SupplierInsertModal from "./SupplierInsertModal"; // Deleted
// import SupplierEditModal, { SupplierEditModalProps } from "./SupplierEditModal"; // Deleted

export default function SuppliersDashboard({ initialData }: { initialData: SupplierDTO[] }) {
  const [data, setData] = useState<SupplierDTO[]>(initialData);
  const [loading, setLoading] = useState(false);
  // const [insertOpen, setInsertOpen] = useState(false); // Managed internally by SuppliersTable
  // const [editModal, setEditModal] = useState<SupplierEditModalProps>({ isOpen: false }); // Managed internally by SuppliersTable

  return (
    <div className="w-full h-full">
      <div className="w-full p-4 flex justify-center items-center">
        <SuppliersTable
          data={data}
          loading={loading}
          setData={setData}
          setLoading={setLoading}
        // onEdit={(record: SupplierDTO) => setEditModal({ isOpen: true, record })} // Managed internally
        // setInsertModal={setInsertOpen} // Managed internally
        />
      </div>

      {/* Insert and Edit Modals are now managed internally by SuppliersTable using SupplierFormModal */}
    </div>
  );
}
