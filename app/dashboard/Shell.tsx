"use client";
import "@ant-design/v5-patch-for-react-19";

import { Layout } from "antd";
import { Content } from "antd/es/layout/layout";
import { useState } from "react";
import DashboardMenu from "./_components/UI/Menu";
import GreenhouseButton from "../components/UI/GreenhouseButton";
import { MenuOutlined, EnvironmentOutlined, UserOutlined } from "@ant-design/icons";

import { usePathname } from "next/navigation";

// Mapping of paths to titles
const PAGE_TITLES: Record<string, string> = {
  "/dashboard": "داشبورد",
  "/dashboard/owners": "اطلاعات اشخاص",
  "/dashboard/suppliers": "اطلاعات تامین کنندگان",
  "/dashboard/greenhouse": "اطلاعات گلخانه ها",
  "/dashboard/plants": "اطلاعات پایه گیاهی",
  "/dashboard/plantvarities": "اطلاعات گونه گیاهی",
  "/dashboard/growthstages": "مراحل رشد گیاه",
  "/dashboard/planting": "اطلاعات کاشت",
  "/dashboard/growthdaily": "پایش رشد گیاه",
  "/dashboard/climatedaily": "ثبت اطلاعات اقلیمی",
  "/dashboard/irrigation": "آبیاری",
};

export default function DashboardShell({ children }: { children: React.ReactNode }) {
  const [openDrawer, setOpenDrawer] = useState(false);
  const pathname = usePathname();
  const currentTitle = PAGE_TITLES[pathname] || "سامانه گلخانه";

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
                <h1 className="text-emerald-900 font-semibold text-lg leading-none">{currentTitle}</h1>
                <p className="text-emerald-700/70 text-sm leading-none mt-1">سامانه مدیریت گلخانه</p>
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

      <Content className="flex-1 min-h-screen relative bg-gradient-to-br from-emerald-50 via-lime-50 to-white overflow-hidden">
        {/* Animated Background Patterns */}
        <div className="absolute inset-0 opacity-30 pointer-events-none overflow-hidden">
          <div className="absolute top-0 left-0 w-96 h-96 bg-emerald-200 rounded-full mix-blend-multiply filter blur-3xl animate-blob"></div>
          <div className="absolute top-0 right-0 w-96 h-96 bg-lime-200 rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-2000"></div>
          <div className="absolute bottom-0 left-1/2 w-96 h-96 bg-emerald-300 rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-4000"></div>
        </div>

        {/* Grid Pattern Overlay */}
        <div
          className="absolute inset-0 opacity-[0.03] pointer-events-none"
          style={{
            backgroundImage: `radial-gradient(circle at 2px 2px, rgb(16 185 129) 1px, transparent 0)`,
            backgroundSize: "40px 40px",
          }}
        ></div>

        <div className="relative z-10 w-full h-full overflow-auto">{children}</div>

        <style jsx>{`
          @keyframes blob {
            0%,
            100% {
              transform: translate(0, 0) scale(1);
            }
            33% {
              transform: translate(20px, -30px) scale(1.05);
            }
            66% {
              transform: translate(-15px, 15px) scale(0.95);
            }
          }
          .animate-blob {
            animation: blob 7s infinite;
          }
          .animation-delay-2000 {
            animation-delay: 2s;
          }
          .animation-delay-4000 {
            animation-delay: 4s;
          }
        `}</style>
      </Content>

      <DashboardMenu open={openDrawer} onClose={() => setOpenDrawer(false)} />
    </Layout>
  );
}
