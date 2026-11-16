"use client";

import {
  displayCell,
  fieldValue,
  filterAndSort,
  indexTableRows,
  visiblePage,
} from "@/shared/table/data";
import {
  CloseCircleFilled,
  EyeOutlined,
  SearchOutlined,
  SortAscendingOutlined,
  SortDescendingOutlined,
  TableOutlined,
} from "@ant-design/icons";
import clsx from "clsx";
import { toPersianDigits } from "@/shared/utils/digits";
import {
  isValidElement,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import Pagination from "./Pagination";
import GreenhouseButton from "./GreenhouseButton";

export interface Column<T extends object> {
  title: string;
  dataIndex?: string;
  key: string;
  width?: number;
  align?: "left" | "right" | "center";
  fixed?: "left" | "right";
  responsive?: string[];
  sortable?: boolean;
  searchable?: boolean;
  render?: {
    render(value: unknown, record: T, index: number): ReactNode;
  }["render"];
  className?: string;
}

export function detailsColumn<T extends object>(
  onOpen: (record: T) => void,
): Column<T> {
  return {
    key: "details",
    title: "جزئیات",
    width: 80,
    align: "center",
    render: (_, record) => (
      <GreenhouseButton
        onClick={() => onOpen(record)}
        title="مشاهده جزئیات"
        aria-label="مشاهده جزئیات"
        variant="soft"
        icon={<EyeOutlined />}
      />
    ),
  };
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

interface TableProps<T extends object> {
  columns: Column<T>[];
  dataSource: T[];
  rowKey: string | ((record: T) => string);
  loading?: boolean;
  pagination?: PaginationConfig | false;
  scroll?: { x?: number; y?: number };
  size?: "small" | "middle" | "large";
  rowClassName?: (record: T, index: number) => string;
  className?: string;
  onRow?: (
    record: T,
    index?: number,
  ) => { onClick?: () => void; onDoubleClick?: () => void };
}

const controlKeys = new Set(["actions", "action", "details", "qrcode"]);
const isControlColumn = (column: { key: string }) =>
  controlKeys.has(column.key.toLowerCase());

function getRenderedText(node: ReactNode): string {
  if (
    typeof node === "string" ||
    typeof node === "number" ||
    typeof node === "bigint"
  )
    return String(node);
  if (Array.isArray(node)) return node.map(getRenderedText).join(" ");
  if (isValidElement<{ children?: ReactNode }>(node))
    return getRenderedText(node.props.children);
  return "";
}

function renderCell<T extends object>(
  column: Column<T>,
  record: T,
  index: number,
) {
  const value = column.dataIndex
    ? fieldValue(record, column.dataIndex)
    : undefined;
  const content = column.render
    ? column.render(value, record, index)
    : displayCell(value);
  if (
    typeof content === "number" ||
    typeof content === "string" ||
    typeof content === "bigint"
  ) {
    return toPersianDigits(content);
  }
  return content;
}

const cellSizes = {
  small: "px-2 py-2 text-xs",
  middle: "px-3 py-2.5 text-sm",
  large: "px-4 py-3 text-base",
};
const columnAlignment = {
  left: "text-left",
  center: "text-center",
  right: "text-right",
};
const persianNumber = new Intl.NumberFormat("fa-IR");

export default function Table<T extends object>({
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
}: TableProps<T>) {
  const [searchText, setSearchText] = useState("");
  const [sortField, setSortField] = useState<string | null>(null);
  const [sortOrder, setSortOrder] = useState<"asc" | "desc" | null>(null);
  const [currentPage, setCurrentPage] = useState(
    pagination ? (pagination.current ?? 1) : 1,
  );
  const [pageSize, setPageSize] = useState(
    pagination ? (pagination.pageSize ?? 20) : 20,
  );
  const [availableWidth, setAvailableWidth] = useState(0);
  const tableContainer = useRef<HTMLDivElement>(null);
  const searchInput = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const container = tableContainer.current;
    if (!container) return;
    setAvailableWidth(container.clientWidth);
    const observer = new ResizeObserver(([entry]) =>
      setAvailableWidth(entry.contentRect.width),
    );
    observer.observe(container);
    return () => observer.disconnect();
  }, []);

  const dataColumns = columns.filter((column) => !isControlColumn(column));
  const controlColumns = columns.filter(isControlColumn);
  const sortableColumns = columns.filter(
    (column) => column.dataIndex && column.sortable !== false,
  );
  const minimumTableWidth = Math.max(
    460,
    scroll?.x ?? 0,
    columns.reduce(
      (width, column) =>
        width + (column.width ?? (isControlColumn(column) ? 86 : 100)),
      0,
    ),
  );
  const showCards = availableWidth < minimumTableWidth + 26;

  const hasSearch = Boolean(searchText.trim());
  const searchIndex = useMemo(() => {
    if (!hasSearch) return undefined;
    const renderedColumns = columns.filter(
      (column) =>
        column.render &&
        column.searchable !== false &&
        !isControlColumn(column),
    );
    return indexTableRows(dataSource, (row, index) =>
      renderedColumns.map((column) =>
        getRenderedText(renderCell(column, row, index)),
      ),
    );
  }, [columns, dataSource, hasSearch]);
  const processedData = useMemo(
    () =>
      filterAndSort(dataSource, searchText, sortField, sortOrder, searchIndex),
    [dataSource, searchText, sortField, sortOrder, searchIndex],
  );
  const effectivePage = visiblePage(
    currentPage,
    processedData.length,
    pageSize,
  );
  const paginatedData =
    pagination === false
      ? processedData
      : processedData.slice(
          (effectivePage - 1) * pageSize,
          effectivePage * pageSize,
        );

  const changeSearch = (text: string) => {
    setSearchText(text);
    setCurrentPage(1);
  };

  const handleSort = (field: string) => {
    if (sortField !== field) {
      setSortField(field);
      setSortOrder("asc");
    } else if (sortOrder === "asc") {
      setSortOrder("desc");
    } else {
      setSortField(null);
      setSortOrder(null);
    }
    setCurrentPage(1);
  };

  const getRowKey = (record: T, index: number) =>
    typeof rowKey === "function"
      ? rowKey(record)
      : String(fieldValue(record, rowKey) ?? index);

  return (
    <div
      ref={tableContainer}
      className={clsx("min-w-0 w-full pb-5 sm:pb-8", className)}
    >
      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-700 dark:bg-slate-900">
        <div className="flex flex-wrap items-center gap-2.5 border-b border-slate-200/70 bg-slate-50/80 px-3 py-2.5 sm:px-4 dark:border-slate-700/70 dark:bg-slate-800/65">
          <div className="relative min-w-0 flex-[1_1_14rem] sm:max-w-sm">
            <SearchOutlined className="pointer-events-none absolute start-3 top-1/2 -translate-y-1/2 text-slate-500 dark:text-slate-400" />
            <input
              ref={searchInput}
              type="text"
              aria-label="جست‌وجو در همهٔ فیلدها"
              placeholder="جست‌وجو در همهٔ فیلدها…"
              value={searchText}
              onChange={(event) => changeSearch(event.target.value)}
              className="h-10 w-full rounded-lg border border-slate-200 bg-white ps-9 pe-9 text-sm outline-none placeholder:text-slate-500 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/15 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100 dark:placeholder:text-slate-400"
            />
            {searchText && (
              <GreenhouseButton
                aria-label="پاک کردن جست‌وجو"
                onClick={() => {
                  changeSearch("");
                  searchInput.current?.focus();
                }}
                className="absolute end-1 top-1/2 size-8 -translate-y-1/2"
                variant="ghost"
                icon={<CloseCircleFilled />}
              />
            )}
          </div>
          {showCards && sortableColumns.length > 0 && (
            <div className="flex min-w-0 items-center gap-1">
              <select
                value={sortField ?? ""}
                aria-label="مرتب‌سازی بر اساس"
                onChange={(event) => {
                  setSortField(event.target.value || null);
                  setSortOrder(event.target.value ? "asc" : null);
                  setCurrentPage(1);
                }}
                className="h-9 min-w-0 max-w-40 truncate rounded-lg border border-slate-200 bg-white px-2 text-xs text-slate-700 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200"
              >
                <option value="">مرتب‌سازی</option>
                {sortableColumns.map((column) => (
                  <option key={column.key} value={column.dataIndex}>
                    {column.title}
                  </option>
                ))}
              </select>
              {sortField && (
                <GreenhouseButton
                  onClick={() => {
                    setSortOrder(sortOrder === "asc" ? "desc" : "asc");
                    setCurrentPage(1);
                  }}
                  aria-label={
                    sortOrder === "asc" ? "مرتب‌سازی نزولی" : "مرتب‌سازی صعودی"
                  }
                  variant="soft"
                  icon={
                    sortOrder === "asc" ? (
                      <SortAscendingOutlined />
                    ) : (
                      <SortDescendingOutlined />
                    )
                  }
                />
              )}
            </div>
          )}
          {hasSearch && !loading && (
            <span
              role="status"
              className="text-xs text-slate-500 dark:text-slate-400"
            >
              {persianNumber.format(processedData.length)} نتیجه
            </span>
          )}
        </div>

        <div className="min-w-0 p-2.5 sm:p-3" aria-busy={loading}>
          {loading ? (
            <div
              role="status"
              className="flex flex-col items-center gap-3 py-10 text-sm text-slate-500 dark:text-slate-400"
            >
              <div className="size-9 animate-spin rounded-full border-2 border-slate-200 border-t-emerald-500 dark:border-slate-700 dark:border-t-emerald-400" />
              در حال بارگذاری…
            </div>
          ) : paginatedData.length === 0 ? (
            <div className="flex flex-col items-center gap-2 px-4 py-10 text-center">
              <TableOutlined className="rounded-xl bg-slate-100 p-3 text-lg text-slate-500 dark:bg-slate-800 dark:text-slate-400" />
              <p className="text-sm font-semibold text-slate-700 dark:text-slate-200">
                {hasSearch
                  ? "نتیجه‌ای برای جست‌وجو پیدا نشد"
                  : "داده‌ای برای نمایش وجود ندارد"}
              </p>
            </div>
          ) : showCards ? (
            <div className="table-card-grid grid gap-3">
              {paginatedData.map((record, index) => {
                const [primary, ...fields] = dataColumns;
                return (
                  <article
                    key={getRowKey(record, index)}
                    {...onRow?.(record, index)}
                    className={clsx(
                      "flex min-w-0 flex-col rounded-xl border border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-900",
                      rowClassName?.(record, index),
                    )}
                  >
                    {primary && (
                      <header className="min-w-0 rounded-t-xl border-b border-slate-200/70 bg-slate-50/80 px-3 py-2 dark:border-slate-700 dark:bg-slate-800/70">
                        <div className="text-xs text-slate-500 dark:text-slate-400">
                          {primary.title}
                        </div>
                        <div className="[overflow-wrap:anywhere] text-sm font-semibold text-slate-900 dark:text-slate-100">
                          {renderCell(primary, record, index)}
                        </div>
                      </header>
                    )}
                    {fields.length > 0 && (
                      <dl className="table-card-fields grid gap-x-3 gap-y-2.5 p-3">
                        {fields.map((column) => (
                          <div
                            key={column.key}
                            className="min-w-0 [overflow-wrap:anywhere]"
                          >
                            <dt className="text-xs text-slate-500 dark:text-slate-400">
                              {column.title}
                            </dt>
                            <dd className="mt-0.5 text-sm text-slate-700 dark:text-slate-200">
                              {renderCell(column, record, index)}
                            </dd>
                          </div>
                        ))}
                      </dl>
                    )}
                    {controlColumns.length > 0 && (
                      <div
                        role="group"
                        aria-label="عملیات رکورد"
                        className="mt-auto flex flex-wrap items-center gap-2 border-t border-slate-100 px-3 py-2 dark:border-slate-800"
                      >
                        {controlColumns.map((column) => (
                          <div key={column.key} className="min-w-0">
                            {renderCell(column, record, index)}
                          </div>
                        ))}
                      </div>
                    )}
                  </article>
                );
              })}
            </div>
          ) : (
            <div
              role="region"
              aria-label="جدول داده‌ها"
              tabIndex={0}
              className="min-w-0 max-w-full overflow-auto overscroll-x-contain rounded-lg border border-slate-200/80 focus-visible:outline-emerald-500 dark:border-slate-700"
              style={{ maxHeight: scroll?.y }}
            >
              <table className="w-full" style={{ minWidth: scroll?.x }}>
                <thead className="sticky top-0 z-10 bg-slate-100 dark:bg-slate-800">
                  <tr>
                    {columns.map((column) => {
                      const field = column.dataIndex;
                      const active = field && sortField === field;
                      return (
                        <th
                          key={column.key}
                          scope="col"
                          aria-sort={
                            active
                              ? sortOrder === "asc"
                                ? "ascending"
                                : "descending"
                              : undefined
                          }
                          className={clsx(
                            cellSizes[size],
                            "font-semibold text-slate-700 dark:text-slate-200",
                            columnAlignment[column.align ?? "right"],
                          )}
                          style={{ width: column.width }}
                        >
                          {field && column.sortable !== false ? (
                            <GreenhouseButton
                              onClick={() => handleSort(field)}
                              variant="ghost"
                              className="h-auto max-w-full px-1 py-1 text-start text-inherit [overflow-wrap:anywhere]"
                            >
                              {column.title}
                              {active && sortOrder === "desc" ? (
                                <SortDescendingOutlined className="shrink-0 text-emerald-600 dark:text-emerald-300" />
                              ) : (
                                <SortAscendingOutlined
                                  className={clsx(
                                    "shrink-0",
                                    active
                                      ? "text-emerald-600 dark:text-emerald-300"
                                      : "text-slate-400 dark:text-slate-500",
                                  )}
                                />
                              )}
                            </GreenhouseButton>
                          ) : (
                            column.title
                          )}
                        </th>
                      );
                    })}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {paginatedData.map((record, index) => (
                    <tr
                      key={getRowKey(record, index)}
                      {...onRow?.(record, index)}
                      className={clsx(
                        "bg-white transition-colors hover:bg-emerald-50/40 dark:bg-slate-900 dark:hover:bg-emerald-950/35",
                        rowClassName?.(record, index),
                      )}
                    >
                      {columns.map((column) => (
                        <td
                          key={column.key}
                          className={clsx(
                            cellSizes[size],
                            "align-middle [overflow-wrap:anywhere] text-slate-700 dark:text-slate-300",
                            columnAlignment[column.align ?? "right"],
                            column.className,
                          )}
                        >
                          {renderCell(column, record, index)}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {pagination !== false && (
          <Pagination
            current={effectivePage}
            total={processedData.length}
            pageSize={pageSize}
            onChange={(page, size) => {
              setCurrentPage(page);
              setPageSize(size);
              pagination.onChange?.(page, size);
            }}
            showSizeChanger={pagination.showSizeChanger}
            showTotal={pagination.showTotal}
          />
        )}
      </div>
    </div>
  );
}
