import type { PlantingGrowthDaily } from "@/app/generated/prisma";
import { PlusOutlined } from "@ant-design/icons";
import { Button, Col, Row, Select, Table } from "antd";

import { useEffect, useState } from "react";
import GrowthDailyInsUpModal, { GrowthDailyInsUpModalProps } from "./GrowthDailyInsUpModal";
import { GrowthDailyColumns } from "./growthDailyTableColumns";
import { getAllData, getDataByGreenHousId, getDataByPlantingId, getDataByZoneId } from "../data/queries";
import { fetchGreenhouseOptions, fetchPlantingOptions, fetchZoneOptions } from "../data/optionsData";
import DeleteModal, { DeleteModalProps } from "../../_components/tools/DeleteModal";
import { deleteGrowthDaily } from "@/app/lib/services/growthdaily/delete";

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
    }
  }, [plantingId, zoneId, greenHousId]);

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
    }
  };

  const handleZoneChange = (value: number | null) => {
    if (!value) {
      setZoneId(null);
      setPlantingId(null);
      setPlantingOptions([]);
    } else {
      setZoneId(value);
    }
  };

  const handleEdit = (record: PlantingGrowthDaily) => {
    setGrowthInsUpModal({
      open: true,
      onClose: () => setGrowthInsUpModal(null),
      isEdititng: true,
      initialData: record,
      plantingId: Number(record.PlantingID),
      setMainData: setDataSource,
      setMainLoading: setTableLoading,
    });
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
    <>
      <div className="w-full py-2 space-x-4">
        <Button
          type="primary"
          onClick={() => {
            if (plantingId) {
              setGrowthInsUpModal({ open: true, plantingId: plantingId });
            } else {
              setInsUpModalMessage("لطفا ابتدا یک شناسه کاشت را انتخاب کنید.");
            }
          }}
        >
          افزودن پایش روزانه <PlusOutlined />
        </Button>
        <span className="text-red-500">{insUpModalMessage}</span>
      </div>

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

      <Table
        columns={GrowthDailyColumns({ handleEdit, handleDelete })}
        dataSource={dataSource}
        rowKey="PlantGrowthDailyID"
        scroll={{ x: "max-content" }}
        loading={tableLoading}
      />

      <GrowthDailyInsUpModal
        open={growthInsUpModal?.open ?? false}
        onClose={() => setGrowthInsUpModal(null)}
        isEdititng={growthInsUpModal?.isEdititng || false}
        initialData={growthInsUpModal?.initialData}
        plantingId={growthInsUpModal?.plantingId || plantingId}
        setMainData={growthInsUpModal?.setMainData || setDataSource}
        setMainLoading={growthInsUpModal?.setMainLoading || setTableLoading}
      />

      <DeleteModal
        open={deleteModal?.open ?? false}
        onClose={() => setDeleteModal(null)}
        name={deleteModal?.name ?? ""}
        id={deleteModal?.id}
        onDelete={deleteModal?.onDelete}
        deleteLoading={deleteModal?.deleteLoading}
      />
    </>
  );
}
