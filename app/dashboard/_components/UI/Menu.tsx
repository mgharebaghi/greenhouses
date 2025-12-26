"use client";

import { Divider, Drawer } from "antd";
import {
  HomeOutlined,
  EnvironmentOutlined,
  LogoutOutlined,
  CloudOutlined,
  ApiOutlined,
  DownOutlined,
  FolderOutlined,
  BarChartOutlined,
} from "@ant-design/icons";
import { useRouter, usePathname } from "next/navigation";
import GreenhouseButton from "@/app/components/UI/GreenhouseButton";
import { removeAuth } from "@/app/lib/auth";
import { useState, useEffect } from "react";

type MenuItem = {
  icon: React.ReactNode;
  title: string;
  page?: string;
  submenu?: { title: string; page: string }[];
};

export default function DashboardMenu({ open, onClose }: { open: boolean; onClose: () => void }) {
  const route = useRouter();
  const pathname = usePathname();
  const [expandedMenus, setExpandedMenus] = useState<{ [key: string]: boolean }>({});


  const menuItems: MenuItem[] = [
    {
      icon: <HomeOutlined />,
      title: "خانه",
      page: "/dashboard",
    },
    {
      icon: <FolderOutlined />,
      title: "اطلاعات پایه",
      submenu: [
        { title: "اطلاعات اشخاص", page: "/dashboard/owners" },
        { title: "اطلاعات تامین کنندگان", page: "/dashboard/suppliers" },
        { title: "اطلاعات گلخانه ها", page: "/dashboard/greenhouse" },
        { title: "اطلاعات پایه گیاهی", page: "/dashboard/plants" },
        { title: "اطلاعات گونه گیاهی", page: "/dashboard/plantvarities" },
        { title: "مراحل رشد گیاه", page: "/dashboard/growthstages" },
      ],
    },
    {
      icon: <BarChartOutlined />,
      title: "پایش گیاهی",
      submenu: [
        { title: "اطلاعات کاشت", page: "/dashboard/planting" },
        { title: "پایش رشد گیاه", page: "/dashboard/growthdaily" },
      ],
    },
    {
      icon: <CloudOutlined />,
      title: "اطلاعات اقلیمی",
      submenu: [{ title: "ثبت اطلاعات اقلیمی", page: "/dashboard/climatedaily" }],
    },
    {
      icon: <ApiOutlined />,
      title: "آبیاری",
      page: "/dashboard/irrigation",
    },
  ];

  const handleItems = (page: string) => {
    onClose();
    route.push(page);
  };

  // Accordion behavior: only one submenu open at a time
  const toggleMenu = (title: string) => {
    setExpandedMenus((prev) => {
      const isCurrentlyOpen = !!prev[title];
      // If clicked menu already open -> close all
      if (isCurrentlyOpen) return {};
      // Otherwise open only this one
      return { [title]: true };
    });
  };

  const isSubmenuItemActive = (submenu?: { title: string; page: string }[]) => {
    if (!submenu) return false;
    return submenu.some((sub) => pathname === sub.page);
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
            <div className="text-emerald-900 text-lg font-semibold min-h-[28px]" suppressHydrationWarning>
              {new Date().toLocaleDateString("fa-IR")}
            </div>
            <div className="text-emerald-700/80 text-sm min-h-[20px]" suppressHydrationWarning>
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
          const hasSubmenu = !!item.submenu;
          const isExpanded = expandedMenus[item.title];
          const isActive = item.page ? pathname === item.page : isSubmenuItemActive(item.submenu);

          return (
            <div key={index}>
              {/* Main Menu Item */}
              <div
                role="button"
                tabIndex={0}
                aria-expanded={hasSubmenu ? isExpanded : undefined}
                aria-current={isActive ? "page" : undefined}
                onClick={() => {
                  if (hasSubmenu) {
                    toggleMenu(item.title);
                  } else if (item.page) {
                    handleItems(item.page);
                  }
                }}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    if (hasSubmenu) {
                      toggleMenu(item.title);
                    } else if (item.page) {
                      handleItems(item.page);
                    }
                  }
                }}
                className={`group flex items-center gap-3 px-3 py-2.5 rounded-xl border transition-all duration-300 ease-out cursor-pointer relative overflow-hidden focus:outline-none
                           ${isActive
                    ? "bg-emerald-100/90 border-emerald-300 ring-1 ring-emerald-200"
                    : "bg-white border-slate-200 hover:bg-emerald-50 hover:border-emerald-200"
                  } focus-visible:ring-2 focus-visible:ring-emerald-400`}
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
                    ${isActive
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

                {/* chevron or expand icon */}
                {hasSubmenu ? (
                  <div
                    className={`relative z-10 transition-transform duration-300 ${isExpanded ? "rotate-180" : "rotate-0"
                      }`}
                  >
                    <DownOutlined
                      className={`text-xs ${isActive ? "text-emerald-600" : "text-emerald-500 group-hover:text-emerald-600"
                        }`}
                    />
                  </div>
                ) : (
                  <svg
                    className={`relative z-10 w-3.5 h-3.5 transition-all duration-300
                      ${isActive
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
                )}
              </div>

              {/* Submenu Items */}
              {hasSubmenu && (
                <div
                  className={`overflow-hidden transition-all duration-300 ease-in-out ${isExpanded ? "max-h-96 opacity-100 mt-1.5" : "max-h-0 opacity-0"
                    }`}
                >
                  <div className="space-y-1.5 pr-3 mr-3 border-r-4 border-emerald-200/80 bg-emerald-50/60 rounded-xl p-2">
                    {item.submenu?.map((subItem, subIndex) => {
                      const isSubActive = pathname === subItem.page;
                      return (
                        <div
                          key={subIndex}
                          role="link"
                          tabIndex={isExpanded ? 0 : -1}
                          aria-current={isSubActive ? "page" : undefined}
                          onClick={() => handleItems(subItem.page)}
                          onKeyDown={(e) => {
                            if (e.key === "Enter" || e.key === " ") {
                              e.preventDefault();
                              handleItems(subItem.page);
                            }
                          }}
                          className={`group flex items-center gap-3 px-3.5 py-2.5 rounded-lg border transition-all duration-200 cursor-pointer focus:outline-none
                                     ${isSubActive
                              ? "bg-white border-emerald-300 ring-1 ring-emerald-200 border-r-4"
                              : "bg-white/70 border-slate-200 hover:bg-emerald-100/70 hover:border-emerald-200"
                            } focus-visible:ring-2 focus-visible:ring-emerald-300`}
                        >
                          {/* sub item dot */}
                          <div
                            className={`w-2 h-2 rounded-full transition-all
                              ${isSubActive
                                ? "bg-emerald-600 ring-2 ring-emerald-200 scale-110"
                                : "bg-slate-300 group-hover:bg-emerald-500"
                              }`}
                          />

                          {/* sub item title */}
                          <span
                            className={`flex-1 text-[13px] md:text-sm font-medium transition-colors
                              ${isSubActive
                                ? "text-emerald-900 font-semibold"
                                : "text-slate-800 group-hover:text-slate-900"
                              }`}
                          >
                            {subItem.title}
                          </span>

                          {/* sub item chevron */}
                          <svg
                            className={`w-3.5 h-3.5 transition-all duration-200
                              ${isSubActive
                                ? "text-emerald-500 opacity-100 translate-x-0.5"
                                : "text-emerald-400 opacity-0 group-hover:opacity-100 group-hover:translate-x-0.5"
                              }`}
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
                          </svg>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
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
