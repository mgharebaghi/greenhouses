"use client";
import { Col, Row } from "antd";
import { useState } from "react";
import GreenHousesTable from "./GreenHousesTable";
import { Tbl_Greenhouses } from "@/app/generated/prisma/client";
import PageHeader from "@/shared/components/PageHeader";
import { GatewayOutlined } from "@ant-design/icons";

export type ModalMsg = {
  status: "ok" | "error";
  message: string;
};

export default function GreenHouses({ initialData }: { initialData?: Tbl_Greenhouses[] }) {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<Tbl_Greenhouses[]>(initialData || []);

  return (
    <div className="w-full p-6 overflow-hidden">
      <PageHeader
        title="گلخانه‌ها"
        subtitle="مدیریت اطلاعات پایه گلخانه‌ها"
        icon={<GatewayOutlined />}
      />
      <Row gutter={[16, 16]}>
        <Col span={24}>
          <GreenHousesTable
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
