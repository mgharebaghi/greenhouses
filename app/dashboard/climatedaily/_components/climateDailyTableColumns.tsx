import { ClimateDaily } from "@/app/generated/prisma";
import dayjs from "dayjs";
import jalaliday from "jalaliday";
import TableActions from "../../_components/UI/TableActions";
dayjs.extend(jalaliday);

type ClimateDailyColumnsProps = {
  handleEdit: (record: ClimateDaily) => void;
  handleDelete: (record: ClimateDaily) => void;
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
      title: "دمای خارجی (°C)",
      dataIndex: "ExternalTemp",
      key: "ExternalTemp",
      render: (value: number) => value?.toFixed(2) || "-",
    },
    {
      title: "رطوبت خارجی (%)",
      dataIndex: "ExternalHumidity",
      key: "ExternalHumidity",
      render: (value: number) => value?.toFixed(2) || "-",
    },
    {
      title: "فشار هوا (hPa)",
      dataIndex: "ExternalPressure",
      key: "ExternalPressure",
      render: (value: number) => value?.toFixed(2) || "-",
    },
    {
      title: "بارش (mm)",
      dataIndex: "ExternalRainfallMM",
      key: "ExternalRainfallMM",
      render: (value: number) => value?.toFixed(2) || "-",
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
      title: "CO2 (ppm)",
      dataIndex: "CO2ppm",
      key: "CO2ppm",
      render: (value: number) => value?.toFixed(2) || "-",
    },
    {
      title: "PAR خارجی",
      dataIndex: "ExternalPAR",
      key: "ExternalPAR",
      render: (value: number) => value?.toFixed(2) || "-",
    },
    {
      title: "DLI خارجی",
      dataIndex: "ExternalDLI",
      key: "ExternalDLI",
      render: (value: number) => value?.toFixed(2) || "-",
    },
    {
      title: "PAR داخلی",
      dataIndex: "InternalPAR",
      key: "InternalPAR",
      render: (value: number) => value?.toFixed(2) || "-",
    },
    {
      title: "DLI داخلی",
      dataIndex: "InternalDLI",
      key: "InternalDLI",
      render: (value: number) => value?.toFixed(2) || "-",
    },
    {
      title: "سرعت باد (m/s)",
      dataIndex: "WindSpeed",
      key: "WindSpeed",
      render: (value: number) => value?.toFixed(2) || "-",
    },
    {
      title: "جهت باد (°)",
      dataIndex: "WindDirection",
      key: "WindDirection",
      render: (value: number) => value || "-",
    },
    {
      title: "باز شدن هواکش (%)",
      dataIndex: "VentOpenPct",
      key: "VentOpenPct",
      render: (value: number) => value?.toFixed(2) || "-",
    },
    {
      title: "خطاهای هواکش",
      dataIndex: "VentErrorCount",
      key: "VentErrorCount",
      render: (value: number) => value || "-",
    },
    {
      title: "VPD (kPa)",
      dataIndex: "VPD",
      key: "VPD",
      render: (value: number) => value?.toFixed(2) || "-",
    },
    {
      title: "مشاهده کننده",
      key: "Owner_Observer",
      render: (_: any, record: any) => record.Owner_Observer?.FullName || "-",
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
