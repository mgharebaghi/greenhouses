"use client";

import GreenhouseButton from "./GreenhouseButton";
import { formatPersianDate, formatTehranTime } from "@/shared/dates/calendar";
import { useServerDay, useServerTime } from "@/shared/dates/ServerClock";
import {
  AppstoreOutlined,
  BorderOuterOutlined,
  CalendarOutlined,
  CheckOutlined,
  ClockCircleOutlined,
  CloseOutlined,
  ContainerOutlined,
  DatabaseOutlined,
  DownOutlined,
  ExperimentOutlined,
  FileTextOutlined,
  FolderOutlined,
  GatewayOutlined,
  HomeOutlined,
  InboxOutlined,
  LogoutOutlined,
  MedicineBoxOutlined,
  RetweetOutlined,
  RightOutlined,
  RiseOutlined,
  ShopOutlined,
  ShoppingCartOutlined,
  ToolOutlined,
  UsergroupAddOutlined,
} from "@ant-design/icons";
import { Drawer, message } from "antd";
import Image from "next/image";
import NavigationLink from "./NavigationLink";
import { unstable_rethrow, usePathname } from "next/navigation";
import { useState } from "react";

type MenuItem = {
  icon: React.ReactNode;
  title: string;
  page?: string;
  submenu?: { title: string; page: string; icon?: React.ReactNode }[];
};

