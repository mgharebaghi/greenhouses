"use client";
import type { Plantings } from "@/app/generated/prisma";
import Table from "@/app/dashboard/_components/UI/Table";
import PlantingInsUpModal, { PlantingInsUpModalProps } from "./PlantingInsUpModal";
import { useState } from "react";
import DeleteModal, { DeleteModalProps } from "../../_components/UI/DeleteModal";
import { deletePlanting, getAllPlantings } from "@/app/lib/services/planting";
import dayjs from "dayjs";
import jalaliday from "jalaliday";
import { downloadCSVFromAntd } from "../../_components/tools/CSVoutput";
import InsertionRow from "../../_components/UI/InsertionRow";
import TableActions from "../../_components/UI/TableActions";
import QRCodeModal from "../../_components/UI/QRCodeModal";
import { DatabaseOutlined, PlusCircleOutlined, InfoCircleOutlined, PlusOutlined } from "@ant-design/icons";
import SamplesModal from "./SamplesModal";
import PlantingDetailModal from "./PlantingDetailModal";
import { Button, Tooltip } from "antd";

dayjs.extend(jalaliday);

type PlantingTableProps = {
  data: Plantings[];
  loading: boolean;
  setMainData?: (props: Plantings[]) => void;
  setMainLoading?: (loading: boolean) => void;
};

