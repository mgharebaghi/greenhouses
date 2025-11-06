import type { ClimateDaily } from "@/app/generated/prisma";
import { Col, Row, Select } from "antd";
import Table from "@/app/dashboard/_components/UI/Table";
import { useEffect, useState } from "react";
import ClimateDailyInsUpModal, { ClimateDailyInsUpModalProps } from "./ClimateDailyInsUpModal";
import ClimateDailyDetailModal from "./ClimateDailyDetailModal";
import { ClimateDailyColumns, climateDailyFormatters } from "./climateDailyTableColumns";
import { getAllData, getDataByGreenhouseId, getDataByZoneId } from "../data/queries";
import { fetchGreenhouseOptions, fetchZoneOptions } from "../data/optionsData";
import DeleteModal, { DeleteModalProps } from "../../_components/UI/DeleteModal";
import { deleteClimateDaily } from "@/app/lib/services/climatedaily";
import { downloadCSVFromAntd } from "../../_components/tools/CSVoutput";
import InsertionRow from "../../_components/UI/InsertionRow";

export type ClimateDailyTableProps = {
  initialData: ClimateDaily[];
};

type SelectOptions = {
  label: string | null;
  value: string | number;
};

export default function ClimateDailyTable(props: ClimateDailyTableProps) {
  const [deleteModal, setDeleteModal] = useState<DeleteModalProps | null>(null);
  const [detailModal, setDetailModal] = useState<{ open: boolean; data: any | null }>({
    open: false,
    data: null,
  });
  const [climateInsUpModal, setClimateInsUpModal] = useState<ClimateDailyInsUpModalProps | null>(null);
  const [insUpModalMessage, setInsUpModalMessage] = useState("");
  const [dataSource, setDataSource] = useState<ClimateDaily[]>(props.initialData);
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

  const handleEdit = async (record: ClimateDaily) => {
    setClimateInsUpModal({
      open: true,
      onClose: () => setClimateInsUpModal(null),
      isEditing: true,
      initialData: record,
      zoneId: Number(record.ZoneID),
      setMainData: setDataSource,
      setMainLoading: setTableLoading,
    });
  };

  const handleDetail = (record: any) => {
    setDetailModal({ open: true, data: record });
  };

  const handleDelete = (record: ClimateDaily) => {
    setDeleteModal({
      open: true,
      onClose: () => setDeleteModal(null),
      name: `پایش آب و هوا با شناسه ${record.ClimateDailyID}`,
      id: Number(record.ClimateDailyID),
      deleteLoading: false,
      onDelete: handleDeleteClimateDaily,
    });
  };

  const handleDeleteClimateDaily = async (id: number) => {
    setDeleteModal((prev) => (prev ? { ...prev, deleteLoading: true } : prev));
    const res = await deleteClimateDaily(id);
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
        text="پایش آب و هوا"
        data={dataSource}
        btnDisabled={!zoneId}
        insertOnclick={() =>
          setClimateInsUpModal({
            open: true,
            onClose: () => setClimateInsUpModal(null),
            isEditing: false,
            zoneId: zoneId,
            setMainData: setDataSource,
            setMainLoading: setTableLoading,
          })
        }
        csvOnclick={() =>
          downloadCSVFromAntd<ClimateDaily>(
            dataSource,
            ClimateDailyColumns({ handleEdit, handleDelete, handleDetail }),
            `Climate-daily`,
            {
              formatters: climateDailyFormatters,
              forceExcelSeparatorLine: false,
              excludeKeys: ["actions", "details"],
            }
          )
        }
        msg={insUpModalMessage}
      />

      <Table
        columns={ClimateDailyColumns({ handleEdit, handleDelete, handleDetail })}
        dataSource={dataSource}
        rowKey="ClimateDailyID"
        scroll={{ x: 300 }}
        loading={tableLoading}
        pagination={false}
      />

      <ClimateDailyInsUpModal
        open={climateInsUpModal?.open ?? false}
        onClose={() => setClimateInsUpModal(null)}
        isEditing={climateInsUpModal?.isEditing || false}
        initialData={climateInsUpModal?.initialData}
        zoneId={climateInsUpModal?.zoneId || zoneId}
        setMainData={climateInsUpModal?.setMainData || setDataSource}
        setMainLoading={climateInsUpModal?.setMainLoading || setTableLoading}
      />

      <DeleteModal
        open={deleteModal?.open ?? false}
        onClose={() => setDeleteModal(null)}
        name={deleteModal?.name ?? ""}
        id={deleteModal?.id}
        onDelete={deleteModal?.onDelete}
        deleteLoading={deleteModal?.deleteLoading}
      />

      <ClimateDailyDetailModal
        open={detailModal.open}
        data={detailModal.data}
        onClose={() => setDetailModal({ open: false, data: null })}
      />
    </div>
  );
}
