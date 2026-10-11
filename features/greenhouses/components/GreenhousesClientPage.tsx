"use client";

import type { GreenhouseRecord } from "@/features/greenhouses/types/record";
import PageHeader from "@/shared/components/PageHeader";
import { GatewayOutlined } from "@ant-design/icons";
import { Col, Row } from "antd";
import { useState } from "react";
import GreenhousesTable from "./GreenhousesTable";

export default function GreenhousesClientPage({
  initialData,
}: {
  initialData?: GreenhouseRecord[];
}) {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<GreenhouseRecord[]>(initialData || []);

  return (
    <div className="w-full p-6 overflow-hidden">
      <PageHeader
        title="گلخانه‌ها"
        subtitle="مدیریت اطلاعات پایه گلخانه‌ها"
        icon={<GatewayOutlined />}
      />
      <Row gutter={[16, 16]}>
        <Col span={24}>
          <GreenhousesTable
            data={data}
            loading={loading}
            setMainLoading={setLoading}
            setMainData={setData}
          />
        </Col>
      </Row>
    </div>
  );
}
