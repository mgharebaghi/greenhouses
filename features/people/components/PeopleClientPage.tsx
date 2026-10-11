"use client";

import type { PersonActionResponse } from "@/features/people/types";
import PageHeader from "@/shared/components/PageHeader";
import { UsergroupAddOutlined } from "@ant-design/icons";
import { useState } from "react";
import { PeopleReadDTO } from "../schema";
import PeopleTable from "./PeopleTable";
import PersonFormModal from "./PersonFormModal";

export default function PeopleClientPage({
  initialData,
}: {
  initialData: PersonActionResponse;
}) {
  const [data, setData] = useState<PeopleReadDTO[]>(initialData.dta || []);
  const [loading, setLoading] = useState(false);
  const [formModal, setFormModal] = useState<{
    open: boolean;
    record?: PeopleReadDTO | null;
  }>({ open: false, record: null });

  return (
    <div className="w-full h-full p-6">
      <PageHeader
        title="اشخاص"
        subtitle="مدیریت اطلاعات پایه اشخاص "
        icon={<UsergroupAddOutlined />}
      />
      <div className="w-full flex justify-center items-center">
        <PeopleTable
          data={data}
          loading={loading}
          onEdit={(record) => setFormModal({ open: true, record })}
          openInsertModal={() => setFormModal({ open: true, record: null })}
          setData={setData}
          setLoading={setLoading}
        />
      </div>

      <PersonFormModal
        isOpen={formModal.open}
        setIsOpen={(open) => setFormModal((prev) => ({ ...prev, open }))}
        record={formModal.record}
        setMainData={setData}
        setMainLoading={setLoading}
      />
    </div>
  );
}
