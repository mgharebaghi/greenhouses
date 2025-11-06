import { IrrigationEvent } from "@/app/generated/prisma";
import dayjs from "dayjs";
import jalaliday from "jalaliday";
import TableActions from "../../_components/UI/TableActions";
import { UnorderedListOutlined } from "@ant-design/icons";
import { Tooltip } from "antd";
dayjs.extend(jalaliday);

type IrrigationColumnsProps = {
  handleEdit: (record: IrrigationEvent) => void;
  handleDelete: (record: IrrigationEvent) => void;
  handleViewCycles: (record: IrrigationEvent) => void;
};

type Column = {
  title: string;
  key: string;
  dataIndex?: string;
  render?: (value: any, record: any, index: number) => React.ReactNode;
  sortable?: boolean;
  className?: string;
};

export function IrrigationColumns(props: IrrigationColumnsProps): Column[] {
  const columns: Column[] = [
    {
      title: "گلخانه",
      key: "Greenhouses",
      render: (_: any, record: any) => record?.Zones?.Greenhouses?.GreenhouseName || "-",
    },
    {
      title: "سالن",
      key: "Zones",
      render: (_: any, record: any) => record?.Zones?.Name || "-",
    },
    {
      title: "زمان شروع",
      dataIndex: "StartTime",
      key: "StartTime",
      render: (date: string) => (date ? dayjs(date).calendar("jalali").locale("fa").format("YYYY/MM/DD HH:mm") : "-"),
    },
    {
      title: "زمان پایان",
      dataIndex: "EndTime",
      key: "EndTime",
      render: (date: string) => (date ? dayjs(date).calendar("jalali").locale("fa").format("YYYY/MM/DD HH:mm") : "-"),
    },
    {
      title: "حجم کل (لیتر)",
      dataIndex: "VolumeLiter",
      key: "VolumeLiter",
      render: (value: number) => value?.toFixed(2) || "-",
    },
    {
      title: "EC ورودی",
      dataIndex: "ECIn",
      key: "ECIn",
      render: (value: number) => value?.toFixed(2) || "-",
    },
    {
      title: "EC خروجی",
      dataIndex: "ECOut",
      key: "ECOut",
      render: (value: number) => value?.toFixed(2) || "-",
    },
    {
      title: "pH ورودی",
      dataIndex: "pHIn",
      key: "pHIn",
      render: (value: number) => value?.toFixed(2) || "-",
    },
    {
      title: "pH خروجی",
      dataIndex: "pHOut",
      key: "pHOut",
      render: (value: number) => value?.toFixed(2) || "-",
    },
    {
      title: "درصد زهکشی",
      dataIndex: "DrainPct",
      key: "DrainPct",
      render: (value: number) => value?.toFixed(2) || "-",
    },
    {
      title: "مدت کل (ثانیه)",
      dataIndex: "TotalDurationSeconds",
      key: "TotalDurationSeconds",
      render: (value: number) => value || "-",
    },
    {
      title: "نوع ماشه",
      dataIndex: "TriggerType",
      key: "TriggerType",
      render: (value: string) => value || "-",
    },
    {
      title: "میانگین جریان",
      dataIndex: "AvgFlowRate",
      key: "AvgFlowRate",
      render: (record: any) => record?.AvgFlowRate?.toFixed(2) || "-",
    },
    {
      title: "سیکل‌ها",
      key: "cycles",
      render: (_: any, record: any) => (
        <Tooltip title={`مشاهده ${record.IrrigationRecords?.length || 0} سیکل`}>
          <button
            onClick={() => props.handleViewCycles(record)}
            className="relative h-9 w-9 rounded-lg bg-blue-50 text-blue-700 border border-blue-200 hover:bg-blue-100 transition-all flex items-center justify-center group"
          >
            <UnorderedListOutlined className="text-lg" />
            {(record.IrrigationRecords?.length || 0) > 0 && (
              <span className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] px-1 bg-gradient-to-br from-blue-500 to-blue-600 text-white text-[10px] rounded-full flex items-center justify-center font-semibold shadow-md border border-white">
                {record.IrrigationRecords?.length}
              </span>
            )}
          </button>
        </Tooltip>
      ),
    },
    {
      title: "",
      dataIndex: "actions",
      key: "actions",
      render: (_: any, record: any) => (
        <TableActions onEdit={props.handleEdit.bind(_, record)} onDelete={props.handleDelete.bind(_, record)} />
      ),
    },
  ];

  return columns;
}

export const irrigationFormatters = {
  StartTime: (_row: any, v: any) => (v ? dayjs(v).calendar("jalali").locale("fa").format("YYYY/MM/DD HH:mm") : "-"),
  EndTime: (_row: any, v: any) => (v ? dayjs(v).calendar("jalali").locale("fa").format("YYYY/MM/DD HH:mm") : "-"),
  VolumeLiter: (_row: any, v: any) => (v !== null && v !== undefined ? Number(v).toFixed(2) : "-"),
  ECIn: (_row: any, v: any) => (v !== null && v !== undefined ? Number(v).toFixed(2) : "-"),
  ECOut: (_row: any, v: any) => (v !== null && v !== undefined ? Number(v).toFixed(2) : "-"),
  pHIn: (_row: any, v: any) => (v !== null && v !== undefined ? Number(v).toFixed(2) : "-"),
  pHOut: (_row: any, v: any) => (v !== null && v !== undefined ? Number(v).toFixed(2) : "-"),
  DrainPct: (_row: any, v: any) => (v !== null && v !== undefined ? Number(v).toFixed(2) : "-"),
  AvgFlowRate: (_row: any, v: any) => (v !== null && v !== undefined ? Number(v).toFixed(2) : "-"),
};