export default function DashboardMenu({
  open,
  onClose,
  onSignOut,
}: {
  open: boolean;
  onClose: () => void;
  onSignOut: () => Promise<void>;
}) {
  const pathname = usePathname();
  const time = useServerTime();
  const today = useServerDay();
  const [expandedTitle, setExpandedTitle] = useState<string | null>();

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
        {
          title: "اشخاص",
          page: "/dashboard/people",
          icon: <UsergroupAddOutlined />,
        },
        {
          title: "تامین‌کنندگان",
          page: "/dashboard/suppliers",
          icon: <ShopOutlined />,
        },
        {
          title: "گلخانه‌ها",
          page: "/dashboard/greenhouse",
          icon: <GatewayOutlined />,
        },
        {
          title: "انواع گیاه",
          page: "/dashboard/plants",
          icon: <FileTextOutlined />,
        },
        {
          title: "واریته - رقم",
          page: "/dashboard/plantvarities",
          icon: <AppstoreOutlined />,
        },
        {
          title: "مراحل رشد",
          page: "/dashboard/growthstages",
          icon: <RiseOutlined />,
        },
        {
          title: "انبارها",
          page: "/dashboard/warehouses",
          icon: <ContainerOutlined />,
        },
        {
          title: "اتاق‌های ریکاوری",
          page: "/dashboard/nursery-rooms",
          icon: <BorderOuterOutlined />,
        },
      ],
    },
    {
      icon: <ExperimentOutlined />,
      title: "مدیریت بذر",
      submenu: [
        {
          title: "بسته‌های بذر",
          page: "/dashboard/seed-package",
          icon: <InboxOutlined />,
        },
        {
          title: "انبارداری بذر",
          page: "/dashboard/seed-warehousing",
          icon: <DatabaseOutlined />,
        },
      ],
    },
    {
      icon: <ShoppingCartOutlined />,
      title: "ثبت سفارش",
      page: "/dashboard/orders",
    },
    {
      icon: <ContainerOutlined />,
      title: "فرآیند تولید نشای پیوندی",
      submenu: [
        {
          title: "کاشت بذور پایه و پیوندک",
          page: "/dashboard/seed-planting",
          icon: <ContainerOutlined />,
        },
        {
          title: "رشد نشاء های پایه و پیوندک",
          page: "/dashboard/start-seedling-cycle",
          icon: <RetweetOutlined />,
        },
        {
          title: "پیوند زنی",
          page: "/dashboard/grafting",
          icon: <ToolOutlined />,
        },
      ],
    },
    {
      icon: <MedicineBoxOutlined />,
      title: "اتاق ریکاوری",
      page: "/dashboard/recoveryRoom",
    },
  ];

  const activeGroup = menuItems.find((item) =>
    item.submenu?.some((sub) => pathname === sub.page),
  )?.title;
  const openGroup = expandedTitle === undefined ? activeGroup : expandedTitle;

  const closeAfterNavigation = () => {
    setExpandedTitle(undefined);
    onClose();
  };

  const handleLogout = async () => {
    onClose();
    try {
      await onSignOut();
    } catch (error) {
      unstable_rethrow(error);
      void message.error("خروج از حساب انجام نشد. لطفاً دوباره تلاش کنید.");
    }
  };

  const focusStyle =
    "focus-visible:outline-2 focus-visible:outline-emerald-500 focus-visible:-outline-offset-2";
  // Ant Design's unlayered link reset overrides Tailwind's background utilities.
  const currentPageStyle =
    "bg-emerald-800! font-bold text-white! hover:bg-emerald-700!";
  const currentPageBadge = (
    <span
      aria-hidden
      className="inline-flex shrink-0 items-center gap-1 rounded-md bg-white/15 px-1.5 py-1 text-[10px] leading-none whitespace-nowrap text-white"
    >
      <CheckOutlined />
      <span className="max-[340px]:sr-only">صفحهٔ فعلی</span>
    </span>
  );

  return (
    <Drawer
      aria-label="منوی داشبورد"
      placement="right"
      onClose={onClose}
      open={open}
      width="min(22rem, 100vw)"
      closable={false}
      styles={{
        body: { padding: 0, overflow: "hidden", minHeight: 0 },
        mask: {
          backdropFilter: "blur(5px)",
          background: "rgba(2, 28, 23, 0.38)",
        },
      }}
    >
      <div
        dir="rtl"
        className="dashboard-menu flex h-full min-h-0 flex-col bg-linear-to-b from-emerald-50 via-slate-50 to-white dark:from-emerald-950 dark:via-slate-900 dark:to-slate-950"
      >
        <header className="flex shrink-0 items-center gap-3 border-b border-emerald-800/70 bg-linear-to-bl from-emerald-950 via-emerald-900 to-teal-800 px-4 py-3 shadow-sm dark:border-emerald-700/50">
          <Image
            src="/fakoor-logo.png"
            alt=""
            width={36}
            height={36}
            className="size-9 shrink-0 rounded-xl bg-white object-contain p-1 ring-1 ring-white/25"
          />
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm leading-5 font-bold text-white">
              فکور پیوند آریا
            </p>
            <p className="truncate text-xs leading-4 text-emerald-100/90">
              مدیر سیستم
            </p>
          </div>
          <GreenhouseButton
            onClick={onClose}
            aria-label="بستن منو"
            variant="ghost"
            icon={<CloseOutlined />}
            className="text-white [--button-hover:rgb(255_255_255/0.16)]"
          />
        </header>

        <nav
          aria-label="صفحات داشبورد"
          className="dashboard-menu-list min-h-0 flex-1 overflow-x-hidden overflow-y-auto overscroll-contain px-3 py-3.5 sm:px-4"
        >
          <ul className="space-y-2">
            {menuItems.map((item, index) => {
              const page = item.page;
              const isExpanded = openGroup === item.title;
              const isActive = page
                ? pathname === page
                : activeGroup === item.title;
              const submenuId = `dashboard-submenu-${index}`;
              const itemStyle = `group flex min-h-12 w-full items-center gap-3 rounded-xl px-2.5 py-1.5 text-start text-sm motion-safe:transition-colors motion-safe:duration-200 motion-safe:ease-[var(--button-ease)] ${focusStyle}`;
              const mainItemStyle = isActive
                ? page
                  ? currentPageStyle
                  : "border-s-[3px] border-emerald-600 bg-emerald-100 font-bold text-emerald-950! hover:bg-emerald-200 dark:border-emerald-400 dark:bg-emerald-900/85 dark:text-emerald-50! dark:hover:bg-emerald-800"
                : "font-semibold text-slate-800! hover:bg-emerald-50! hover:text-emerald-950! dark:text-slate-100! dark:hover:bg-emerald-900/45! dark:hover:text-emerald-100!";
              const itemContent = (
                <>
                  <span
                    aria-hidden
                    className={`grid size-8 shrink-0 place-items-center rounded-lg text-base transition-colors ${isActive ? "bg-emerald-700 text-white dark:bg-emerald-600" : "bg-emerald-50 text-emerald-800 ring-1 ring-emerald-200/70 group-hover:bg-emerald-100 dark:bg-emerald-950 dark:text-emerald-200 dark:ring-emerald-800/70 dark:group-hover:bg-emerald-900"}`}
                  >
                    {item.icon}
                  </span>
                  <span className="min-w-0 flex-1 break-words">
                    {item.title}
                  </span>
                </>
              );

              return (
                <li
                  key={item.title}
                  className={`rounded-[13px] border shadow-xs transition-colors ${isActive || isExpanded ? "border-emerald-300/75 bg-white dark:border-emerald-800 dark:bg-slate-900" : "border-slate-200/85 bg-white/90 hover:border-emerald-300 dark:border-slate-700/80 dark:bg-slate-900/80 dark:hover:border-emerald-700"}`}
                >
                  {page ? (
                    <NavigationLink
                      href={page}
                      onNavigation={closeAfterNavigation}
                      aria-current={isActive ? "page" : undefined}
                      className={`${itemStyle} ${mainItemStyle}`}
                    >
                      {itemContent}
                      {isActive ? (
                        currentPageBadge
                      ) : (
                        <RightOutlined
                          aria-hidden
                          className="rotate-180 text-[11px] text-emerald-700 opacity-45 transition-opacity group-hover:opacity-100 group-focus-visible:opacity-100 dark:text-emerald-300"
                        />
                      )}
                    </NavigationLink>
                  ) : (
                    <>
                      <GreenhouseButton
                        variant="ghost"
                        aria-expanded={isExpanded}
                        aria-controls={submenuId}
                        onClick={() =>
                          setExpandedTitle(isExpanded ? null : item.title)
                        }
                        className={`justify-start ${itemStyle} ${mainItemStyle}`}
                      >
                        {itemContent}
                        <span
                          aria-hidden
                          className={`grid size-6 shrink-0 place-items-center rounded-md text-[10px] transition-colors ${isExpanded ? "bg-emerald-200/80 text-emerald-900 dark:bg-emerald-800 dark:text-emerald-100" : "bg-slate-100 text-slate-500 group-hover:bg-emerald-100 group-hover:text-emerald-800 dark:bg-slate-800 dark:text-slate-300 dark:group-hover:bg-emerald-900 dark:group-hover:text-emerald-100"}`}
                        >
                          <DownOutlined
                            className={`motion-safe:transition-transform ${isExpanded ? "rotate-180" : ""}`}
                          />
                        </span>
                      </GreenhouseButton>
                      <ul
                        id={submenuId}
                        hidden={!isExpanded}
                        className="ms-7 me-2 mt-1 mb-2 space-y-0.5 rounded-e-lg border-s-2 border-emerald-300 bg-emerald-50/65 p-1.5 dark:border-emerald-700 dark:bg-emerald-950/55"
                      >
                        {item.submenu?.map((sub) => {
                          const current = pathname === sub.page;
                          return (
                            <li key={sub.page}>
                              <NavigationLink
                                href={sub.page}
                                onNavigation={closeAfterNavigation}
                                aria-current={current ? "page" : undefined}
                                className={`group/submenu flex min-h-9 items-center gap-2 rounded-lg border px-2 py-1.5 text-[13px] transition-colors ${focusStyle} ${current ? `border-emerald-800 shadow-xs ${currentPageStyle}` : "border-transparent text-slate-700! hover:border-emerald-300 hover:bg-emerald-100! hover:text-emerald-950! focus-visible:bg-emerald-100! dark:text-slate-300! dark:hover:border-emerald-600 dark:hover:bg-emerald-900! dark:hover:text-white! dark:focus-visible:bg-emerald-900!"}`}
                              >
                                <span
                                  aria-hidden
                                  className={`grid size-5 shrink-0 place-items-center rounded-md transition-colors ${current ? "text-emerald-50" : "text-emerald-700 group-hover/submenu:bg-white group-hover/submenu:text-emerald-900 dark:text-emerald-300 dark:group-hover/submenu:bg-emerald-800 dark:group-hover/submenu:text-white"}`}
                                >
                                  {sub.icon}
                                </span>
                                <span className="min-w-0 flex-1 break-words">
                                  {sub.title}
                                </span>
                                {current ? (
                                  currentPageBadge
                                ) : (
                                  <RightOutlined
                                    aria-hidden
                                    className="rotate-180 text-[10px] text-emerald-700 opacity-0 transition-opacity group-hover/submenu:opacity-100 group-focus-visible/submenu:opacity-100 dark:text-emerald-200"
                                  />
                                )}
                              </NavigationLink>
                            </li>
                          );
                        })}
                      </ul>
                    </>
                  )}
                </li>
              );
            })}
          </ul>
        </nav>

        <footer className="shrink-0 space-y-2 border-t border-emerald-100 bg-white/90 px-3 pt-2.5 pb-[max(0.625rem,env(safe-area-inset-bottom))] sm:px-4 dark:border-slate-800 dark:bg-slate-950">
          <div className="flex flex-wrap items-center gap-x-2 gap-y-1 rounded-xl border border-emerald-100 bg-emerald-50/75 px-2.5 py-1.5 dark:border-emerald-900 dark:bg-emerald-950/60">
            <span
              aria-hidden
              className="grid size-8 shrink-0 place-items-center rounded-lg bg-white text-emerald-700 shadow-xs dark:bg-emerald-900 dark:text-emerald-200"
            >
              <CalendarOutlined />
            </span>
            <time
              dateTime={today}
              className="flex-1 text-xs font-semibold text-slate-700 dark:text-slate-200"
            >
              {formatPersianDate(today, { format: "D MMMM YYYY" })}
            </time>
            <span
              className="numbers-fa flex items-center gap-1.5 rounded-lg bg-white px-2 py-1 text-xs font-bold text-emerald-900 tabular-nums shadow-xs dark:bg-emerald-900 dark:text-emerald-100"
              aria-label="ساعت تهران"
            >
              <ClockCircleOutlined aria-hidden />
              <bdi>{formatTehranTime(time)}</bdi>
            </span>
          </div>

          <GreenhouseButton
            onClick={handleLogout}
            text="خروج از حساب کاربری"
            icon={<LogoutOutlined />}
            variant="danger-soft"
            fullWidth
            className="justify-start"
          />
        </footer>
      </div>
    </Drawer>
  );
}
