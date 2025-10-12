import { PlantingGrowthDaily } from "@/app/generated/prisma";
import { DeleteOutlined, EditOutlined } from "@ant-design/icons";
import { Button } from "antd";
import { ColumnsType } from "antd/es/table";
import dayjs from "dayjs";
import jalaliday from "jalaliday";
import TableActions from "../../_components/UI/TableActions";
dayjs.extend(jalaliday);

type GrowthDailyColumnsProps = {
  handleEdit: (record: PlantingGrowthDaily) => void;
  handleDelete: (record: PlantingGrowthDaily) => void;
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
      title: "شناسه کاشت",
      dataIndex: "PlantingID",
      key: "Plantings",
    },
    {
      title: "نام گونه گیاهی",
      // dataIndex: ["Plantings", "PlantVarieties", "VarietyName"],
      key: "PlantVarieties",
      render: (_: any, record: any) => record?.Plantings?.PlantVarieties?.VarietyName || "-",
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
      title: "تعداد برگ‌ها",
      dataIndex: "LeafCount",
      key: "LeafCount",
    },
    {
      title: "تعداد گل‌ها",
      dataIndex: "FlowerCount",
      key: "FlowerCount",
    },
    {
      title: "تعداد میوه‌ها",
      dataIndex: "FruitCount",
      key: "FruitCount",
    },
    {
      title: "طول ریشه",
      dataIndex: "RootLength",
      key: "RootLength",
    },
    {
      title: "قطر ریشه",
      dataIndex: "Rootdiameter",
      key: "Rootdiameter",
    },
    {
      title: "تخمینی",
      dataIndex: "IsEstimated",
      key: "IsEstimated",
      render: (isEstimated: boolean) => (isEstimated ? "بله" : "خیر"),
    },
    {
      title: "امتیاز سلامت",
      dataIndex: "HealthScore",
      key: "HealthScore",
    },
    {
      title: "مشاهده آفت",
      dataIndex: "PestObserved",
      key: "PestObserved",
      render: (pestObserved: boolean) => (pestObserved ? "بله" : "خیر"),
    },
    {
      title: "مشاهده کننده",
      // dataIndex: ["Owner_Observer", "FullName"],
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

export const growthDailyFormatters = {
  // با key ستون یا dataIndex هر دو کار می‌کند:
  RecordDate: (_row: any, v: any) => (v ? dayjs(v).calendar("jalali").locale("fa").format("YYYY/MM/DD") : "-"),

  IsEstimated: (_row: any, v: boolean) => (v ? "بله" : "خیر"),
  PestObserved: (_row: any, v: boolean) => (v ? "بله" : "خیر"),
};
