import type { IrrigationEvent } from "@/app/generated/prisma";
import { Col, Row, Select } from "antd";
import Table from "@/app/dashboard/_components/UI/Table";
import { useEffect, useState } from "react";
import IrrigationInsUpModal, { IrrigationInsUpModalProps } from "./IrrigationInsUpModal";
import IrrigationCyclesModal, { IrrigationCyclesModalProps } from "./IrrigationCyclesModal";
import { IrrigationColumns, irrigationFormatters } from "./irrigationTableColumns";
import { getAllData, getDataByGreenhouseId, getDataByZoneId } from "../data/queries";
import { fetchGreenhouseOptions, fetchZoneOptions } from "../data/optionsData";
import DeleteModal, { DeleteModalProps } from "../../_components/UI/DeleteModal";
import { deleteIrrigationEvent } from "@/app/lib/services/irrigation";
import { downloadCSVFromAntd } from "../../_components/tools/CSVoutput";
import InsertionRow from "../../_components/UI/InsertionRow";

export type IrrigationTableProps = {
  initialData: IrrigationEvent[];
};

type SelectOptions = {
  label: string | null;
  value: string | number;
};

export default function IrrigationTable(props: IrrigationTableProps) {
  const [deleteModal, setDeleteModal] = useState<DeleteModalProps | null>(null);
  const [irrigationInsUpModal, setIrrigationInsUpModal] = useState<IrrigationInsUpModalProps | null>(null);
  const [cyclesModal, setCyclesModal] = useState<IrrigationCyclesModalProps | null>(null);
  const [insUpModalMessage, setInsUpModalMessage] = useState("");
  const [dataSource, setDataSource] = useState<IrrigationEvent[]>(props.initialData);
  const [tableLoading, setTableLoading] = useState(false);

  const [greenhouseOptions, setGreenhouseOptions] = useState<SelectOptions[]>([]);
  const [greenhouseLoading, setGreenhouseLoading] = useState(false);
  const [greenhouseId, setGreenhouseId] = useState<number | null>(null);

  const [zoneOptions, setZoneOptions] = useState<SelectOptions[]>([]);
  const [zoneLoading, setZoneLoading] = useState(false);
  const [zoneId, setZoneId] = useState<number | null>(null);

  // Use effects
  useEffect(() => {
    setInsUpModalMessage("");
    if (!zoneId && !greenhouseId) {
      getAllData(setTableLoading, setDataSource);
    }

    if (!zoneId && greenhouseId) {
      fetchZoneOptions(greenhouseId, setZoneLoading, setZoneId, setZoneOptions);
      getDataByGreenhouseId(greenhouseId, setTableLoading, setDataSource);
    }

    if (zoneId && greenhouseId) {
      getDataByZoneId(zoneId, setTableLoading, setDataSource);
    }
  }, [zoneId, greenhouseId]);

  useEffect(() => {
    fetchGreenhouseOptions(setZoneId, setZoneOptions, setGreenhouseLoading, setGreenhouseOptions);
  }, []);

  // Handle changes
  const handleGreenhouseChange = (value: number | null) => {
    if (!value) {
      setGreenhouseId(null);
      setZoneId(null);
      setZoneOptions([]);
    } else {
      setGreenhouseId(value);
      setZoneId(null);
      setZoneOptions([]);
    }
  };

  const handleZoneChange = (value: number | null) => {
    if (!value) {
      setZoneId(null);
    } else {
      setZoneId(value);
    }
  };

  const handleEdit = async (record: IrrigationEvent) => {
    setIrrigationInsUpModal({
      open: true,
      onClose: () => setIrrigationInsUpModal(null),
      isEditing: true,
      initialData: record,
      zoneId: Number(record.ZoneID),
      setMainData: setDataSource,
      setMainLoading: setTableLoading,
    });
  };

  const handleViewCycles = (record: IrrigationEvent) => {
    setCyclesModal({
      open: true,
      onClose: () => setCyclesModal(null),
      eventId: Number(record.EventID),
      eventData: record,
      setMainData: setDataSource,
      setMainLoading: setTableLoading,
      zoneId: zoneId,
      greenhouseId: greenhouseId,
    });
  };

  const handleDelete = (record: IrrigationEvent) => {
    setDeleteModal({
      open: true,
      onClose: () => setDeleteModal(null),
      name: `رویداد آبیاری با شناسه ${record.EventID}`,
      id: Number(record.EventID),
      deleteLoading: false,
      onDelete: handleDeleteIrrigationEvent,
    });
  };

  const handleDeleteIrrigationEvent = async (id: number) => {
    setDeleteModal((prev) => (prev ? { ...prev, deleteLoading: true } : prev));
    const res = await deleteIrrigationEvent(id);
    if (res) {
      setDeleteModal((prev) => (prev ? { ...prev, deleteLoading: false, open: false } : prev));
      if (zoneId) {
        await getDataByZoneId(zoneId, setTableLoading, setDataSource);
      } else if (greenhouseId) {
        await getDataByGreenhouseId(greenhouseId, setTableLoading, setDataSource);
      } else {
        await getAllData(setTableLoading, setDataSource);
      }
    }
  };

  return (
    <div className="w-full">
      <Row gutter={[16, 16]} align="middle" className="mb-4">
        <Col xs={24} sm={24} md={12} lg={12}>
          <Select
            options={greenhouseOptions}
            placeholder="فیلتر بر اساس گلخانه"
            style={{ width: "100%" }}
            allowClear
            loading={greenhouseLoading}
            value={greenhouseId ?? undefined}
            onChange={(value) => handleGreenhouseChange(value as number | null)}
            showSearch
            optionFilterProp="label"
          />
        </Col>
        <Col xs={24} sm={24} md={12} lg={12}>
          <Select
            options={zoneOptions}
            placeholder="فیلتر بر اساس سالن"
            style={{ width: "100%" }}
            allowClear
            disabled={greenhouseId === null}
            showSearch
            optionFilterProp="label"
            loading={zoneLoading}
            onChange={(value) => handleZoneChange(value as number | null)}
            value={zoneId ?? undefined}
          />
        </Col>
      </Row>

      <InsertionRow
        text="رویداد آبیاری"
        data={dataSource}
        btnDisabled={!zoneId}
        insertOnclick={() =>
          setIrrigationInsUpModal({
            open: true,
            onClose: () => setIrrigationInsUpModal(null),
            isEditing: false,
            zoneId: zoneId,
            setMainData: setDataSource,
            setMainLoading: setTableLoading,
          })
        }
        csvOnclick={() =>
          downloadCSVFromAntd<IrrigationEvent>(
            dataSource,
            IrrigationColumns({ handleEdit, handleDelete, handleViewCycles }),
            `Irrigation-events`,
            {
              formatters: irrigationFormatters,
              forceExcelSeparatorLine: false,
              excludeKeys: ["actions", "cycles"],
            }
          )
        }
        msg={insUpModalMessage}
      />

      <Table
        columns={IrrigationColumns({ handleEdit, handleDelete, handleViewCycles })}
        dataSource={dataSource}
        rowKey="EventID"
        scroll={{ x: 300 }}
        loading={tableLoading}
        pagination={false}
      />

      {irrigationInsUpModal?.open && (
        <IrrigationInsUpModal
          open={irrigationInsUpModal.open}
          onClose={() => setIrrigationInsUpModal(null)}
          isEditing={irrigationInsUpModal.isEditing || false}
          initialData={irrigationInsUpModal.initialData}
          zoneId={irrigationInsUpModal.zoneId || zoneId}
          setMainData={irrigationInsUpModal.setMainData || setDataSource}
          setMainLoading={irrigationInsUpModal.setMainLoading || setTableLoading}
        />
      )}

      {cyclesModal?.open && (
        <IrrigationCyclesModal
          open={cyclesModal.open}
          onClose={() => setCyclesModal(null)}
          eventId={cyclesModal.eventId || 0}
          eventData={cyclesModal.eventData}
          setMainData={cyclesModal.setMainData || setDataSource}
          setMainLoading={cyclesModal.setMainLoading || setTableLoading}
          zoneId={cyclesModal.zoneId}
          greenhouseId={cyclesModal.greenhouseId}
        />
      )}

      {deleteModal?.open && (
        <DeleteModal
          open={deleteModal.open}
          onClose={() => setDeleteModal(null)}
          name={deleteModal.name ?? ""}
          id={deleteModal.id}
          onDelete={deleteModal.onDelete}
          deleteLoading={deleteModal.deleteLoading}
        />
      )}
    </div>
  );
}
