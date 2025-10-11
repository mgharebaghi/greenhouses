"use client";
import "@ant-design/v5-patch-for-react-19";

import { Button, Layout } from "antd";
import { Content, Header } from "antd/es/layout/layout";
import { useState } from "react";
import DashboardMenu from "./_components/UI/Menu";
import MenuOutlined from "@ant-design/icons/MenuOutlined";

export default function DashboardShell({ children }: { children: React.ReactNode }) {
  const [openDrawer, setOpenDrawer] = useState(false);

  return (
    <Layout className="h-dvh flex flex-col bg-slate-100">
      <Header className="sticky top-0 z-50 h-16 flex items-center">
        <div className="flex items-center">
          <Button type="primary" onClick={() => setOpenDrawer(true)}>
            <MenuOutlined />
          </Button>
        </div>
      </Header>
      <Content className="flex-1 min-h-[calc(100vh-64px)] overflow-auto p-4">{children}</Content>

      <DashboardMenu open={openDrawer} onClose={() => setOpenDrawer(false)} />
    </Layout>
  );
}
