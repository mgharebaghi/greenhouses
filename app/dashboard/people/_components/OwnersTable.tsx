import { Tbl_People } from "@/app/generated/prisma";
import { DeleteOutlined, EditOutlined } from "@ant-design/icons";
// import { Table } from "antd";
import InsertionRow from "../../_components/UI/InsertionRow";
import DeleteModal, { DeleteModalProps } from "../../_components/UI/DeleteModal";
import { useState } from "react";
import { deleteOwner, getAllOwners, OwnerResponse } from "@/app/lib/services/owners";
import Table from "@/app/dashboard/_components/UI/Table";
import TableActions from "../../_components/UI/TableActions";
import { generateCsv, download, mkConfig } from "export-to-csv";
import { ownersCSVData, headers } from "../data/csvFileData";

type OwnersProps = {
  data: Tbl_People[];
  loading: boolean;
  onEdit: (owner: Tbl_People) => void;
  setInsertModal: (open: boolean) => void;
  setLoading: (loading: boolean) => void;
  setData: (data: Tbl_People[]) => void;
};

export default function OwnersTable(props: OwnersProps) {
  const [deleteModal, setDeleteModal] = useState<DeleteModalProps | null>(null);
  const [deleteModalMsg, setDeleModalMsg] = useState("");
  const [deletModalLoading, setDeleteModalLoading] = useState(false);

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
      title: "آدرس  ایمیل",
      dataIndex: "EmailAddress",
      key: "EmailAddress"
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
      render: (_: any, record: Tbl_People) => (
        <TableActions
          onEdit={() => {
            props.onEdit(record);
          }}
          onDelete={() => {
            setDeleteModal({
              open: true,
              onClose() {
                setDeleteModal(null);
              },
              deleteLoading: deletModalLoading,
              id: record.ID,
              name: record.FirstName + " " + record.LastName,
              onDelete() {
                handleDelete(record.ID);
              },
              msg: deleteModalMsg,
            });
          }}
        />
      ),
    },
  ];

  const handleDelete = async (id: number) => {
    setDeleModalMsg("");
    setDeleteModalLoading(true);
    if (id) {
      const response: OwnerResponse = await deleteOwner(id);
      if (response.status === "ok") {
        setDeleteModalLoading(false);
        setDeleteModal(null);
      } else {
        setDeleteModalLoading(false);
        setDeleModalMsg(response.message);
        // props.setIsOpen && props.setIsOpen();
        return;
      }
    }

    props.setLoading(true);
    const newData: OwnerResponse = await getAllOwners();
    props.setData(newData.dta);
    props.setLoading(false);
  };

  return (
    <div className="w-full">
      <InsertionRow
        text="اطلاعات اشخاص"
        insertOnclick={() => {
          props.setInsertModal(true);
        }}
        csvOnclick={async () => {
          const csvData = await ownersCSVData(props.data as any);
          const options = mkConfig({ useKeysAsHeaders: false, columnHeaders: headers, filename: "owners" });
          const csv = generateCsv(options)(csvData);
          download(options)(csv);
        }}
        data={props.data}
      />
      <Table
        className="w-full"
        columns={columns}
        dataSource={props.data}
        rowKey="ID"
        pagination={{ pageSize: 5 }}
        loading={props.loading}
      />

      <DeleteModal
        open={deleteModal?.open || false}
        onClose={() => setDeleteModal(null)}
        deleteLoading={deletModalLoading}
        id={deleteModal?.id}
        msg={deleteModalMsg}
        name={deleteModal?.name}
        onDelete={deleteModal?.onDelete}
        setMsg={setDeleModalMsg}
      />
    </div>
  );
}
