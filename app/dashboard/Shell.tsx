"use client";

import { removeAuth } from "@/server/auth/actions";
import DashboardMenu from "@/shared/components/Menu";
import GreenhouseButton from "@/shared/components/GreenhouseButton";
import NavigationLink from "@/shared/components/NavigationLink";
import ThemeToggle from "@/shared/components/ThemeToggle";
import { formatPersianDate, formatTehranTime } from "@/shared/dates/calendar";
import { useServerDay, useServerTime } from "@/shared/dates/ServerClock";
import { MenuOutlined } from "@ant-design/icons";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useState } from "react";

const pages: Record<string, readonly [title: string, description?: string]> = {
  "/dashboard": ["داشبورد", "سامانه مدیریت هوشمند گلخانه"],
  "/dashboard/people": ["اشخاص", "اطلاعات اشخاص حقیقی و حقوقی"],
  "/dashboard/suppliers": ["تأمین‌کنندگان", "مدیریت تأمین‌کنندگان بذر"],
  "/dashboard/greenhouse": ["گلخانه‌ها", "اطلاعات پایه گلخانه‌ها"],
  "/dashboard/plants": ["انواع گیاه", "اطلاعات پایه و نام علمی گیاهان"],
  "/dashboard/plantvarities": [
    "واریته و رقم",
    "مدیریت واریته‌های مرتبط با هر گیاه",
  ],
  "/dashboard/growthstages": ["مراحل رشد", "مدیریت مراحل رشد انواع گیاهان"],
  "/dashboard/planting": ["اطلاعات کاشت"],
  "/dashboard/grafting": ["عملیات پیوندزنی", "مدیریت عملیات و پیوندزنان"],
  "/dashboard/climatedaily": ["ثبت اطلاعات اقلیمی"],
  "/dashboard/irrigation": ["آبیاری"],
  "/dashboard/seed-production": ["تولید بذر"],
  "/dashboard/seed-package": [
    "بسته‌های بذر",
    "مدیریت بسته‌ها و شماره‌های سریال",
  ],
  "/dashboard/seed-warehousing": ["انبارداری بذر", "ورود و خروج بسته‌های بذر"],
  "/dashboard/warehouses": ["مدیریت انبارها", "اطلاعات پایه انبارهای بذر"],
  "/dashboard/nursery-rooms": [
    "اتاق‌های ریکاوری",
    "اطلاعات پایه اتاق‌های نرسری",
  ],
  "/dashboard/orders": ["ثبت سفارش", "مدیریت سفارش‌های ثبت‌شده"],
  "/dashboard/seed-planting": ["کاشت بذور", "مدیریت کاشت بذر در سینی"],
  "/dashboard/start-seedling-cycle": [
    "شروع سیکل نشاء",
    "انتقال سینی‌ها به گلخانه",
  ],
  "/dashboard/recoveryRoom": ["اتاق ریکاوری", "مدیریت و مشاهده وضعیت سینی‌ها"],
};

export default function DashboardShell({
  children,
}: {
  children: React.ReactNode;
}) {
  const [openDrawer, setOpenDrawer] = useState(false);
  const pathname = usePathname();
  const [title, description] = pages[pathname] ?? ["سامانه گلخانه"];
  const time = useServerTime();
  const today = useServerDay();
  const logo = (
    <Image
      src="/fakoor-logo.png"
      alt="فکور پیوند آریا"
      width={42}
      height={42}
      className="size-8 shrink-0 rounded-lg border border-slate-200 bg-white object-contain p-0.5 sm:size-10 dark:border-slate-600"
    />
  );

  return (
    <div
      dir="rtl"
      className="dashboard-shell flex h-dvh min-w-0 flex-col overflow-hidden"
    >
      <header className="z-10 shrink-0 border-b border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-900">
        <div className="mx-auto flex min-h-16 max-w-[1920px] min-w-0 items-center justify-between gap-2 px-2.5 py-2 sm:gap-4 sm:px-6">
          <div className="flex min-w-0 items-center gap-2.5 sm:gap-4">
            <GreenhouseButton
              onClick={() => setOpenDrawer(true)}
              className="sm:size-10"
              icon={<MenuOutlined />}
              variant="soft"
              aria-label="باز کردن منو"
              aria-expanded={openDrawer}
            />
            {pathname === "/dashboard" ? (
              logo
            ) : (
              <NavigationLink
                href="/dashboard"
                aria-label="فکور پیوند آریا، رفتن به داشبورد"
                title="رفتن به داشبورد"
                className="inline-flex shrink-0 rounded-lg outline-offset-2 motion-safe:transition-opacity hover:opacity-80 focus-visible:outline-2 focus-visible:outline-emerald-600"
              >
                {logo}
              </NavigationLink>
            )}
            <div className="min-w-0 border-s border-slate-200 ps-2.5 sm:ps-4 dark:border-slate-700">
              <h1 className="text-sm leading-5 font-bold text-slate-900 sm:text-lg sm:leading-6 dark:text-slate-50">
                {title}
              </h1>
              {description && (
                <p className="text-[11px] leading-4 text-slate-600 sm:text-xs dark:text-slate-300">
                  {description}
                </p>
              )}
            </div>
          </div>

          <div className="flex shrink-0 items-center gap-3 sm:gap-4">
            <div className="hidden border-e border-slate-200 pe-4 text-end md:block dark:border-slate-700">
              <bdi className="block text-sm font-bold text-slate-900 tabular-nums dark:text-slate-100">
                {formatTehranTime(time)}
              </bdi>
              <time
                dateTime={today}
                className="block text-xs text-slate-600 dark:text-slate-300"
              >
                {formatPersianDate(today, { format: "D MMMM" })}
              </time>
            </div>
            <ThemeToggle />
          </div>
        </div>
      </header>

      <main className="dashboard-scroll min-h-0 min-w-0 flex-1 overflow-x-hidden overflow-y-auto">
        {children}
      </main>

      <DashboardMenu
        open={openDrawer}
        onClose={() => setOpenDrawer(false)}
        onSignOut={removeAuth}
      />
    </div>
  );
}
