import { PlantingGrowthDaily } from "@/app/generated/prisma";
import { DeleteOutlined, EditOutlined } from "@ant-design/icons";
import { Button } from "antd";
import { ColumnsType } from "antd/es/table";
import dayjs from "dayjs";
import jalaliday from "jalaliday";
dayjs.extend(jalaliday);

type GrowthDailyColumnsProps = {
  handleEdit: (record: PlantingGrowthDaily) => void;
  handleDelete: (record: PlantingGrowthDaily) => void;
};

export function GrowthDailyColumns(props: GrowthDailyColumnsProps): ColumnsType<PlantingGrowthDaily> {
  const columns = [
    {
      title: "مشاهده کننده",
      dataIndex: ["Owner_Observer", "FullName"],
      key: "Owner_Observer",
    },
    {
      title: "شناسه کاشت",
      dataIndex: ["PlantingID"],
      key: "Plantings",
    },
    {
      title: "نام گونه گیاهی",
      dataIndex: ["Plantings", "PlantVarieties", "VarietyName"],
      key: "PlantVarieties",
    },
    {
      title: "مرحله رشد",
      dataIndex: ["PlantGrowthStages", "StageName"],
      key: "PlantGrowthStages",
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
      dataIndex: "RootDiameter",
      key: "RootDiameter",
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
      title: "",
      dataIndex: "actions",
      key: "actions",
      render: (_: any, record: any) => (
        <div className="flex space-x-2">
          <Button type="link" onClick={props.handleEdit.bind(_, record)}>
            <EditOutlined />
          </Button>
          <Button type="link" style={{ color: "red" }} onClick={props.handleDelete.bind(_, record)}>
            <DeleteOutlined />
          </Button>
        </div>
      ),
    },
  ];

  return columns;
}
