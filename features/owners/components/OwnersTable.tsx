import { Tbl_People } from "@/app/generated/prisma";
import { DeleteOutlined, EditOutlined, InfoCircleOutlined } from "@ant-design/icons";
// import { Table } from "antd";
import InsertionRow from "@/shared/components/InsertionRow";
import DeleteModal, { DeleteModalProps } from "@/shared/components/DeleteModal";
import { useState } from "react";
import { deleteOwner, getAllOwners, OwnerResponse } from "@/features/owners/services";
import Table from "@/shared/components/Table";
import TableActions from "@/shared/components/TableActions";
import { generateCsv, download, mkConfig } from "export-to-csv";
import { ownersCSVData, headers } from "../data/csvFileData";
import { Button, Tooltip } from "antd";
import { PeopleReadDTO } from "../schema";
import OwnerDetailModal from "./OwnerDetailModal";

type OwnersProps = {
  data: PeopleReadDTO[];
  loading: boolean;
  onEdit: (owner: PeopleReadDTO) => void;
  openInsertModal: () => void;
  setLoading: (loading: boolean) => void;
  setData: (data: PeopleReadDTO[]) => void;
};

export default function OwnersTable(props: OwnersProps) {
  const [deleteModal, setDeleteModal] = useState<DeleteModalProps | null>(null);
  const [deleteModalMsg, setDeleModalMsg] = useState("");
  const [deletModalLoading, setDeleteModalLoading] = useState(false);
  const [detailModal, setDetailModal] = useState<{ open: boolean, data: PeopleReadDTO | null }>({ open: false, data: null });

  const columns = [
    {
      title: "جزئیات",
      key: "details",
      width: 80,
      align: "center" as const,
      render: (_: any, record: any) => (
        <Tooltip title="مشاهده جزئیات">
          <Button
            type="text"
            icon={<InfoCircleOutlined style={{ color: "#3b82f6", fontSize: "18px" }} />}
            onClick={() => setDetailModal({ open: true, data: record })}
          />
        </Tooltip>
      ),
    },
    {
      title: "کد افراد",
      dataIndex: "PersonCode",
      key: "PersonCode",
    },
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
      title: "سمت پیشنهادی",
      dataIndex: "PostName",
      key: "PostName",
    },
    {
      title: "عملیات",
      key: "actions",
      render: (_: any, record: PeopleReadDTO) => (
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
    props.setData(newData.dta || []);
    props.setLoading(false);
  };

  return (
    <div className="w-full">
      <InsertionRow
        text="اطلاعات اشخاص"
        insertOnclick={() => {
          props.openInsertModal();
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

      <OwnerDetailModal
        open={detailModal?.open || false}
        onClose={() => setDetailModal({ open: false, data: null })}
        data={detailModal?.data}
      />
    </div>
  );
}
