import { Greenhouses as GreenHouse } from "@/app/generated/prisma/client";
import { useState } from "react";
import GreenHouseInsertModal from "./GreenHouseInsrtModal";
import InsertionRow from "../../_components/UI/InsertionRow";
import Table from "@/app/dashboard/_components/UI/Table";
import TableActions from "../../_components/UI/TableActions";
import DeleteModal, { DeleteModalProps } from "../../_components/UI/DeleteModal";
import { allGreenHouses, deleteGreenHouse } from "@/app/lib/services/greenhouse";
import { generateCsv, download, mkConfig } from "export-to-csv";
import { greenhousesCSVData, headers } from "../data/csvFileData";

export default function GreenHousesTable({
  data,
  loading,
  handleEdit,
  setMainLoading,
  setMainData,
}: {
  data: GreenHouse[];
  loading: boolean;
  handleEdit: (record: GreenHouse) => void;
  setMainLoading: (loading: boolean) => void;
  setMainData: (data: GreenHouse[]) => void;
}) {
  const [deleteModal, setDeleteModal] = useState<DeleteModalProps | null>(null);
  const [deleteModalMsg, setDeleModalMsg] = useState("");
  const [deletModalLoading, setDeleteModalLoading] = useState(false);
  const [insertModal, setInsertModal] = useState(false);
  const openInsertModal = () => {
    setInsertModal(true);
  };

  const columns = [
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
        <TableActions
          onEdit={() => handleEdit(record)}
          onDelete={() =>
            setDeleteModal({
              open: true,
              onClose() {
                setDeleteModal(null);
              },
              deleteLoading: deletModalLoading,
              id: record.GreenhouseID,
              name: record.GreenhouseName || "",
              onDelete() {
                handleDelete(record.GreenhouseID);
              },
              msg: deleteModalMsg,
            })
          }
        />
      ),
    },
  ];

  const handleDelete = async (id: number) => {
    setDeleteModalLoading(true);
    const res: any = await deleteGreenHouse(id);
    setDeleteModalLoading(false);
    if (res.status === "error") {
      setDeleModalMsg(res.message || "خطایی رخ داده است.");
      return;
    }
    setDeleteModal(null);
    setMainLoading(true);
    const newData = await allGreenHouses();
    setMainData(newData);
    setMainLoading(false);
  };

  return (
    <div className="w-full">
      <InsertionRow
        text="گلخانه"
        insertOnclick={openInsertModal}
        csvOnclick={async () => {
          const csvData = await greenhousesCSVData(data as any);
          const options = mkConfig({ useKeysAsHeaders: false, columnHeaders: headers, filename: "greenhouses" });
          const csv = generateCsv(options)(csvData);
          download(options)(csv);
        }}
        data={data}
      />
      <Table columns={columns} dataSource={data} loading={loading} rowKey="GreenhouseID" pagination={{ pageSize: 5 }} />
      <GreenHouseInsertModal
        modalOpen={insertModal}
        setModalOpen={setInsertModal}
        setMainLoading={setMainLoading}
        setMainData={setMainData}
      />

      <DeleteModal
        open={deleteModal?.open || false}
        onClose={() => setDeleteModal(null)}
        onDelete={deleteModal?.onDelete}
        name={deleteModal?.name}
        id={deleteModal?.id}
        msg={deleteModalMsg}
        deleteLoading={deletModalLoading}
        setMsg={setDeleModalMsg}
      />
    </div>
  );
}
