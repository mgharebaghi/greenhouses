import Table from "@/app/dashboard/_components/UI/Table";
import { PlantVarietyDTO } from "../page";
import VarietiesInsUpModal from "./VarietiesInsUpModal";
import PlantVarietyDetailModal from "./PlantVarietyDetailModal";
import { useState } from "react";
import InsertionRow from "../../_components/UI/InsertionRow";
import { downloadCSVFromAntd } from "../../_components/tools/CSVoutput";
import TableActions from "../../_components/UI/TableActions";
import DeleteModal, { DeleteModalProps } from "../../_components/UI/DeleteModal";
import { deletePlantVariety, getPlantVarieties } from "@/app/lib/services/varities";
import { Button, Tooltip } from "antd";
import { InfoCircleOutlined } from "@ant-design/icons";

type PlantVarietiesTableProps = {
  data: PlantVarietyDTO[];
  loading?: boolean;
  setMainData?: (data: PlantVarietyDTO[]) => void;
  setMainLoading?: (loading: boolean) => void;
  setIsInsertModalOpen: (open: boolean) => void;
};

type editModalProps = {
  isOpen: boolean;
  record?: PlantVarietyDTO;
};

export default function PlantVaritiesTable({
  data,
  loading,
  setMainData,
  setMainLoading,
  setIsInsertModalOpen,
}: PlantVarietiesTableProps) {
  const [editModalOpen, setEditModalOpen] = useState<editModalProps | null>(null);
  const [deleteModalOpen, setDeleteModalOpen] = useState<DeleteModalProps | null>(null);
  const [deleteModalLoading, setDeleteModalLoading] = useState(false);
  const [deleteModalMsg, setDeleteModalMsg] = useState("");
  const [detailModal, setDetailModal] = useState<{ open: boolean; data: PlantVarietyDTO | null }>({
    open: false,
    data: null,
  });

  const columns = [
    {
      title: "جزئیات",
      key: "details",
      width: 80,
      align: "center" as const,
      render: (_: any, record: PlantVarietyDTO) => (
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
      title: "نام گونه",
      dataIndex: "VarietyName",
      key: "VarietyName",
    },
    {
      title: "نام گیاه",
      dataIndex: "CommonName",
      key: "CommonName",
      render: (_: any, record: PlantVarietyDTO) => record.Plants?.CommonName,
    },
    {
      title: "شرکت توزیع کننده بذر",
      dataIndex: "SeedCompany",
      key: "SeedCompany",
    },
    {
      title: "تعداد روز تا بلوغ",
      dataIndex: "DaysToMaturity",
      key: "DaysToMaturity",
    },
    {
      title: "محصول (کیلوگرم/متر مربع)",
      dataIndex: "TypicalYieldKgPerM2",
      key: "TypicalYieldKgPerM2",
    },
    {
      title: "عملیات",
      dataIndex: "actions",
      key: "actions",
      render: (_: any, record: PlantVarietyDTO) => (
        <TableActions
          onEdit={() => setEditModalOpen({ isOpen: true, record })}
          onDelete={() =>
            setDeleteModalOpen({
              open: true,
              onClose: () => setDeleteModalOpen(null),
              id: record.VarietyID,
              name: record.VarietyName || "",
              deleteLoading: deleteModalLoading,
              onDelete: () => handleDelete(record),
              msg: deleteModalMsg,
            })
          }
        />
      ),
    },
  ];

  const handleDelete = async (record: PlantVarietyDTO) => {
    setDeleteModalLoading(true);
    setDeleteModalMsg("");
    const res = await deletePlantVariety(record.VarietyID!);
    if (res) {
      setDeleteModalLoading(false);
      setDeleteModalOpen(null);
      setMainLoading?.(true);
      const newData: any = await getPlantVarieties();
      setMainData?.(newData);
      setMainLoading?.(false);
    } else {
      setDeleteModalLoading(false);
      setDeleteModalMsg("خطایی رخ داده است. لطفا دوباره تلاش کنید.");
    }
  };

  return (
    <>
      <InsertionRow
        text="افزودن گونه گیاهی"
        insertOnclick={() => setIsInsertModalOpen(true)}
        csvOnclick={() =>
          downloadCSVFromAntd(data, columns, "plantvarieties.csv", {
            forceExcelSeparatorLine: false,
            excludeKeys: ["actions"],
          })
        }
        data={data}
      />

      <Table
        columns={columns}
        dataSource={data}
        rowKey="VarietyID"
        loading={loading}
        pagination={false}
        scroll={{ x: 1000 }}
      />

      <VarietiesInsUpModal
        isOpen={editModalOpen?.isOpen || false}
        onClose={() => setEditModalOpen(null)}
        isEditMode
        editData={editModalOpen?.record as any}
        setMainLoading={setMainLoading}
        setMainData={setMainData as any}
      />

      <DeleteModal
        open={deleteModalOpen?.open || false}
        onClose={() => setDeleteModalOpen(null)}
        id={deleteModalOpen?.id}
        name={deleteModalOpen?.name}
        deleteLoading={deleteModalLoading}
        onDelete={deleteModalOpen?.onDelete}
        msg={deleteModalMsg}
      />

      <PlantVarietyDetailModal
        open={detailModal.open}
        data={detailModal.data}
        onClose={() => setDetailModal({ open: false, data: null })}
      />
    </>
  );
}
