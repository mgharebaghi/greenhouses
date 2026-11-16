"use client";

import { useEffect, useState } from "react";
import type { SupplierDTO } from "../types";
import SuppliersTable from "./SuppliersTable";

export default function SuppliersClientPage({
  initialData,
}: {
  initialData: SupplierDTO[];
}) {
  const [data, setData] = useState<SupplierDTO[]>(initialData);
  const [loading, setLoading] = useState(false);

  useEffect(() => setData(initialData), [initialData]);

  return (
    <div className="dashboard-page">
      <div className="w-full flex justify-center items-center">
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
