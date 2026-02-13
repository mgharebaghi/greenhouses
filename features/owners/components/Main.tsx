"use client";

import { Tbl_People } from "@/app/generated/prisma";
import { useState } from "react";
import OwnersTable from "./OwnersTable";
import OwnerFormModal from "./OwnerFormModal";
import { OwnerResponse } from "@/features/owners/services";
import { PeopleReadDTO } from "../schema";

export default function OwnersDashboard({ initialData }: { initialData: OwnerResponse }) {
  const [data, setData] = useState<PeopleReadDTO[]>(initialData.dta || []);
  const [loading, setLoading] = useState(false);
  const [formModal, setFormModal] = useState<{ open: boolean; record?: PeopleReadDTO | null }>({ open: false, record: null });

  return (
    <div className="w-full h-full">
      <div className="w-full p-4 flex justify-center items-center">
        <OwnersTable
          data={data}
          loading={loading}
          onEdit={(record) => setFormModal({ open: true, record })}
          openInsertModal={() => setFormModal({ open: true, record: null })}
          setData={setData}
          setLoading={setLoading}
        />
      </div>

      <OwnerFormModal
        isOpen={formModal.open}
        setIsOpen={(open) => setFormModal(prev => ({ ...prev, open }))}
        record={formModal.record}
        setMainData={setData}
        setMainLoading={setLoading}
      />
    </div>
  );
}
