"use client";
import "@ant-design/v5-patch-for-react-19";

import { Layout } from "antd";
import { Content } from "antd/es/layout/layout";
import { useState } from "react";
import DashboardMenu from "./_components/UI/Menu";
import GreenhouseButton from "../components/UI/GreenhouseButton";
import { MenuOutlined, EnvironmentOutlined, UserOutlined } from "@ant-design/icons";

export default function DashboardShell({ children }: { children: React.ReactNode }) {
  const [openDrawer, setOpenDrawer] = useState(false);

  return (
    <Layout className="h-dvh flex flex-col bg-gradient-to-br from-emerald-50/50 via-white to-lime-50/50">
      {/* Light Header */}
      <header className="sticky top-0 z-50 h-16 bg-white/80 backdrop-blur-md border-b border-emerald-100/60 shadow-sm relative">
        {/* subtle emerald underline */}
        <span className="pointer-events-none absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-emerald-300/50 to-transparent" />
        <div className="h-full px-4 sm:px-6 flex items-center justify-between">
          {/* Left: Menu + Logo */}
          <div className="flex items-center gap-4">
            <button
              onClick={() => setOpenDrawer(true)}
              className="h-10 w-10 rounded-xl bg-emerald-50 hover:bg-emerald-100 border border-emerald-200/70 transition-colors flex items-center justify-center text-emerald-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400/60 cursor-pointer"
              aria-label="باز کردن منو"
            >
              <MenuOutlined className="text-lg" />
            </button>

            <div className="flex items-center gap-3">
              <span className="h-9 w-9 rounded-xl bg-gradient-to-br from-emerald-500 to-lime-500 grid place-items-center text-white shadow-sm">
                <EnvironmentOutlined className="text-lg" />
              </span>
              <div className="hidden sm:block">
                <h1 className="text-emerald-900 font-semibold text-lg leading-none">سامانه گلخانه</h1>
                <p className="text-emerald-700/70 text-sm leading-none mt-1">مدیریت هوشمند کشاورزی</p>
              </div>
            </div>
          </div>

          {/* Right: Profile */}
          <div className="flex items-center gap-3">
            <div className="hidden sm:block text-right">
              <div className="text-emerald-900 font-medium text-sm leading-none">مدیر سیستم</div>
              <div className="text-emerald-700/70 text-xs leading-none mt-1 flex items-center justify-end gap-1">
                <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                آنلاین
              </div>
            </div>
            <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-emerald-400 to-lime-500 grid place-items-center text-white shadow-sm">
              <UserOutlined className="text-lg" />
            </div>
          </div>
        </div>
      </header>

      <Content className="flex-1 min-h-screen bg-slate-200">{children}</Content>

      <DashboardMenu open={openDrawer} onClose={() => setOpenDrawer(false)} />
    </Layout>
  );
}
