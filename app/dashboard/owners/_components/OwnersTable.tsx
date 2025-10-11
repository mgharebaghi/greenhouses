import { Owner_Observer } from "@/app/generated/prisma";
import { DeleteOutlined, EditOutlined } from "@ant-design/icons";
import { Table } from "antd";

type OwnersProps = {
  data: Owner_Observer[];
  loading: boolean;
  onEdit: (owner: Owner_Observer) => void;
  onDelete: (ownerId: Owner_Observer) => void;
};

export default function OwnersTable(props: OwnersProps) {
  const columns = [
    {
      title: "نام",
      dataIndex: "FirstName",
      key: "FirstName",
    },
    {
      title: "نام خانوادگی",
      dataIndex: "LastName",
      key: "LastName",
    },
    {
      title: "شماره تماس",
      dataIndex: "PhoneNumber",
      key: "PhoneNumber",
    },
    {
      title: "تخصص",
      dataIndex: "Profesion",
      key: "Profesion",
    },
    {
      title: "عملیات",
      key: "actions",
      render: (_: any, record: Owner_Observer) => (
        <div className="flex space-x-10 space-x-reverse">
          <div onClick={() => props.onEdit(record)} className="text-blue-600 cursor-pointer">
            <EditOutlined style={{ fontSize: 20 }} />
          </div>
          <div onClick={() => props.onDelete(record)} className="text-red-600 cursor-pointer">
            <DeleteOutlined style={{ fontSize: 20 }} />
          </div>
        </div>
      ),
    },
  ];

  return (
    <Table
      className="w-full"
      columns={columns}
      dataSource={props.data}
      rowKey="ID"
      pagination={false}
      loading={props.loading}
    />
  );
}
