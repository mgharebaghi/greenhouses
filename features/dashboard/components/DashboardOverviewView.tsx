import {
  AlertOutlined,
  ApartmentOutlined,
  ArrowLeftOutlined,
  BarChartOutlined,
  ClockCircleOutlined,
  ExperimentOutlined,
  FieldTimeOutlined,
  GatewayOutlined,
  InboxOutlined,
  ProfileOutlined,
  RetweetOutlined,
  ShoppingCartOutlined,
  ToolOutlined,
} from "@ant-design/icons";
import NavigationLink from "@/shared/components/NavigationLink";
import type { ReactNode } from "react";
import { formatPersianDate } from "@/shared/dates/calendar";
import { toPersianDigits } from "@/shared/utils/digits";
import type {
  DashboardRange,
  DashboardOverview,
  ProductionStage,
} from "../types";
import OrderActivityChart from "./OrderActivityChart";
import RefreshDashboard from "./RefreshDashboard";
import DashboardRangeSelector from "./DashboardRangeSelector";
import { ChartModeProvider } from "./ChartMode";
import DashboardLinkIndicator from "./DashboardLinkIndicator";

const number = new Intl.NumberFormat("fa-IR");
const panel =
  "min-w-0 rounded-2xl border border-(--ui-border) bg-(--ui-panel) shadow-sm";
const muted = "text-sm text-(--ui-muted-text)";
const focus =
  "outline-offset-4 focus-visible:outline-2 focus-visible:outline-emerald-600";
const stages = [
  {
    key: "order",
    label: "ثبت سفارش",
    href: "/dashboard/orders",
    Icon: ShoppingCartOutlined,
  },
  {
    key: "planting",
    label: "کاشت بذور",
    href: "/dashboard/seed-planting",
    Icon: ExperimentOutlined,
  },
  {
    key: "seedling",
    label: "سیکل نشاء",
    href: "/dashboard/start-seedling-cycle",
    Icon: RetweetOutlined,
  },
  {
    key: "grafting",
    label: "پیوندزنی",
    href: "/dashboard/grafting",
    Icon: ToolOutlined,
  },
] as const;

const orderStage: Record<ProductionStage, [label: string, color: string]> = {
  order: [
    "ثبت سفارش",
    "bg-slate-100 text-slate-700 dark:bg-slate-700 dark:text-slate-200",
  ],
  planting: [
    "کاشت",
    "bg-cyan-50 text-cyan-800 dark:bg-cyan-950 dark:text-cyan-200",
  ],
  seedling: [
    "سیکل نشاء",
    "bg-teal-50 text-teal-800 dark:bg-teal-950 dark:text-teal-200",
  ],
  grafting: [
    "پیوندزنی",
    "bg-emerald-50 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-200",
  ],
};

function PanelHeader({
  title,
  icon,
  description,
  children,
}: {
  title: string;
  icon: ReactNode;
  description?: string;
  children?: ReactNode;
}) {
  return (
    <header className="mb-4 flex flex-wrap items-start justify-between gap-2.5">
      <div className="flex min-w-0 items-start gap-2.5">
        <span
          aria-hidden="true"
          className="grid size-9 shrink-0 place-items-center rounded-xl bg-(--button-tint) text-base text-(--button-accent)"
        >
          {icon}
        </span>
        <div className="min-w-0 self-center">
          <h2 className="text-lg font-bold tracking-tight">{title}</h2>
          {description && <p className={`mt-1 ${muted}`}>{description}</p>}
        </div>
      </div>
      {children}
    </header>
  );
}

