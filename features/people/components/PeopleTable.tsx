import { csvRows } from "@/shared/exports/csv";
import { runDeletion } from "@/shared/forms/delete-record";
import { InfoCircleOutlined } from "@ant-design/icons";

import { deletePerson, getPeople } from "@/features/people/actions";
import type { PersonActionResponse } from "@/features/people/types";
import DeleteModal, { DeleteModalProps } from "@/shared/components/DeleteModal";
import InsertionRow from "@/shared/components/InsertionRow";
import Table from "@/shared/components/Table";
import TableActions from "@/shared/components/TableActions";
import { Button, Tooltip } from "antd";
import { download, generateCsv, mkConfig } from "export-to-csv";
import { useState } from "react";
import { headers, peopleCSVData } from "../exports/csv";
import { PeopleReadDTO } from "../schema";
import PersonDetailModal from "./PersonDetailModal";

type PeopleTableProps = {
  data: PeopleReadDTO[];
  loading: boolean;
  onEdit: (owner: PeopleReadDTO) => void;
  openInsertModal: () => void;
  setLoading: (loading: boolean) => void;
  setData: (data: PeopleReadDTO[]) => void;
};

export default function PeopleTable(props: PeopleTableProps) {
  const [deleteModal, setDeleteModal] = useState<DeleteModalProps | null>(null);
  const [deleteModalMsg, setDeleModalMsg] = useState("");
  const [deletModalLoading, setDeleteModalLoading] = useState(false);
  const [detailModal, setDetailModal] = useState<{
    open: boolean;
    data: PeopleReadDTO | null;
  }>({ open: false, data: null });

  const columns = [
    {
      title: "جزئیات",
      key: "details",
      width: 80,
      align: "center" as const,
      render: (_: unknown, record: PeopleReadDTO) => (
        <Tooltip title="مشاهده جزئیات">
          <Button
            type="text"
            icon={
              <InfoCircleOutlined
                style={{ color: "#3b82f6", fontSize: "18px" }}
              />
            }
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
      title: "کد ملی",
      dataIndex: "NationalCode",
      key: "NationalCode",
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
      render: (_: unknown, record: PeopleReadDTO) => (
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
    await runDeletion(
      async () => {
        setDeleModalMsg("");
        setDeleteModalLoading(true);
        if (id) {
          const response: PersonActionResponse = await deletePerson(id);
          if (response.status !== "ok") throw new Error(response.message);
          {
            setDeleteModalLoading(false);
            setDeleteModal(null);
          }
        }

        props.setLoading(true);
        const newData: PersonActionResponse = await getPeople();
        props.setData(newData.dta || []);
        props.setLoading(false);
      },
      () => {
        setDeleteModalLoading(false);
        props.setLoading(false);
      },
    );
  };

  return (
    <div className="w-full">
      <InsertionRow
        text="اطلاعات اشخاص"
        insertOnclick={() => {
          props.openInsertModal();
        }}
        csvOnclick={async () => {
          const csvData = await peopleCSVData(props.data);
          const options = mkConfig({
            useKeysAsHeaders: false,
            columnHeaders: headers,
            filename: "owners",
          });
          const csv = generateCsv(options)(csvRows(csvData, headers));
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

      <PersonDetailModal
        open={detailModal?.open || false}
        onClose={() => setDetailModal({ open: false, data: null })}
        data={detailModal?.data}
      />
    </div>
  );
}
