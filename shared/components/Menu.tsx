"use client";

import { Drawer } from "antd";
import {
  HomeOutlined,
  LogoutOutlined,
  DownOutlined,
  FolderOutlined,
  ExperimentOutlined,
  CalendarOutlined,
  RightOutlined,
  UsergroupAddOutlined,
  ShopOutlined,
  GatewayOutlined,
  FileTextOutlined,
  AppstoreOutlined,
  RiseOutlined,
  ContainerOutlined,
  InboxOutlined,
  DatabaseOutlined,
  BorderOuterOutlined,
  ShoppingCartOutlined,
} from "@ant-design/icons";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import NProgress from "nprogress";
import { removeAuth } from "@/lib/auth";
import { useState } from "react";

type MenuItem = {
  icon: React.ReactNode;
  title: string;
  page?: string;
  submenu?: { title: string; page: string; icon?: React.ReactNode }[];
};

export default function DashboardMenu({ open, onClose }: { open: boolean; onClose: () => void }) {
  const route = useRouter();
  const pathname = usePathname();
  const [expandedMenus, setExpandedMenus] = useState<{ [key: string]: boolean }>({});

  const menuItems: MenuItem[] = [
    {
      icon: <HomeOutlined />,
      title: "داشبورد",
      page: "/dashboard",
    },
    {
      icon: <FolderOutlined />,
      title: "اطلاعات پایه",
      submenu: [
        { title: "اشخاص", page: "/dashboard/people", icon: <UsergroupAddOutlined /> },
        { title: "تامین‌کنندگان", page: "/dashboard/suppliers", icon: <ShopOutlined /> },
        { title: "گلخانه‌ها", page: "/dashboard/greenhouse", icon: <GatewayOutlined /> },
        { title: "انواع گیاه", page: "/dashboard/plants", icon: <FileTextOutlined /> },
        { title: "واریته - رقم", page: "/dashboard/plantvarities", icon: <AppstoreOutlined /> },
        { title: "مراحل رشد", page: "/dashboard/growthstages", icon: <RiseOutlined /> },
        { title: "انبارها", page: "/dashboard/warehouses", icon: <ContainerOutlined /> },
        { title: "اتاق‌های ریکاوری", page: "/dashboard/nursery-rooms", icon: <BorderOuterOutlined /> },
      ],
    },
    {
      icon: <ExperimentOutlined />,
      title: "مدیریت بذر",
      submenu: [
        { title: "بسته‌بندی بذر", page: "/dashboard/seed-package", icon: <InboxOutlined /> },
        { title: "انبارداری بذر", page: "/dashboard/seed-warehousing", icon: <DatabaseOutlined /> },
      ],
    },
    {
      icon: <ShoppingCartOutlined />,
      title: "ثبت سفارش",
      page: "/dashboard/orders",
    },
    {
      icon: <ContainerOutlined />,
      title: "کاشت بذور",
      page: "/dashboard/seed-planting",
    },
    {
      icon: <ExperimentOutlined />,
      title: "شروع سیکل نشاء",
      page: "/dashboard/start-seedling-cycle",
    },
  ];

  // Accordion behavior
  const toggleMenu = (title: string) => {
    setExpandedMenus((prev) => {
      const isCurrentlyOpen = !!prev[title];
      if (isCurrentlyOpen) return {}; // Close if clicking the open one
      return { [title]: true }; // Open the new one and close others
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

  // Helper for rendering icons with consistent style
  const MenuIcon = ({ icon, active }: { icon: React.ReactNode; active: boolean }) => (
    <div
      className={`h-9 w-9 rounded-xl flex items-center justify-center text-lg transition-all duration-300
        ${active
          ? "bg-gradient-to-br from-emerald-500 to-teal-600 text-white shadow-md scale-110"
          : "bg-emerald-50 dark:bg-emerald-900/40 text-emerald-600 dark:text-emerald-400 group-hover:bg-emerald-100 dark:group-hover:bg-emerald-800/60 group-hover:scale-105"
        }`}
    >
      {icon}
    </div>
  );

  return (
    <Drawer
      placement="right"
      onClose={onClose}
      open={open}
      width={320} // Slightly wider for better breathing room
      closable={false}
      styles={{
        body: { padding: 0 },
        mask: { backdropFilter: "blur(6px)", background: "rgba(0, 0, 0, 0.2)" },
      }}
      className="!bg-transparent"
    >
      <div className="flex flex-col h-full bg-gradient-to-br from-white via-slate-50 to-emerald-50/30 dark:from-slate-900 dark:via-slate-900 dark:to-emerald-950/30 transition-colors duration-300">

        {/* User Profile Header - Enhanced Design */}
        <div className="relative pt-8 pb-6 px-6 bg-gradient-to-br from-emerald-600 to-teal-700 dark:from-emerald-800 dark:to-teal-900 text-white overflow-hidden shrink-0 rounded-b-[2rem] shadow-xl z-20">
          {/* Background Decorations */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl -mr-10 -mt-10 pointer-events-none"></div>
          <div className="absolute bottom-0 left-0 w-24 h-24 bg-emerald-400/20 rounded-full blur-xl -ml-5 -mb-5 pointer-events-none"></div>

          <div className="relative z-10 flex flex-col items-center text-center">
            <div className="relative mb-3 group cursor-pointer">
              <div className="absolute -inset-1 bg-gradient-to-r from-emerald-300 to-teal-300 rounded-full blur opacity-40 group-hover:opacity-60 transition duration-300"></div>
              <Image
                src="/Images/Logo.png"
                alt="Logo"
                width={64}
                height={64}
                className="relative rounded-full border-2 border-white dark:border-slate-700 shadow-lg object-cover bg-white"
              />
              <span className="absolute bottom-0 right-0 h-4 w-4 bg-lime-400 border-2 border-emerald-700 rounded-full" title="آنلاین"></span>
            </div>

            <h3 className="font-bold text-lg text-white mb-0.5 tracking-tight">مدیر سیستم</h3>
            <p className="text-emerald-100 text-xs opacity-90 font-light">فکور پیوند آریا</p>
          </div>

          {/* Close Button Absolute */}
          <button
            onClick={onClose}
            className="absolute top-4 left-4 h-8 w-8 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 text-white transition-all backdrop-blur-sm border border-white/10"
          >
            <RightOutlined className="text-xs" />
          </button>
        </div>

        {/* Menu Items - Scrollable Area */}
        <div className="flex-1 overflow-y-auto px-4 py-6 space-y-2 custom-scrollbar">
          {menuItems.map((item, index) => {
            const hasSubmenu = !!item.submenu;
            const isExpanded = expandedMenus[item.title];
            const isActive = item.page ? pathname === item.page : isSubmenuItemActive(item.submenu);

            return (
              <div key={index} className={`select-none transition-all duration-500 ${isExpanded ? "mb-4 bg-emerald-50/30 dark:bg-emerald-900/10 rounded-3xl ring-1 ring-emerald-100/50 dark:ring-emerald-800/20 pb-2" : ""}`}>
                {/* Main Item */}
                <div
                  onClick={() => {
                    if (hasSubmenu) toggleMenu(item.title);
                    else {
                      NProgress.start();
                      onClose();
                      route.push(item.page!);
                    }
                  }}
                  className={`group relative flex items-center justify-between p-3 rounded-2xl cursor-pointer transition-all duration-300 border
                        ${isActive
                      ? "bg-white dark:bg-slate-800 border-emerald-200 dark:border-emerald-800 shadow-lg shadow-emerald-100/50 dark:shadow-none scale-[1.02]"
                      : "bg-transparent border-transparent hover:bg-white dark:hover:bg-slate-800 hover:shadow-sm hover:border-slate-100 dark:hover:border-slate-700"
                    }
                    `}
                >
                  <div className="flex items-center gap-3">
                    <MenuIcon icon={item.icon} active={isActive} />
                    <span className={`font-medium text-sm transition-colors ${isActive ? "text-emerald-900 dark:text-emerald-400" : "text-slate-600 dark:text-slate-400 group-hover:text-slate-900 dark:group-hover:text-slate-200"}`}>
                      {item.title}
                    </span>
                  </div>

                  {/* Indicators */}
                  <div className="flex items-center">
                    {isActive && !hasSubmenu && (
                      <div className="h-2 w-2 rounded-full bg-emerald-500 mr-2 animate-pulse"></div>
                    )}

                    {hasSubmenu && (
                      <DownOutlined className={`text-xs text-slate-400 transition-transform duration-300 ${isExpanded ? "rotate-180 text-emerald-500" : ""}`} />
                    )}
                  </div>
                </div>

                {/* Submenu */}
                <div className={`overflow-hidden transition-all duration-500 ease-in-out ${isExpanded ? "max-h-screen opacity-100" : "max-h-0 opacity-0"}`}>
                  <div className="relative pt-2 pb-2 pl-2 pr-4 mt-2 mb-2 bg-slate-50/50 dark:bg-slate-800/40 border border-slate-100/50 dark:border-slate-700/30 rounded-2xl mx-1 shadow-inner">

                    {item.submenu?.map((sub, subIdx) => {
                      const isSubActive = pathname === sub.page;
                      return (
                        <Link
                          key={subIdx}
                          href={sub.page}
                          onClick={() => {
                            NProgress.start();
                            onClose();
                          }}
                          className={`relative flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 mb-1 last:mb-0
                                        ${isSubActive
                              ? "bg-white dark:bg-slate-700 text-emerald-800 dark:text-emerald-300 font-bold shadow-sm border border-emerald-100/50 dark:border-slate-600"
                              : "text-slate-600 dark:text-slate-400 hover:text-emerald-700 dark:hover:text-emerald-300 hover:bg-white/60 dark:hover:bg-slate-700/50 hover:shadow-sm"
                            }
                                    `}
                        >
                          {/* Icon Indicator */}
                          <div className={`text-base transition-all duration-300 ${isSubActive ? "text-emerald-600 dark:text-emerald-400 scale-110" : "text-slate-400 dark:text-slate-500 group-hover:text-emerald-500"}`}>
                            {sub.icon}
                          </div>

                          <span className="text-sm">{sub.title}</span>

                          {/* Active Dot */}
                          {isSubActive && <div className="absolute left-3 w-1.5 h-1.5 rounded-full bg-emerald-500 ring-2 ring-emerald-100 dark:ring-emerald-900"></div>}
                        </Link>
                      )
                    })}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer Area - Date & Action */}
        <div className="p-5 bg-white/60 dark:bg-slate-900/60 backdrop-blur-md border-t border-slate-100 dark:border-slate-800">
          {/* Current Time Widget */}
          <div className="bg-gradient-to-r from-emerald-50 to-teal-50 dark:from-slate-800 dark:to-slate-800 rounded-xl p-3 border border-emerald-100/50 dark:border-slate-700 mb-3 flex items-center justify-between">
            <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-500">
              <CalendarOutlined />
              <span className="text-xs font-medium" suppressHydrationWarning>
                {new Date().toLocaleDateString("fa-IR")}
              </span>
            </div>
            <div className="text-emerald-800 dark:text-slate-300 font-bold text-sm tracking-widest numbers-fa" suppressHydrationWarning>
              {new Date().toLocaleTimeString("fa-IR", { hour: '2-digit', minute: '2-digit' })}
            </div>
          </div>

          {/* Logout Button */}
          <button
            onClick={handleLogout}
            className="w-full group relative flex items-center justify-center gap-2 h-11 bg-white dark:bg-slate-800 hover:bg-rose-50 dark:hover:bg-rose-900/10 border border-slate-200 dark:border-slate-700 hover:border-rose-200 dark:hover:border-rose-800 rounded-xl transition-all duration-300 shadow-sm hover:shadow"
          >
            <div className="p-1.5 rounded-full bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-400 group-hover:bg-rose-100 dark:group-hover:bg-rose-900/20 group-hover:text-rose-500 transition-colors">
              <LogoutOutlined />
            </div>
            <span className="text-sm font-medium text-slate-600 dark:text-slate-300 group-hover:text-rose-600 dark:group-hover:text-rose-400">خروج از حساب کاربری</span>
          </button>
        </div>
      </div>
    </Drawer>
  );
}