function Metric({
  label,
  detail,
  value,
  href,
  icon,
  tone,
}: {
  label: string;
  detail: string;
  value: number;
  href: string;
  icon: ReactNode;
  tone: string;
}) {
  return (
    <NavigationLink
      href={href}
      className={`${panel} ${focus} group flex flex-col gap-2 p-3 text-(--ui-text)! transition-colors hover:border-emerald-500/60 sm:p-4`}
    >
      <div className="flex items-start gap-2 sm:gap-3">
        <span
          className={`grid size-9 shrink-0 place-items-center rounded-xl text-base ${tone}`}
        >
          <DashboardLinkIndicator>{icon}</DashboardLinkIndicator>
        </span>
        <div className="min-w-0 flex-1">
          <div className="text-[11px] font-semibold text-(--ui-muted-text) sm:text-sm">
            {label}
          </div>
          <div className="mt-0.5 wrap-break-word text-xl font-bold tabular-nums sm:text-[1.85rem]">
            {number.format(value)}
          </div>
        </div>
        <ArrowLeftOutlined
          aria-hidden="true"
          className="mt-1 hidden text-xs text-(--ui-muted-text) group-hover:text-emerald-600 sm:inline-block dark:group-hover:text-emerald-300"
        />
      </div>
      <div className="text-[11px] leading-5 text-(--ui-muted-text)">
        {detail}
      </div>
    </NavigationLink>
  );
}

function Production({ overview }: { overview: DashboardOverview }) {
  return (
    <section className={`${panel} p-4 sm:p-5`}>
      <PanelHeader
        title="جریان تولید"
        icon={<ApartmentOutlined />}
        description="تعداد ثبت‌ها در بازهٔ انتخابی"
      />
      <ol className="grid gap-2">
        {stages.map(({ key, label, href, Icon }) => (
          <li key={key}>
            <NavigationLink
              href={href}
              className={`${focus} flex items-center gap-3 rounded-xl border border-transparent bg-(--ui-muted-panel) px-3 py-2.5 text-(--ui-text)! transition-colors hover:border-emerald-500/50`}
            >
              <span
                aria-hidden="true"
                className="grid size-8 shrink-0 place-items-center rounded-lg bg-(--button-tint) text-(--button-accent)"
              >
                <Icon />
              </span>
              <span className="min-w-0 flex-1 text-sm font-semibold">
                {label}
              </span>
              <span className="text-base font-bold tabular-nums">
                {number.format(overview.stages[key])}
              </span>
              <DashboardLinkIndicator>
                <ArrowLeftOutlined className="text-[10px] text-(--ui-muted-text)" />
              </DashboardLinkIndicator>
            </NavigationLink>
          </li>
        ))}
      </ol>
    </section>
  );
}

