import { ClimateDaily } from "@/app/generated/prisma";
import { InfoCircleOutlined } from "@ant-design/icons";
import { Button, Tooltip } from "antd";
import dayjs from "dayjs";
import jalaliday from "jalaliday";
import TableActions from "../../_components/UI/TableActions";
dayjs.extend(jalaliday);

type ClimateDailyColumnsProps = {
  handleEdit: (record: ClimateDaily) => void;
  handleDelete: (record: ClimateDaily) => void;
  handleDetail?: (record: any) => void;
};

type Column = {
  title: string;
  key: string;
  dataIndex?: string;
  render?: (value: any, record: any, index: number) => React.ReactNode;
  sortable?: boolean;
  className?: string;
};

export function ClimateDailyColumns(props: ClimateDailyColumnsProps): Column[] {
  const columns: Column[] = [
    {
      title: "جزئیات",
      key: "details",
      render: (_: any, record: any) => (
        <Tooltip title="مشاهده جزئیات">
          <Button
            type="text"
            icon={<InfoCircleOutlined style={{ color: "#3b82f6", fontSize: "18px" }} />}
            onClick={() => props.handleDetail?.(record)}
          />
        </Tooltip>
      ),
    },
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
      title: "تاریخ ثبت",
      dataIndex: "RecordDate",
      key: "RecordDate",
      render: (date: string) => (date ? dayjs(date).calendar("jalali").locale("fa").format("YYYY/MM/DD") : "-"),
    },
    {
      title: "زمان ثبت",
      dataIndex: "RecordTime",
      key: "RecordTime",
      render: (time: string) => time || "-",
    },
    {
      title: "دمای داخلی (°C)",
      dataIndex: "InternalTemp",
      key: "InternalTemp",
      render: (value: number) => value?.toFixed(2) || "-",
    },
    {
      title: "رطوبت داخلی (%)",
      dataIndex: "InternalHumidity",
      key: "InternalHumidity",
      render: (value: number) => value?.toFixed(2) || "-",
    },
    {
      title: "عملیات",
      dataIndex: "actions",
      key: "actions",
      render: (_: any, record: any) => (
        <TableActions onEdit={props.handleEdit.bind(_, record)} onDelete={props.handleDelete.bind(_, record)} />
      ),
    },
  ];

  return columns;
}

export const climateDailyFormatters = {
  RecordDate: (_row: any, v: any) => (v ? dayjs(v).calendar("jalali").locale("fa").format("YYYY/MM/DD") : "-"),
  RecordTime: (_row: any, v: any) => v || "-",
  ExternalTemp: (_row: any, v: any) => (v !== null && v !== undefined ? Number(v).toFixed(2) : "-"),
  ExternalHumidity: (_row: any, v: any) => (v !== null && v !== undefined ? Number(v).toFixed(2) : "-"),
  ExternalPressure: (_row: any, v: any) => (v !== null && v !== undefined ? Number(v).toFixed(2) : "-"),
  ExternalRainfallMM: (_row: any, v: any) => (v !== null && v !== undefined ? Number(v).toFixed(2) : "-"),
  InternalTemp: (_row: any, v: any) => (v !== null && v !== undefined ? Number(v).toFixed(2) : "-"),
  InternalHumidity: (_row: any, v: any) => (v !== null && v !== undefined ? Number(v).toFixed(2) : "-"),
  CO2ppm: (_row: any, v: any) => (v !== null && v !== undefined ? Number(v).toFixed(2) : "-"),
  ExternalPAR: (_row: any, v: any) => (v !== null && v !== undefined ? Number(v).toFixed(2) : "-"),
  ExternalDLI: (_row: any, v: any) => (v !== null && v !== undefined ? Number(v).toFixed(2) : "-"),
  InternalPAR: (_row: any, v: any) => (v !== null && v !== undefined ? Number(v).toFixed(2) : "-"),
  InternalDLI: (_row: any, v: any) => (v !== null && v !== undefined ? Number(v).toFixed(2) : "-"),
  WindSpeed: (_row: any, v: any) => (v !== null && v !== undefined ? Number(v).toFixed(2) : "-"),
  VentOpenPct: (_row: any, v: any) => (v !== null && v !== undefined ? Number(v).toFixed(2) : "-"),
  VPD: (_row: any, v: any) => (v !== null && v !== undefined ? Number(v).toFixed(2) : "-"),
};
