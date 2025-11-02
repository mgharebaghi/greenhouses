"use client";

import { Divider, Drawer } from "antd";
import {
  DashboardOutlined,
  TeamOutlined,
  HomeOutlined,
  BugOutlined,
  ExperimentOutlined,
  RiseOutlined,
  DatabaseOutlined,
  LineChartOutlined,
  EnvironmentOutlined,
  LogoutOutlined,
  CloudOutlined,
} from "@ant-design/icons";
import { useRouter, usePathname } from "next/navigation";
import GreenhouseButton from "@/app/components/UI/GreenhouseButton";
import { removeAuth } from "@/app/lib/auth";

export default function DashboardMenu({ open, onClose }: { open: boolean; onClose: () => void }) {
  const route = useRouter();
  const pathname = usePathname();
  const menuItems = [
    {
      icon: <HomeOutlined />,
      title: "خانه",
      color: "text-slate-700",
      bgColor: "bg-slate-50",
      hoverColor: "group-hover:bg-slate-100",
      page: "/dashboard",
      active: true,
    },
    {
      icon: <TeamOutlined />,
      title: "اطلاعات اشخاص",
      color: "text-indigo-700",
      bgColor: "bg-indigo-50",
      hoverColor: "group-hover:bg-indigo-100",
      page: "/dashboard/owners",
      active: true,
    },
    {
      icon: <EnvironmentOutlined />,
      title: "اطلاعات گلخانه ها",
      color: "text-amber-700",
      bgColor: "bg-amber-50",
      hoverColor: "group-hover:bg-amber-100",
      page: "/dashboard/greenhouse",
      active: true,
    },
    {
      icon: <BugOutlined />,
      title: "اطلاعات پایه گیاهی",
      color: "text-emerald-700",
      bgColor: "bg-emerald-50",
      hoverColor: "group-hover:bg-emerald-100",
      page: "/dashboard/plants",
      active: true,
    },
    {
      icon: <ExperimentOutlined />,
      title: "اطلاعات گونه گیاهی",
      color: "text-teal-700",
      bgColor: "bg-teal-50",
      hoverColor: "group-hover:bg-teal-100",
      page: "/dashboard/plantvarities",
      active: true,
    },
    {
      icon: <RiseOutlined />,
      title: "مراحل رشد گیاه",
      color: "text-cyan-700",
      bgColor: "bg-cyan-50",
      hoverColor: "group-hover:bg-cyan-100",
      page: "/dashboard/growthstages",
      active: true,
    },
    {
      icon: <DatabaseOutlined />,
      title: "اطلاعات کاشت",
      color: "text-lime-700",
      bgColor: "bg-lime-50",
      hoverColor: "group-hover:bg-lime-100",
      page: "/dashboard/planting",
      active: true,
    },
    {
      icon: <LineChartOutlined />,
      title: "پایش رشد گیاه",
      color: "text-violet-700",
      bgColor: "bg-violet-50",
      hoverColor: "group-hover:bg-violet-100",
      page: "/dashboard/growthdaily",
      active: true,
    },
    {
      icon: <CloudOutlined />,
      title: "ثبت اطلاعات اقلیمی",
      color: "text-sky-700",
      bgColor: "bg-sky-50",
      hoverColor: "group-hover:bg-sky-100",
      page: "/dashboard/climatedaily",
      active: true,
    },
  ];

  const handleItems = (page: string) => {
    onClose();
    route.push(page);
  };

  const handleLogout = async () => {
    onClose();
    await removeAuth();
  };

  return (
    <Drawer
      title={
        <div className="space-y-3">
          {/* Header with user info */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="relative">
                <span className="h-10 w-10 rounded-full bg-gradient-to-br from-emerald-500 to-lime-500 grid place-items-center text-white text-lg shadow-md">
                  <EnvironmentOutlined />
                </span>
                <span className="absolute -bottom-0.5 -right-0.5 h-3 w-3 bg-emerald-500 border-2 border-white rounded-full"></span>
              </div>
              <div>
                <div className="text-emerald-900 font-semibold text-base">مدیر سیستم</div>
                <div className="text-emerald-700/80 text-xs">سامانه مدیریت گلخانه</div>
              </div>
            </div>
            <button
              className="h-8 w-8 rounded-lg bg-white border border-slate-200 hover:bg-slate-50 transition-colors flex items-center justify-center text-slate-600"
              onClick={onClose}
              aria-label="بستن"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Date info */}
          <div className="bg-white border border-emerald-100 rounded-lg p-3 text-center shadow-sm">
            <div className="text-emerald-900 text-lg font-semibold">{new Date().toLocaleDateString("fa-IR")}</div>
            <div className="text-emerald-700/80 text-sm">
              {new Date().toLocaleTimeString("fa-IR", { hour: "2-digit", minute: "2-digit" })}
            </div>
          </div>
        </div>
      }
      placement="right"
      onClose={onClose}
      open={open}
      width={280}
      closable={false}
      styles={{
        body: {
          padding: "16px 12px",
          background: "linear-gradient(135deg, #f0fdf4 0%, #f8fafc 40%, #ffffff 100%)", // light, airy
        },
        header: {
          background: "linear-gradient(135deg, #ffffff 0%, #f0fdf4 100%)",
          borderBottom: "1px solid rgba(16,185,129,0.25)",
          padding: "16px",
        },
      }}
    >
      <div className="space-y-1.5">
        {menuItems.map((item, index) => {
          const isActive = pathname === item.page;
          const canUse = !!item.active;
          return (
            <div
              key={index}
              role="link"
              tabIndex={canUse ? 0 : -1}
              aria-current={isActive ? "page" : undefined}
              onClick={() => (canUse ? handleItems(item.page) : null)}
              onKeyDown={(e) => {
                if (!canUse) return;
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  handleItems(item.page);
                }
              }}
              className={`group flex items-center gap-3 px-3 py-2.5 rounded-xl border transition-all duration-300 ease-out cursor-pointer relative overflow-hidden focus:outline-none
                         ${
                           isActive
                             ? "bg-emerald-100/90 border-emerald-300 ring-1 ring-emerald-200"
                             : "bg-white border-slate-200 hover:bg-emerald-50 hover:border-emerald-200"
                         } focus-visible:ring-2 focus-visible:ring-emerald-400`}
              style={{ opacity: canUse ? 1 : 0.5, pointerEvents: canUse ? "auto" : "none" }}
            >
              {/* subtle emerald sweep on hover */}
              <div
                className={`pointer-events-none absolute inset-0 bg-gradient-to-r from-emerald-100/0 via-emerald-100/60 to-emerald-100/0 transition-opacity duration-300
                  ${isActive ? "opacity-60" : "opacity-0 group-hover:opacity-100"}`}
              />

              {/* right accent line */}
              <div
                className={`absolute right-0 top-1/2 -translate-y-1/2 bg-emerald-500 rounded-l-full transition-all duration-300
                  ${isActive ? "w-1 h-6" : "w-0 h-4 group-hover:w-1"}`}
              />

              {/* icon chip */}
              <div
                className={`relative z-10 h-9 w-9 grid place-items-center rounded-lg transition-all
                  ${
                    isActive
                      ? "bg-emerald-100 ring-1 ring-emerald-300 text-emerald-700 scale-105"
                      : "bg-emerald-50 ring-1 ring-emerald-200 text-emerald-600 group-hover:bg-emerald-100 group-hover:ring-emerald-300 group-hover:scale-105"
                  }`}
                aria-hidden="true"
              >
                {item.icon}
              </div>

              {/* title */}
              <span
                className={`relative z-10 flex-1 mr-1 font-medium text-sm tracking-tight transition-colors
                  ${isActive ? "text-emerald-900" : "text-slate-800 group-hover:text-slate-900"}`}
              >
                {item.title}
              </span>

              {/* chevron */}
              <svg
                className={`relative z-10 w-3.5 h-3.5 transition-all duration-300
                  ${
                    isActive
                      ? "text-emerald-600 opacity-100 translate-x-0.5"
                      : "text-emerald-500 opacity-0 group-hover:opacity-100 group-hover:translate-x-0.5"
                  }`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
              </svg>
            </div>
          );
        })}
      </div>

      <Divider className="border-emerald-200 my-4" />

      <div className="px-1">
        <GreenhouseButton
          onClick={handleLogout}
          text="خروج از پنل"
          icon={<LogoutOutlined />}
          className="w-full h-9 text-sm justify-center"
        />
      </div>
    </Drawer>
  );
}
