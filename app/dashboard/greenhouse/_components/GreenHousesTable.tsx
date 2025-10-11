import { Greenhouses as GreenHouse } from "@/app/generated/prisma/client";
import { DeleteOutlined, EditOutlined } from "@ant-design/icons";
import Table, { ColumnsType } from "antd/es/table";

export default function GreenHousesTable({
  data,
  loading,
  handleEdit,
  handleDelete,
}: {
  data: GreenHouse[];
  loading: boolean;
  handleEdit: (record: GreenHouse) => void;
  handleDelete: (record: GreenHouse) => void;
}) {
  const columns: ColumnsType<GreenHouse> = [
    {
      title: "نام گلخانه",
      dataIndex: "GreenhouseName",
      key: "GreenhouseName",
    },
    {
      title: "آدرس",
      dataIndex: "Address",
      key: "Address",
    },
    {
      title: "مالک گاخانه",
      key: "Owner",
      render: (_: any, record: any) => {
        return (
          <div>
            {record.Owner_Observer.FirstName} {record.Owner_Observer.LastName}
          </div>
        );
      },
    },
    {
      title: "تعداد سالن ها",
      key: "Zones",
      render: (_: any, record: any) => {
        return <div>{record.Zones.length}</div>;
      },
    },
    {
      title: "",
      key: "action",
      render: (_: any, record: GreenHouse) => (
        <div className="flex space-x-10 space-x-reverse">
          <div onClick={() => handleEdit(record)} className="text-blue-600 cursor-pointer">
            <EditOutlined style={{ fontSize: 20 }} />
          </div>
          <div onClick={() => handleDelete(record)} className="text-red-600 cursor-pointer">
            <DeleteOutlined style={{ fontSize: 20 }} />
          </div>
        </div>
      ),
    },
  ];
  return <Table columns={columns} dataSource={data} loading={loading} rowKey="GreenhouseID" />;
}