export default function PlantingTable({ data, loading, setMainData, setMainLoading }: PlantingTableProps) {
  const [insUpModal, setInsUpModal] = useState<PlantingInsUpModalProps | null>(null);
  const [onDeleteModal, setOnDeleteModal] = useState<DeleteModalProps | null>(null);
  const [onDeleteLoading, setOnDeleteLoading] = useState<boolean>(false);
  const [qrModal, setQrModal] = useState<{ visible: boolean; url: string; plantingId: number }>({
    visible: false,
    url: "",
    plantingId: 0,
  });

  const [samplesModal, setSamplesModal] = useState<{ plantingId: number; open: boolean }>({
    plantingId: 0,
    open: false,
  });

  const [detailModal, setDetailModal] = useState<{ open: boolean; data: Plantings | null }>({
    open: false,
    data: null,
  });

  const columns = [
    {
      title: "جزئیات",
      key: "details",
      width: 80,
      align: "center" as const,
      render: (_: any, record: Plantings) => (
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
      title: "شناسه کاشت",
      dataIndex: "PlantingID",
      key: "plantingID",
    },
    {
      title: "نام گلخانه",
      dataIndex: "GreenhouseName",
      key: "greenhouseName",
    },
    {
      title: "سالن",
      // dataIndex: ["Zones", "Name"],
      key: "zoneID",
      render: (_: any, record: any) => record.Zones?.Name,
    },
    {
      title: "گونه گیاهی",
      // dataIndex: ["PlantVarieties", "VarietyName"],
      key: "varietyName",
      render: (_: any, record: any) => record.PlantVarieties?.VarietyName,
    },
    {
      title: "تاریخ کاشت",
      dataIndex: "PlantDate",
      key: "plantDate",
      render: (date: string) => (
        <span>{date ? dayjs(date).calendar("jalali").locale("fa").format("YYYY/MM/DD") : "-"}</span>
      ),
    },
    {
      title: "تعداد گیاهان",
      dataIndex: "NumPlants",
      key: "numPlants",
    },
    {
      title: "ثبت نمونه های پایش",
      key: "monitoringSamples",
      render: (_: any, record: Plantings) => (
        <PlusOutlined size={18} style={{ color: "#10b981", fontSize: "18px" }}
          onClick={() => {
            setSamplesModal({ plantingId: Number(record.PlantingID), open: true });
          }}
        />
      ),
    },
    {
      title: "",
      dataIndex: "actions",
      key: "actions",
      render: (_: any, record: Plantings) => (
        <TableActions
          onEdit={() =>
            setInsUpModal({
              open: true,
              isInEditing: true,
              initialData: record,
              setMainData,
              setMainLoading,
              plantingId: Number(record.PlantingID),
              ZoneID: Number(record.ZoneID),
            })
          }
          onDelete={() => handleDelete(record)}
          qrcode={() => generateQR(Number(record.PlantingID))}
        />
      ),
    },
  ];

  const generateQR = (plantingId: number) => {
    const url = `https://mygreenhouses.ir/planting/${plantingId}`;
    setQrModal({
      visible: true,
      url,
      plantingId,
    });
  };

  const handleDelete = (record: Plantings) => {
    setOnDeleteModal({
      open: true,
      name: "شناسه کاشت با شماره  " + record.PlantingID,
      onClose: () => setOnDeleteModal(null),
      onDelete: onDelete,
      id: Number(record.PlantingID),
      deleteLoading: onDeleteLoading,
    });
  };

  const onDelete = async (id: number) => {
    setOnDeleteLoading(true);
    const res = await deletePlanting(id);
    if (res) {
      setOnDeleteLoading(false);
      setOnDeleteModal(null);
      setMainLoading?.(true);
      const newData: any = await getAllPlantings();
      setMainData?.(newData);
      setMainLoading?.(false);
    }
  };

  const formatter = {
    PlantDate: (_: any, v: any) => (v ? dayjs(v).calendar("jalali").locale("fa").format("YYYY/MM/DD") : "-"),
    ExpectedHarvestDate: (_: any, v: any) => (v ? dayjs(v).calendar("jalali").locale("fa").format("YYYY/MM/DD") : "-"),
    ActualHarvestDate: (_: any, v: any) => (v ? dayjs(v).calendar("jalali").locale("fa").format("YYYY/MM/DD") : "-"),
    TransplantDate: (_: any, v: any) => (v ? dayjs(v).calendar("jalali").locale("fa").format("YYYY/MM/DD") : "-"),
  };

  return (
    <>
      <InsertionRow
        text="اطلاعات کاشت"
        data={data}
        insertOnclick={() =>
          setInsUpModal({
            open: true,
            setMainData,
            setMainLoading,
            isInEditing: false,
            plantingId: 0,
            ZoneID: 0,
            initialData: undefined,
            onClose: () => setInsUpModal(null),
          })
        }
        csvOnclick={() =>
          downloadCSVFromAntd(data, columns, "plantings", {
            formatters: formatter,
            forceExcelSeparatorLine: false,
            excludeKeys: ["actions"],
          })
        }
      />

      <Table
        columns={columns}
        dataSource={data}
        loading={loading}
        rowKey="PlantingID"
        scroll={{ x: 300 }}
        pagination={false}
      />

      <PlantingInsUpModal
        open={insUpModal?.open || false}
        setMainData={setMainData}
        setMainLoading={setMainLoading}
        onClose={() => setInsUpModal(null)}
        isInEditing={insUpModal?.isInEditing || false}
        initialData={insUpModal?.initialData}
        plantingId={Number(insUpModal?.initialData?.PlantingID)}
      />

      <DeleteModal
        open={onDeleteModal?.open || false}
        name={onDeleteModal?.name}
        onClose={() => setOnDeleteModal(null)}
        onDelete={() => onDeleteModal?.onDelete?.(Number(onDeleteModal?.id))}
        deleteLoading={onDeleteLoading}
      />

      <QRCodeModal
        visible={qrModal.visible}
        url={qrModal.url}
        title={`QR Code - کاشت شماره ${qrModal.plantingId}`}
        onClose={() => setQrModal({ visible: false, url: "", plantingId: 0 })}
      />

      <SamplesModal
        open={samplesModal.open}
        plantingId={samplesModal.plantingId}
        onClose={() => setSamplesModal({ ...samplesModal, open: false })}
      />

      <PlantingDetailModal
        open={detailModal.open}
        data={detailModal.data}
        onClose={() => setDetailModal({ open: false, data: null })}
      />
    </>
  );
}
