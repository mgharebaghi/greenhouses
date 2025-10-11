"use client";

import type { Plantings } from "@/app/generated/prisma";
import { PlusOutlined } from "@ant-design/icons";
import { Button } from "antd";
import PlantingTable from "./PlantingTable";
import PlantingInsUpModal from "./PlantingInsUpModal";
import { useState } from "react";

export default function PlantingDashboard({ initialData }: { initialData: any }) {
  const [data, setData] = useState<Plantings[]>(initialData || []);
  const [loading, setLoading] = useState<boolean>(false);
  const [insUpModal, setInsUpModal] = useState(false);

  return (
    <div className="w-full h-full p-4">
      <div className="w-full py-4">
        <Button type="primary" onClick={() => setInsUpModal(true)}>
          افزودن اطلاعات کاشت <PlusOutlined />
        </Button>
      </div>
      <PlantingTable data={data} loading={loading} setMainData={setData} setMainLoading={setLoading} />

      <PlantingInsUpModal
        open={insUpModal}
        onClose={() => setInsUpModal(false)}
        setMainData={setData}
        setMainLoading={setLoading}
      />
    </div>
  );
}
