"use client";
import React, { useState, useMemo, useEffect } from "react";
import { SearchOutlined, SortAscendingOutlined, SortDescendingOutlined, TableOutlined, LeftOutlined, RightOutlined } from "@ant-design/icons";
import GreenhouseButton from "@/shared/components/GreenhouseButton";
import Pagination from "./Pagination";

interface Column {
  title: string;
  dataIndex?: string; // Make dataIndex optional
  key: string;
  width?: number;
  fixed?: "left" | "right";
  responsive?: string[];
  sortable?: boolean;
  searchable?: boolean;
  render?: (value: any, record: any, index: number) => React.ReactNode;
  className?: string;
}

interface PaginationConfig {
  current?: number;
  pageSize?: number;
  total?: number;
  showSizeChanger?: boolean;
  showQuickJumper?: boolean;
  showTotal?: (total: number, range: [number, number]) => string;
  onChange?: (page: number, pageSize: number) => void;
}

interface TableProps {
  columns: Column[];
  dataSource: any[];
  rowKey: string | ((record: any) => string);
  loading?: boolean;
  pagination?: PaginationConfig | false;
  scroll?: { x?: number; y?: number };
  size?: "small" | "middle" | "large";
  rowClassName?: (record: any, index: number) => string;
  className?: string;
  onRow?: (record: any, index?: number) => { onClick?: () => void; onDoubleClick?: () => void };
}

