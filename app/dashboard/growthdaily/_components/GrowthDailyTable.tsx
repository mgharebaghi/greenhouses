import type { PlantingGrowthDaily } from "@/app/generated/prisma";
import { Col, Row, Select } from "antd";
import Table from "@/app/dashboard/_components/UI/Table";

import { useEffect, useState } from "react";
import GrowthDailyInsUpModal, { GrowthDailyInsUpModalProps } from "./GrowthDailyInsUpModal";
import GrowthDailyDetailModal from "./GrowthDailyDetailModal";
import { GrowthDailyColumns, growthDailyFormatters } from "./growthDailyTableColumns";
import { getAllData, getDataByGreenHousId, getDataByPlantingId, getDataByZoneId } from "../data/queries";
import { fetchGreenhouseOptions, fetchPlantingOptions, fetchZoneOptions } from "../data/optionsData";
import DeleteModal, { DeleteModalProps } from "../../_components/UI/DeleteModal";
import { deleteGrowthDaily } from "@/app/lib/services/growthdaily/delete";
import { downloadCSVFromAntd } from "../../_components/tools/CSVoutput";
import InsertionRow from "../../_components/UI/InsertionRow";
import { getPlantingById } from "@/app/lib/services/planting";

export type GrowthDailyTableProps = {
  initialData: PlantingGrowthDaily[];
  setPlantingId?: (id: number | null) => void;
};

type selectOptions = {
  label: string | null;
  value: string | number;
};

