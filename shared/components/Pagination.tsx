"use client";

import { LeftOutlined, RightOutlined } from "@ant-design/icons";
import React from "react";

interface PaginationProps {
  current: number;
  total: number;
  pageSize: number;
  onChange: (page: number, pageSize: number) => void;
  showSizeChanger?: boolean;
  showTotal?: (total: number, range: [number, number]) => React.ReactNode;
}

export default function Pagination({
  current,
  total,
  pageSize,
  onChange,
  showSizeChanger = true,
  showTotal,
}: PaginationProps) {
  if (total === 0) return null;

  const totalPages = Math.ceil(total / pageSize);
  const pageSizes = [...new Set([5, 10, 20, 50, pageSize])].sort(
    (a, b) => a - b,
  );

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
      onChange(newPage, pageSize);
    }
  };

  const handlePageSizeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newSize = Number(e.target.value);
    onChange(1, newSize);
  };

  return (
    <nav
      aria-label="صفحه‌بندی جدول"
      className="border-t border-slate-200/60 bg-slate-50/70 px-3 py-2.5 dark:border-slate-700/60 dark:bg-slate-800/50 sm:px-4"
    >
      <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-2">
        <div className="flex items-center text-xs text-slate-600 dark:text-slate-400">
          {/* Minimal Total Count */}
          {showTotal ? (
            <span>
              {showTotal(total, [
                (current - 1) * pageSize + 1,
                Math.min(current * pageSize, total),
              ])}
            </span>
          ) : (
            <span dir="ltr">
              {`${(current - 1) * pageSize + 1}-${Math.min(current * pageSize, total)} / ${total}`}
            </span>
          )}
        </div>

        <div className="flex min-w-0 flex-wrap items-center gap-2">
          {showSizeChanger && (
            <select
              aria-label="تعداد ردیف در هر صفحه"
              value={pageSize}
              onChange={handlePageSizeChange}
              className="h-8 rounded-md border border-slate-200 bg-white px-2 text-xs text-slate-700 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300"
            >
              {pageSizes.map((value) => (
                <option key={value} value={value}>
                  {value}
                </option>
              ))}
            </select>
          )}

          <div className="flex items-center gap-1 bg-slate-100/50 dark:bg-slate-800/50 p-1 rounded-full">
            <button
              type="button"
              aria-label="صفحهٔ قبلی"
              disabled={current === 1}
              onClick={() => handlePageChange(current - 1)}
              className="h-8 w-8 flex items-center justify-center rounded-full text-slate-500 dark:text-slate-400 hover:text-emerald-600 dark:hover:text-emerald-400 hover:bg-white dark:hover:bg-slate-700 hover:shadow-sm disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:shadow-none transition-all duration-200"
            >
              <RightOutlined className="text-xs" />
            </button>

            <div className="h-8 w-8 flex items-center justify-center rounded-full bg-emerald-500 text-white shadow-md shadow-emerald-200 text-sm font-bold mx-1">
              {current}
            </div>

            <button
              type="button"
              aria-label="صفحهٔ بعدی"
              disabled={current >= totalPages}
              onClick={() => handlePageChange(current + 1)}
              className="h-8 w-8 flex items-center justify-center rounded-full text-slate-500 dark:text-slate-400 hover:text-emerald-600 dark:hover:text-emerald-400 hover:bg-white dark:hover:bg-slate-700 hover:shadow-sm disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:shadow-none transition-all duration-200"
            >
              <LeftOutlined className="text-xs" />
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}