export default function Table({
  columns,
  dataSource,
  rowKey,
  loading = false,
  pagination = {},
  scroll,
  size = "middle",
  rowClassName,
  className,
  onRow,
}: TableProps) {
  const [searchText, setSearchText] = useState("");
  const [sortField, setSortField] = useState<string | null>(null);
  const [sortOrder, setSortOrder] = useState<"asc" | "desc" | null>(null);
  const [currentPage, setCurrentPage] = useState(
    pagination && typeof pagination === "object" ? pagination.current || 1 : 1
  );
  const [pageSize, setPageSize] = useState(
    pagination && typeof pagination === "object" ? pagination.pageSize || 10 : 10
  );
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // Filter and sort data
  const processedData = useMemo(() => {
    let filtered = dataSource;

    // Search filtering
    if (searchText) {
      filtered = dataSource.filter((record) =>
        columns.some((col) => {
          if (col.searchable !== false && col.dataIndex) {
            const value = record[col.dataIndex];
            return value?.toString().toLowerCase().includes(searchText.toLowerCase());
          }
          return false;
        })
      );
    }

    // Sorting
    if (sortField && sortOrder) {
      filtered = [...filtered].sort((a, b) => {
        const aVal = a[sortField];
        const bVal = b[sortField];
        if (sortOrder === "asc") {
          return aVal > bVal ? 1 : -1;
        } else {
          return aVal < bVal ? 1 : -1;
        }
      });
    }

    return filtered;
  }, [dataSource, searchText, sortField, sortOrder, columns]);

  // Pagination
  const paginatedData = useMemo(() => {
    if (pagination === false) return processedData;
    const start = (currentPage - 1) * pageSize;
    return processedData.slice(start, start + pageSize);
  }, [processedData, currentPage, pageSize, pagination]);

  const handleSort = (field: string) => {
    if (sortField === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : sortOrder === "desc" ? null : "asc");
      if (sortOrder === "desc") setSortField(null);
    } else {
      setSortField(field);
      setSortOrder("asc");
    }
  };

  const getRowKey = (record: any, index: number) => {
    return typeof rowKey === "function" ? rowKey(record) : record[rowKey] || index;
  };

  const renderCard = (record: any, index: number) => {
    const key = getRowKey(record, index);
    const rowClass = rowClassName ? rowClassName(record, index) : "";
    const rowEvents = onRow ? onRow(record, index) : {};

    return (
      <div
        key={key}
        className={`bg-white border border-slate-200 rounded-lg p-3 hover:shadow-md hover:border-slate-300 transition-all duration-200 ${rowClass}`}
        {...rowEvents}
      >
        <div className="space-y-2">
          {columns.map((column) => {
            if (column.dataIndex || column.render) {
              const value = column.dataIndex ? record[column.dataIndex] : undefined;
              return (
                <div key={column.key} className="flex justify-between items-center">
                  <span className="text-xs text-slate-500 font-medium">{column.title}:</span>
                  <span className="text-sm text-slate-900 font-medium">
                    {column.render ? column.render(value, record, index) : value || "-"}
                  </span>
                </div>
              );
            }
            return null;
          })}
        </div>
      </div>
    );
  };

  const renderMobileCard = (record: any, index: number) => {
    const key = getRowKey(record, index);
    const rowClass = rowClassName ? rowClassName(record, index) : "";
    const rowEvents = onRow ? onRow(record, index) : {};

    return (
      <div
        key={key}
        className={`bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl p-4 hover:shadow-lg hover:border-slate-300 dark:hover:border-slate-600 transition-all duration-300 hover:-translate-y-1 ${rowClass}`}
        {...rowEvents}
      >
        {/* Card Header - اول دو field مهم */}
        <div className="mb-3 pb-3 border-b border-slate-100 dark:border-slate-800">
          {columns.slice(0, 2).map((column) => {
            if (column.dataIndex || column.render) {
              const value = column.dataIndex ? record[column.dataIndex] : undefined;
              return (
                <div key={column.key} className="mb-2 last:mb-0">
                  <div className="text-xs font-medium text-slate-500 dark:text-slate-400 mb-1">{column.title}</div>
                  <div className="text-base font-semibold text-slate-900 dark:text-slate-200">
                    {column.render ? column.render(value, record, index) : value || "-"}
                  </div>
                </div>
              );
            }
            return null;
          })}
        </div>

        {/* Card Body - بقیه fields */}
        <div className="grid grid-cols-2 gap-3">
          {columns.slice(2).map((column) => {
            if (column.dataIndex || column.render) {
              const value = column.dataIndex ? record[column.dataIndex] : undefined;
              return (
                <div key={column.key} className="space-y-1">
                  <div className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wide">{column.title}</div>
                  <div className="text-sm text-slate-700 dark:text-slate-300 font-medium">
                    {column.render ? column.render(value, record, index) : value || "-"}
                  </div>
                </div>
              );
            }
            return null;
          })}
        </div>
      </div>
    );
  };

  const sizeClasses = {
    small: "text-xs",
    middle: "text-sm",
    large: "text-base",
  };

  const paddingClasses = {
    small: "px-2 py-1.5",
    middle: "px-3 py-2",
    large: "px-4 py-3",
  };

  // Soft professional styling
  const rowBase =
    "transition-all duration-200 group even:bg-slate-50/40 dark:even:bg-slate-800/40 odd:bg-white dark:odd:bg-slate-900 hover:bg-emerald-50/40 dark:hover:bg-emerald-900/20 hover:shadow-[0_1px_4px_rgba(16,185,129,0.08)]";
  const cellBase = "relative transition-colors duration-200";

  return (
    <div className={`w-full ${className}`}>
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-br-xl rounded-bl-xl shadow-sm overflow-hidden transition-colors duration-300">
        {/* Soft Header */}
        <div className="px-4 py-3 bg-gradient-to-r from-slate-50/80 to-slate-100/80 dark:from-slate-800/80 dark:to-slate-900/80 border-b border-slate-200/60 dark:border-slate-700/60 transition-colors">
          <div className="flex items-center justify-between gap-3">
            <div className="relative flex-1 max-w-sm">
              <SearchOutlined className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500" />
              <input
                type="text"
                placeholder="جستجو در داده‌ها..."
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
                className="w-full h-10 pr-10 pl-4 bg-white/90 dark:bg-slate-950/80 border-2 border-slate-200 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-300/60 focus:border-emerald-300 dark:focus:border-emerald-600 transition-all placeholder:text-slate-400 dark:placeholder:text-slate-600 text-sm shadow-sm dark:text-slate-200"
              />
            </div>
            <div className="flex items-center gap-3">
              {sortField && (
                <div className="px-2 py-1 bg-emerald-500/90 text-white text-xs rounded-md flex items-center gap-1">
                  {sortOrder === "asc" ? <SortAscendingOutlined /> : <SortDescendingOutlined />}
                  <span className="hidden sm:inline">{columns.find((c) => c.dataIndex === sortField)?.title}</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-4">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-12 gap-3">
              <div className="relative">
                <div className="h-12 w-12 rounded-full border-3 border-slate-200 dark:border-slate-700"></div>
                <div className="absolute inset-0 h-12 w-12 rounded-full border-3 border-emerald-300 border-t-transparent animate-spin"></div>
              </div>
              <span className="text-slate-600 dark:text-slate-400 font-medium">در حال بارگذاری...</span>
            </div>
          ) : paginatedData.length === 0 ? (
            <div className="flex flex-col items-center gap-4 py-12">
              <div className="h-16 w-16 rounded-2xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
                <TableOutlined className="text-slate-400 dark:text-slate-500 text-2xl" />
              </div>
              <div className="text-center">
                <h3 className="text-slate-800 dark:text-slate-200 font-semibold mb-1">هیچ داده‌ای یافت نشد</h3>
                <p className="text-slate-500 dark:text-slate-400 text-sm">فیلترها را بررسی کنید یا جستجوی جدید انجام دهید</p>
              </div>
            </div>
          ) : (
            <>
              {isMobile ? (
                <div className="space-y-4">{paginatedData.map((record, index) => renderMobileCard(record, index))}</div>
              ) : (
                <div
                  className="bg-white dark:bg-slate-900 rounded-lg border border-slate-200/60 dark:border-slate-700/60 custom-scrollbar transition-colors"
                  style={{
                    overflowX: scroll?.x ? "auto" : "visible",
                    overflowY: scroll?.y ? "auto" : "visible",
                    maxHeight: scroll?.y,
                  }}
                >
                  <style jsx>{`
                    .custom-scrollbar::-webkit-scrollbar {
                      height: 6px;
                      width: 6px;
                    }
                    .custom-scrollbar::-webkit-scrollbar-track {
                      background: #f1f5f9;
                      border-radius: 3px;
                    }
                    .custom-scrollbar::-webkit-scrollbar-thumb {
                      background: #cbd5e1;
                      border-radius: 3px;
                    }
                    .custom-scrollbar::-webkit-scrollbar-thumb:hover {
                      background: #94a3b8;
                    }
                    .custom-scrollbar {
                      scrollbar-width: thin;
                      scrollbar-color: #cbd5e1 #f1f5f9;
                    }
                    /* Dark Mode Scrollbar */
                    :global(.dark) .custom-scrollbar::-webkit-scrollbar-track {
                         background: #1e293b;
                    }
                    :global(.dark) .custom-scrollbar::-webkit-scrollbar-thumb {
                         background: #475569;
                    }
                    :global(.dark) .custom-scrollbar::-webkit-scrollbar-thumb:hover {
                         background: #64748b;
                    }
                    :global(.dark) .custom-scrollbar {
                         scrollbar-color: #475569 #1e293b;
                    }
                  `}</style>
                  <table className="w-full" style={{ minWidth: scroll?.x, tableLayout: "auto" }}>
                    <thead className="sticky top-0 z-10">
                      <tr className="bg-gradient-to-r from-slate-100/70 to-slate-50/70 dark:from-slate-800 dark:to-slate-800 border-b border-slate-200/60 dark:border-slate-700/60 transition-colors">
                        {columns.map((column) => (
                          <th
                            key={column.key}
                            className={`${paddingClasses[size]} text-right font-semibold text-slate-700 dark:text-slate-300 ${sizeClasses[size]} relative whitespace-nowrap`}
                            style={{ width: column.width }}
                          >
                            <div className="flex items-center justify-between gap-2">
                              <span className="relative truncate max-w-[200px]" title={column.title}>
                                {column.title}
                                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-emerald-300 transition-all duration-200 group-hover:w-full"></span>
                              </span>
                              {column.sortable !== false && column.dataIndex && (
                                <button
                                  onClick={() => handleSort(column.dataIndex!)}
                                  className="p-1.5 hover:bg-emerald-50 dark:hover:bg-emerald-900/30 rounded-md transition-all duration-200 hover:scale-105 flex-shrink-0"
                                >
                                  {sortField === column.dataIndex ? (
                                    sortOrder === "asc" ? (
                                      <SortAscendingOutlined className="text-emerald-500" />
                                    ) : (
                                      <SortDescendingOutlined className="text-emerald-500" />
                                    )
                                  ) : (
                                    <SortAscendingOutlined className="text-slate-400 dark:text-slate-500 hover:text-emerald-500 dark:hover:text-emerald-400" />
                                  )}
                                </button>
                              )}
                            </div>
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {paginatedData.map((record, index) => {
                        const key = getRowKey(record, index);
                        const rowClass = rowClassName ? rowClassName(record, index) : "";
                        const rowEvents = onRow ? onRow(record, index) : {};

                        return (
                          <tr
                            key={key}
                            className={`${rowBase} border-b border-slate-100/60 dark:border-slate-800/60 ${rowClass}`}
                            {...rowEvents}
                          >
                            {columns.map((column, colIdx) => (
                              <td
                                key={column.key}
                                className={`${paddingClasses[size]} ${sizeClasses[size]} ${cellBase} text-slate-600 dark:text-slate-400 ${colIdx === 0
                                  ? "font-semibold text-emerald-600 dark:text-emerald-400"
                                  : colIdx === columns.length - 1
                                    ? "text-right"
                                    : ""
                                  }`}
                              >
                                <span className="block truncate">
                                  {column.render
                                    ? column.render(
                                      column.dataIndex ? record[column.dataIndex] : undefined,
                                      record,
                                      index
                                    )
                                    : column.dataIndex
                                      ? record[column.dataIndex] || "-"
                                      : "-"}
                                </span>
                              </td>
                            ))}
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </>
          )}
        </div>

        {/* Soft Pagination */}
        {pagination !== false && (
          <Pagination
            current={currentPage}
            total={processedData.length}
            pageSize={pageSize}
            onChange={(page, size) => {
              setCurrentPage(page);
              setPageSize(size);
              if (pagination && typeof pagination === "object" && pagination.onChange) {
                pagination.onChange(page, size);
              }
            }}
            showSizeChanger={pagination && typeof pagination === "object" ? pagination.showSizeChanger : true}
            showTotal={pagination && typeof pagination === "object" ? pagination.showTotal : undefined}
          />
        )}
      </div>
    </div>
  );
}
