"use client";
import "@ant-design/v5-patch-for-react-19";

import { Layout } from "antd";
import { Content } from "antd/es/layout/layout";
import { useState } from "react";
import DashboardMenu from "./_components/UI/Menu";
import GreenhouseButton from "../components/UI/GreenhouseButton";
import { MenuOutlined, EnvironmentOutlined, UserOutlined } from "@ant-design/icons";

import { usePathname } from "next/navigation";
import Image from "next/image";
import ThemeToggle from "../components/UI/ThemeToggle";

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

  "/dashboard/climatedaily": "ثبت اطلاعات اقلیمی",
  "/dashboard/irrigation": "آبیاری",
  "/dashboard/seed-production": "تولید بذر",
  "/dashboard/seed-package": "بسته بذر",
  "/dashboard/seed-warehousing": "انبارداری بذر",
  "/dashboard/warehouses": "مدیریت انبارها",
  "/dashboard/nursery-rooms": "مدیریت اتاق های نشاء",



};

export default function DashboardShell({ children }: { children: React.ReactNode }) {
  const [openDrawer, setOpenDrawer] = useState(false);
  const pathname = usePathname();
  const currentTitle = PAGE_TITLES[pathname] || "سامانه گلخانه";

  return (
    <Layout className="h-dvh flex flex-col bg-gradient-to-br from-emerald-50/50 via-white to-lime-50/50">
      {/* Light Header */}
      {/* Distinct Modern Header with Themed Gradient & Stronger Depth */}
      <header className="sticky top-0 z-50 h-[90px] bg-white/95 dark:bg-slate-900/90 backdrop-blur-2xl border-b border-emerald-200/80 dark:border-slate-700/80 shadow-[0_4px_20px_-2px_rgba(16,185,129,0.15),0_10px_40px_-10px_rgba(0,0,0,0.05)] dark:shadow-[0_4px_20px_-2px_rgba(0,0,0,0.5)] transition-all duration-300">
        <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-emerald-400 via-teal-400 to-emerald-400 opacity-80 dark:opacity-60"></div>
        <div className="h-full px-3 sm:px-6 flex items-center justify-between mx-auto max-w-[1920px] pt-2">

          {/* Left: Menu + Brand Identity */}
          <div className="flex items-center gap-2 sm:gap-5">
            <button
              onClick={() => setOpenDrawer(true)}
              className="group relative h-10 w-10 rounded-xl bg-white/60 dark:bg-slate-800/60 border border-emerald-100 dark:border-slate-700 hover:border-emerald-400 dark:hover:border-emerald-500 hover:bg-white dark:hover:bg-slate-800 hover:text-emerald-600 dark:hover:text-emerald-400 transition-all duration-300 flex items-center justify-center text-emerald-800/70 dark:text-slate-300 cursor-pointer shadow-sm flex-shrink-0"
              aria-label="باز کردن منو"
            >
              <MenuOutlined className="text-lg transition-transform group-hover:scale-110" />
            </button>

            {/* Brand Section */}
            <div className="flex items-center gap-2 sm:gap-3 select-none">
              <div className="relative h-10 w-10 sm:h-12 sm:w-12 flex items-center justify-center rounded-xl bg-white dark:bg-slate-800 shadow-[0_4px_15px_-3px_rgba(0,0,0,0.1)] dark:shadow-none border border-emerald-50 dark:border-slate-700 overflow-hidden p-1.5 flex-shrink-0">
                <Image src="/fakoor-logo.png" alt="Logo" width={44} height={44} className="object-contain" />
              </div>

              <div className="flex flex-col justify-center min-w-0 max-w-[140px] sm:max-w-xs">
                <h1 className="text-emerald-950 dark:text-slate-100 font-black text-sm sm:text-xl tracking-tight leading-tight drop-shadow-sm transition-colors whitespace-nowrap truncate">
                  فکور پیوند آریا
                </h1>
                <p className="text-emerald-700/80 dark:text-emerald-400/80 font-medium text-[10px] sm:text-[13px] leading-none mt-0.5 transition-colors whitespace-nowrap truncate block">{currentTitle}</p>
              </div>
            </div>
          </div>

          {/* Right: Functional Widgets & Profile */}
          <div className="flex items-center gap-3 sm:gap-4">
            {/* Theme Toggle */}
            <ThemeToggle />

            {/* Date/Time Widget (Useful) */}
            <div className="hidden md:flex flex-col items-end mr-2 px-3 border-r-2 border-slate-100 dark:border-slate-700">
              <span className="text-slate-900 dark:text-slate-200 font-bold text-sm tracking-widest leading-none numbers-fa transition-colors" suppressHydrationWarning>
                {new Date().toLocaleTimeString("fa-IR", { hour: '2-digit', minute: '2-digit' })}
              </span>
              <span className="text-slate-400 dark:text-slate-500 text-[10px] font-medium mt-1 leading-none transition-colors" suppressHydrationWarning>
                {new Date().toLocaleDateString("fa-IR", { day: 'numeric', month: 'long' })}
              </span>
            </div>

            {/* Simplified Profile Action */}
            <div className="h-10 w-10 rounded-full bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-center text-slate-500 dark:text-slate-400 hover:text-emerald-600 dark:hover:text-emerald-400 hover:border-emerald-300 dark:hover:border-emerald-600 hover:bg-emerald-50 dark:hover:bg-slate-700 transition-all cursor-pointer shadow-sm flex-shrink-0">
              <UserOutlined className="text-lg" />
            </div>
          </div>
        </div>
      </header>

      <Content className="flex-1 min-h-screen relative bg-gradient-to-br from-emerald-50 via-lime-50 to-white dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 overflow-hidden transition-colors duration-500">
        {/* Animated Background Patterns */}
        <div className="absolute inset-0 opacity-30 dark:opacity-10 pointer-events-none overflow-hidden">
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