export default function GrowthDailyTable(props: GrowthDailyTableProps) {
  const [deleteModal, setDeleteModal] = useState<DeleteModalProps | null>(null);
  const [detailModal, setDetailModal] = useState<{ open: boolean; data: any | null }>({
    open: false,
    data: null,
  });

  const [growthInsUpModal, setGrowthInsUpModal] = useState<GrowthDailyInsUpModalProps | null>(null);
  const [insUpModalMessage, setInsUpModalMessage] = useState("");
  const [dataSource, setDataSource] = useState<PlantingGrowthDaily[]>(props.initialData);
  const [tableLoading, setTableLoading] = useState(false);

  const [greenhouseOptions, setGreenhouseOptions] = useState<selectOptions[]>([]);
  const [greenhouseLoading, setGreenhouseLoading] = useState(false);
  const [greenHousId, setGreenHousId] = useState<number | null>(null);

  const [zoneOptions, setZoneOptions] = useState<selectOptions[]>([]);
  const [zoneLoading, setZoneLoading] = useState(false);
  const [zoneId, setZoneId] = useState<number | null>(null);

  const [plantingOptions, setPlantingOptions] = useState<selectOptions[]>([]);
  const [plantingLoading, setPlantingLoading] = useState(false);
  const [plantingId, setPlantingId] = useState<number | null>(null);
  const [varietyID, setVarietyID] = useState<number | null>(null);

  //   use effects*******************
  useEffect(() => {
    setInsUpModalMessage("");
    if (!plantingId && !zoneId && !greenHousId) {
      getAllData(setTableLoading, setDataSource);
    }

    if (!plantingId && !zoneId && greenHousId) {
      fetchZoneOptions(greenHousId, setZoneLoading, setZoneId, setZoneOptions, setPlantingId, setPlantingOptions);
      getDataByGreenHousId(greenHousId, setTableLoading, setDataSource);
    }

    if (!plantingId && zoneId && greenHousId) {
      fetchPlantingOptions(zoneId, setPlantingId, setPlantingOptions, setPlantingLoading);
      getDataByZoneId(zoneId, setTableLoading, setDataSource);
    }

    if (plantingId && zoneId && greenHousId) {
      getDataByPlantingId(plantingId, setTableLoading, setDataSource);
      plantingDataById(plantingId);
    }
  }, [plantingId, zoneId, greenHousId]);

  const plantingDataById = async (id: number) => {
    const res: any | null = await getPlantingById(id);
    if (res) {
      console.log("res", res.VarietyID);
      setVarietyID(res.VarietyID ?? null);
    }
  };

  useEffect(() => {
    fetchGreenhouseOptions(
      setZoneId,
      setPlantingId,
      setZoneOptions,
      setPlantingOptions,
      setGreenhouseLoading,
      setGreenhouseOptions
    );
  }, []);

  //   Fetch data functions*******************

  //   Handle changes*******************
  const handleGreenHousChange = (value: number | null) => {
    if (!value) {
      setGreenHousId(null);
      setZoneId(null);
      setPlantingId(null);
      setZoneOptions([]);
      setPlantingOptions([]);
    } else {
      setGreenHousId(value);
      setZoneId(null);
      setPlantingId(null);
      setZoneOptions([]);
      setPlantingOptions([]);
    }
  };

  const handleZoneChange = (value: number | null) => {
    if (!value) {
      setZoneId(null);
      setPlantingId(null);
      setPlantingOptions([]);
    } else {
      setZoneId(value);
      setPlantingId(null);
      setPlantingOptions([]);
    }
  };

  const handleEdit = async (record: any) => {
    await plantingDataById(Number(record.PlantingSamples.PlantingID));
    setGrowthInsUpModal({
      open: true,
      onClose: () => setGrowthInsUpModal(null),
      isEdititng: true,
      initialData: record,
      plantingId: Number(record.PlantingSamples.PlantingID),
      setMainData: setDataSource,
      setMainLoading: setTableLoading,
      varietyID: varietyID,
    });
  };

  const handleDetail = (record: any) => {
    setDetailModal({ open: true, data: record });
  };

  const handleDelete = (record: PlantingGrowthDaily) => {
    setDeleteModal({
      open: true,
      onClose: () => setDeleteModal(null),
      name: `پایش روزانه با شناسه ${record.PlantGrowthDailyID}`,
      id: Number(record.PlantGrowthDailyID),
      deleteLoading: false,
      onDelete: handleDeleteGrowthDaily,
    });
  };

  const handleDeleteGrowthDaily = async (id: number) => {
    setDeleteModal((prev) => (prev ? { ...prev, deleteLoading: true } : prev));
    const res = await deleteGrowthDaily(id);
    if (res) {
      setDeleteModal((prev) => (prev ? { ...prev, deleteLoading: false, open: false } : prev));
      plantingId
        ? await getDataByPlantingId(plantingId, setTableLoading, setDataSource)
        : await getAllData(setTableLoading, setDataSource);
    }
  };

  return (
    <div className="w-full">
      <Row gutter={[16, 16]} align="middle" className="mb-4">
        <Col xs={24} sm={24} md={8} lg={8}>
          <Select
            options={greenhouseOptions}
            placeholder="فیلتر بر اساس گلخانه"
            style={{ width: "100%" }}
            allowClear
            loading={greenhouseLoading}
            value={greenHousId ?? undefined}
            onChange={(value) => handleGreenHousChange(value as number | null)}
            showSearch
            optionFilterProp="label"
          />
        </Col>
        <Col xs={24} sm={24} md={8} lg={8}>
          <Select
            options={zoneOptions}
            placeholder="فیلتر بر اساس سالن"
            style={{ width: "100%" }}
            allowClear
            disabled={greenHousId === null && true}
            showSearch
            optionFilterProp="label"
            loading={zoneLoading}
            onChange={(value) => handleZoneChange(value as number | null)}
            value={zoneId ?? undefined}
          />
        </Col>

        <Col xs={24} sm={24} md={8} lg={8}>
          <Select
            options={plantingOptions}
            placeholder="فیلتر بر اساس شناسه کاشت"
            style={{ width: "100%" }}
            allowClear
            disabled={(zoneId === null && true) || (greenHousId === null && true)}
            showSearch
            loading={plantingLoading}
            optionFilterProp="label"
            value={plantingId ?? undefined}
            onChange={(value) => setPlantingId((value as number) ?? null)}
          />
        </Col>
      </Row>

      <InsertionRow
        text="پایش روزانه"
        data={dataSource}
        btnDisabled={!plantingId}
        insertOnclick={() =>
          setGrowthInsUpModal({
            open: true,
            onClose: () => setGrowthInsUpModal(null),
            isEdititng: false,
            setMainData: setDataSource,
            setMainLoading: setTableLoading,
          })
        }
        csvOnclick={() =>
          downloadCSVFromAntd<PlantingGrowthDaily>(
            dataSource,
            GrowthDailyColumns({ handleEdit, handleDelete, handleDetail }),
            `Growth-daily`,
            {
              formatters: growthDailyFormatters,
              forceExcelSeparatorLine: false,
              excludeKeys: ["actions", "details"],
            }
          )
        }
        msg={insUpModalMessage}
      />

      <Table
        columns={GrowthDailyColumns({ handleEdit, handleDelete, handleDetail })}
        dataSource={dataSource}
        rowKey="PlantGrowthDailyID"
        scroll={{ x: 300 }}
        loading={tableLoading}
        pagination={false}
      />

      <GrowthDailyInsUpModal
        open={growthInsUpModal?.open ?? false}
        onClose={() => setGrowthInsUpModal(null)}
        isEdititng={growthInsUpModal?.isEdititng || false}
        initialData={growthInsUpModal?.initialData}
        plantingId={growthInsUpModal?.plantingId || plantingId}
        setMainData={growthInsUpModal?.setMainData || setDataSource}
        setMainLoading={growthInsUpModal?.setMainLoading || setTableLoading}
        varietyID={varietyID}
      />

      <DeleteModal
        open={deleteModal?.open ?? false}
        onClose={() => setDeleteModal(null)}
        name={deleteModal?.name ?? ""}
        id={deleteModal?.id}
        onDelete={deleteModal?.onDelete}
        deleteLoading={deleteModal?.deleteLoading}
      />

      <GrowthDailyDetailModal
        open={detailModal.open}
        data={detailModal.data}
        onClose={() => setDetailModal({ open: false, data: null })}
      />
    </div>
  );
}
