"use client";

import React from "react";
import { LeftOutlined, RightOutlined } from "@ant-design/icons";
import GreenhouseButton from "@/shared/components/GreenhouseButton";

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
        <div className="px-4 py-3 bg-gradient-to-r from-slate-50/60 to-slate-100/60 dark:from-slate-800/60 dark:to-slate-900/60 border-t border-slate-200/60 dark:border-slate-700/60">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-center gap-2 opacity-50 hover:opacity-100 transition-opacity">
                    {/* Minimal Total Count */}
                    {showTotal ? (
                        <span className="text-xs text-slate-400">
                            {showTotal(total, [(current - 1) * pageSize + 1, Math.min(current * pageSize, total)])}
                        </span>
                    ) : (
                        <span className="text-xs text-slate-400 font-light">
                            {`${(current - 1) * pageSize + 1}-${Math.min(current * pageSize, total)} / ${total}`}
                        </span>
                    )}
                </div>

                <div className="flex items-center gap-2">
                    {showSizeChanger && (
                        <select
                            value={pageSize}
                            onChange={handlePageSizeChange}
                            className="h-8 px-2 bg-transparent border-0 text-slate-400 dark:text-slate-500 text-xs focus:outline-none hover:text-emerald-500 dark:hover:text-emerald-400 cursor-pointer font-medium"
                        >
                            <option value={10}>10</option>
                            <option value={20}>20</option>
                            <option value={50}>50</option>
                        </select>
                    )}

                    <div className="flex items-center gap-1 bg-slate-100/50 dark:bg-slate-800/50 p-1 rounded-full">
                        <button
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
                            disabled={current >= totalPages}
                            onClick={() => handlePageChange(current + 1)}
                            className="h-8 w-8 flex items-center justify-center rounded-full text-slate-500 dark:text-slate-400 hover:text-emerald-600 dark:hover:text-emerald-400 hover:bg-white dark:hover:bg-slate-700 hover:shadow-sm disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:shadow-none transition-all duration-200"
                        >
                            <LeftOutlined className="text-xs" />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
