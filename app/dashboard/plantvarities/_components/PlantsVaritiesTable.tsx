import Table from "@/app/dashboard/_components/UI/Table";
import { PlantVarietyDTO } from "../page";
import PlantVaritiesEditModal from "./PlantVaritiesEditModal";
import { useState } from "react";
import InsertionRow from "../../_components/UI/InsertionRow";
import { downloadCSVFromAntd } from "../../_components/tools/CSVoutput";
import TableActions from "../../_components/UI/TableActions";
import DeleteModal, { DeleteModalProps } from "../../_components/UI/DeleteModal";
import { deletePlantVariety, getPlantVarieties } from "@/app/lib/services/varities";

type PlantVarietiesTableProps = {
  data: PlantVarietyDTO[];
  loading?: boolean;
  setMainData?: (data: PlantVarietyDTO[]) => void;
  setMainLoading?: (loading: boolean) => void;
  setIsInsertModalOpen: (open: boolean) => void;
};

type editModalProps = {
  isOpen: boolean;
  onClose?: () => void;
  record?: PlantVarietyDTO;
  setMainLoading?: (loading: boolean) => void;
  setMainData?: (data: PlantVarietyDTO[]) => void;
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

  const columns = [
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
      title: "شرکت بذر",
      dataIndex: "SeedCompany",
      key: "SeedCompany",
    },
    {
      title: "روز تا جوانه زنی",
      dataIndex: "DaysToGermination",
      key: "DaysToGermination",
    },
    {
      title: "روز تا رویش",
      dataIndex: "DaysToSprout",
      key: "DaysToSprout",
    },
    {
      title: "روز تا نشاء",
      dataIndex: "DaysToSeedling",
      key: "DaysToSeedling",
    },
    {
      title: "روز تا بلوغ",
      dataIndex: "DaysToMaturity",
      key: "DaysToMaturity",
    },
    {
      title: "عملکرد معمول کیلوگرم بر متر مربع",
      dataIndex: "TypicalYieldKgPerM2",
      key: "TypicalYieldKgPerM2",
    },
    {
      title: "حداقل دمای ایده آل ",
      dataIndex: "IdealTempMin",
      key: "IdealTempMin",
    },
    {
      title: "حداکثر دمای ایده آل",
      dataIndex: "IdealTempMax",
      key: "IdealTempMax",
    },
    {
      title: "حداقل رطوبت ایده آل",
      dataIndex: "IdealHumidityMin",
      key: "IdealHumidityMin",
    },
    {
      title: "حداکثر رطوبت ایده آل",
      dataIndex: "IdealHumidityMax",
      key: "IdealHumidityMax",
    },
    {
      title: "نیاز نوری",
      dataIndex: "LightRequirement",
      key: "LightRequirement",
    },
    {
      title: "چرخه رشد (روز)",
      dataIndex: "GrowthCycleDays",
      key: "GrowthCycleDays",
    },
    {
      title: "",
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
        scroll={{ x: 2000 }}
      />

      <PlantVaritiesEditModal
        isOpen={editModalOpen?.isOpen || false}
        onClose={() => setEditModalOpen(null)}
        record={editModalOpen?.record}
        setMainLoading={setMainLoading}
        setMainData={setMainData}
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
    </>
  );
}
