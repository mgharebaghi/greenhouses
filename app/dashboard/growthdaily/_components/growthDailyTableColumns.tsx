import { PlantingGrowthDaily } from "@/app/generated/prisma";
import { DeleteOutlined, EditOutlined, InfoCircleOutlined } from "@ant-design/icons";
import { Button, Tooltip } from "antd";
import { ColumnsType } from "antd/es/table";
import dayjs from "dayjs";
import jalaliday from "jalaliday";
import TableActions from "../../_components/UI/TableActions";
import { title } from "process";
dayjs.extend(jalaliday);

type GrowthDailyColumnsProps = {
  handleEdit: (record: PlantingGrowthDaily) => void;
  handleDelete: (record: PlantingGrowthDaily) => void;
  handleDetail?: (record: any) => void;
};

type Column = {
  title: string;
  key: string;
  dataIndex?: string; // فقط string در جدول تو
  render?: (value: any, record: any, index: number) => React.ReactNode;
  sortable?: boolean;
  className?: string;
};

export function GrowthDailyColumns(props: GrowthDailyColumnsProps): Column[] {
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
      title: "شناسه کاشت",
      // dataIndex: "PlantingID",
      key: "Plantings",
      render: (_: any, record: any) => record?.PlantingSamples?.Plantings?.PlantingID || "-",
    },
    {
      title: "نام گونه گیاهی",
      // dataIndex: ["Plantings", "PlantVarieties", "VarietyName"],
      key: "PlantVarieties",
      render: (_: any, record: any) => record?.PlantingSamples?.Plantings?.PlantVarieties?.VarietyName || "-",
    },
    {
      title: "نمونه",
      key: "PlantingSamples",
      render: (_: any, record: any) => record?.PlantingSamples?.SerialID || "-",
    },
    {
      title: "مرحله رشد",
      // dataIndex: ["PlantGrowthStages", "StageName"],
      key: "PlantGrowthStages",
      render: (_: any, record: any) => record?.PlantGrowthStages?.StageName || "-",
    },
    {
      title: "تاریخ ثبت",
      dataIndex: "RecordDate",
      key: "RecordDate",
      render: (date: string) => (date ? dayjs(date).calendar("jalali").locale("fa").format("YYYY/MM/DD") : "-"),
    },
    {
      title: "ارتفاع (سانتی‌متر)",
      dataIndex: "HeightCm",
      key: "HeightCm",
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

export const growthDailyFormatters = {
  // با key ستون یا dataIndex هر دو کار می‌کند:
  RecordDate: (_row: any, v: any) => (v ? dayjs(v).calendar("jalali").locale("fa").format("YYYY/MM/DD") : "-"),

  IsEstimated: (_row: any, v: boolean) => (v ? "بله" : "خیر"),
  PestObserved: (_row: any, v: boolean) => (v ? "بله" : "خیر"),
};