function RecentOrders({
  orders,
}: {
  orders: DashboardOverview["recentOrders"];
}) {
  return (
    <section className={`${panel} p-4 sm:p-5`}>
      <PanelHeader
        title="سفارش‌های اخیر"
        icon={<ProfileOutlined />}
        description="آخرین مرحلهٔ ثبت‌شده برای هر سفارش"
      >
        <NavigationLink
          href="/dashboard/orders"
          className={`${focus} inline-flex items-center gap-1.5 rounded-md px-1 py-1 text-xs font-bold text-(--button-accent)!`}
        >
          همهٔ سفارش‌ها{" "}
          <DashboardLinkIndicator>
            <ArrowLeftOutlined className="text-[10px]" />
          </DashboardLinkIndicator>
        </NavigationLink>
      </PanelHeader>
      {orders.length ? (
        <div className="sm:overflow-hidden sm:rounded-xl sm:border sm:border-(--ui-border)">
          <table
            role="table"
            aria-label="سفارش‌های اخیر"
            className="block w-full text-start text-sm sm:table"
          >
            <thead className="sr-only bg-(--ui-muted-panel) text-xs text-(--ui-muted-text) sm:not-sr-only">
              <tr>
                {["سفارش", "مشتری", "تعداد", "مرحله"].map((label) => (
                  <th
                    key={label}
                    scope="col"
                    className="px-3 py-2 text-start font-semibold"
                  >
                    {label}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="grid gap-2 sm:table-row-group">
              {orders.map((order) => {
                const [label, color] = orderStage[order.stage];
                return (
                  <tr
                    key={order.id}
                    className="grid grid-cols-[minmax(0,1fr)_auto] items-start gap-x-2 gap-y-2 rounded-xl border border-(--ui-border) p-3 sm:table-row sm:rounded-none sm:border-x-0 sm:border-b-0 sm:p-0"
                  >
                    <td className="min-w-0 wrap-break-word sm:px-3 sm:py-2.5">
                      <bdi className="font-semibold">
                        {order.code
                          ? toPersianDigits(order.code)
                          : `#${number.format(order.id)}`}
                      </bdi>
                      <time
                        className="mt-0.5 block text-[11px] text-(--ui-muted-text)"
                        dateTime={order.date}
                      >
                        {formatPersianDate(order.date, { format: "D MMMM" })}
                      </time>
                    </td>
                    <td className="min-w-0 wrap-break-word max-sm:order-2 sm:px-3 sm:py-2.5">
                      <span className="mb-0.5 block text-[10px] text-(--ui-muted-text) sm:hidden">
                        مشتری
                      </span>
                      {order.customer || "—"}
                    </td>
                    <td className="tabular-nums max-sm:order-3 max-sm:text-end sm:px-3 sm:py-2.5">
                      <span className="mb-0.5 block text-[10px] text-(--ui-muted-text) sm:hidden">
                        تعداد
                      </span>
                      {order.quantity == null
                        ? "—"
                        : number.format(order.quantity)}
                    </td>
                    <td className="max-sm:order-1 max-sm:text-end sm:px-3 sm:py-2.5">
                      <span
                        className={`inline-block rounded-md px-2 py-1 text-xs font-semibold ${color}`}
                      >
                        {label}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      ) : (
        <p className="rounded-xl bg-(--ui-muted-panel) px-4 py-6 text-center text-sm text-(--ui-muted-text)">
          در بازهٔ انتخابی سفارشی وجود ندارد.
        </p>
      )}
    </section>
  );
}

function FollowUps({ overview }: { overview: DashboardOverview }) {
  const items = [
    {
      label: "سفارش‌های بدون کاشت",
      detail: "در بازهٔ انتخابی",
      value: overview.ordersWithoutPlanting,
      href: "/dashboard/seed-planting",
      Icon: FieldTimeOutlined,
    },
    {
      label: "بسته‌های نزدیک انقضا",
      detail: "تا ۳۰ روز آینده",
      value: overview.expiringPackages,
      href: "/dashboard/seed-package",
      Icon: ClockCircleOutlined,
    },
    {
      label: "بسته‌های منقضی‌شده",
      detail: "بر اساس تاریخ انقضای ثبت‌شده",
      value: overview.expiredPackages,
      href: "/dashboard/seed-package",
      Icon: AlertOutlined,
    },
  ];

  return (
    <section className={`${panel} p-4 sm:p-5`}>
      <PanelHeader title="نیازمند پیگیری" icon={<AlertOutlined />} />
      <ul className="divide-y divide-(--ui-border)">
        {items.map(({ label, detail, value, href, Icon }) => (
          <li key={label}>
            <NavigationLink
              href={href}
              className={`${focus} flex items-center gap-3 rounded-lg px-1 py-3 text-(--ui-text)! transition-colors hover:bg-(--ui-muted-panel)`}
            >
              <span
                aria-hidden="true"
                className={`grid size-8 shrink-0 place-items-center rounded-lg ${value > 0 ? "bg-amber-100 text-amber-900 dark:bg-amber-950 dark:text-amber-200" : "bg-(--ui-muted-panel) text-(--ui-muted-text)"}`}
              >
                <Icon />
              </span>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-semibold">{label}</p>
                <p className="mt-0.5 text-xs text-(--ui-muted-text)">
                  {detail}
                </p>
              </div>
              <span className="text-base font-bold tabular-nums">
                {number.format(value)}
              </span>
              <DashboardLinkIndicator>
                <ArrowLeftOutlined className="text-[10px] text-(--ui-muted-text)" />
              </DashboardLinkIndicator>
            </NavigationLink>
          </li>
        ))}
      </ul>
    </section>
  );
}

export default function DashboardOverviewView({
  children,
  range,
  today,
}: {
  children: ReactNode;
  range: DashboardRange;
  today: string;
}) {
  const end = formatPersianDate(range.end, { format: "D MMMM YYYY" });
  const rangeLabel = range.start
    ? formatPersianDate(range.start, { format: "D MMMM YYYY" }) + " تا " + end
    : "همهٔ رکوردهای تاریخ‌دار تا " + end;
  return (
    <div className="mx-auto grid w-full max-w-[1480px] gap-5 px-3 py-4 text-(--ui-text) sm:gap-6 sm:px-6 sm:py-6 lg:px-8">
      <section aria-label="شاخص‌های کلیدی">
        <header className="mb-3 flex flex-wrap items-center justify-between gap-2.5">
          <div>
            <h2 className="text-xl font-bold tracking-tight">شاخص‌های کلیدی</h2>
            <p className={`mt-1 ${muted}`}>{rangeLabel}</p>
          </div>
          <DashboardRangeSelector range={range} today={today} />
        </header>
        <ChartModeProvider>{children}</ChartModeProvider>
      </section>
    </div>
  );
}

export function DashboardOverviewData({
  overview,
}: {
  overview: DashboardOverview | null;
}) {
  if (!overview) {
    return (
      <div
        role="alert"
        className={`${panel} flex flex-wrap items-center gap-3 p-4 sm:p-5`}
      >
        <InboxOutlined aria-hidden="true" className="text-(--ui-muted-text)" />
        <p className="min-w-0 flex-1 text-sm">دریافت آمار داشبورد انجام نشد.</p>
        <RefreshDashboard />
      </div>
    );
  }

  return (
    <div className="grid gap-4 sm:gap-5">
      <div className="grid grid-cols-2 gap-2.5 sm:gap-4 lg:grid-cols-4">
        <Metric
          label="سفارش‌های ثبت‌شده"
          detail="در بازهٔ انتخابی"
          value={overview.stages.order}
          href="/dashboard/orders"
          icon={<ShoppingCartOutlined />}
          tone="bg-emerald-100 text-emerald-900 dark:bg-emerald-950 dark:text-emerald-200"
        />
        <Metric
          label="بذرهای کاشته‌شده"
          detail="مجموع تعداد بذر در ثبت‌های کاشت"
          value={overview.plantedSeeds}
          href="/dashboard/seed-planting"
          icon={<ExperimentOutlined />}
          tone="bg-cyan-100 text-cyan-900 dark:bg-cyan-950 dark:text-cyan-200"
        />
        <Metric
          label="عملیات پیوندزنی"
          detail="در بازهٔ انتخابی"
          value={overview.stages.grafting}
          href="/dashboard/grafting"
          icon={<ToolOutlined />}
          tone="bg-teal-100 text-teal-900 dark:bg-teal-950 dark:text-teal-200"
        />
        <Metric
          label="گلخانه‌های فعال"
          detail="وضعیت فعلی گلخانه‌ها"
          value={overview.activeGreenhouses}
          href="/dashboard/greenhouse"
          icon={<GatewayOutlined />}
          tone="bg-lime-100 text-lime-900 dark:bg-lime-950 dark:text-lime-200"
        />
      </div>
      <div className="grid gap-4 lg:grid-cols-[minmax(0,1.73fr)_minmax(0,1fr)]">
        <section className={`${panel} p-4 sm:p-5`}>
          <PanelHeader
            title="روند ثبت سفارش‌ها"
            icon={<BarChartOutlined />}
            description="تعداد سفارش‌ها در بازهٔ انتخابی"
          />
          <OrderActivityChart buckets={overview.activity} />
        </section>
        <Production overview={overview} />
        <RecentOrders orders={overview.recentOrders} />
        <FollowUps overview={overview} />
      </div>
    </div>
  );
}
