"use client";

import { getSeedPlantings } from "@/features/seed-planting/actions";
import SeedPlantingTable from "@/features/seed-planting/components/SeedPlantingTable";
import DataLoadError from "@/shared/components/DataLoadError";
import useRemoteList from "@/shared/hooks/useRemoteList";

export default function SeedPlantingPage() {
  const { data, loading, setData, setLoading, error, refresh } =
    useRemoteList(getSeedPlantings);

  return (
    <div className="dashboard-page">
      {error ? (
        <DataLoadError onRetry={() => void refresh()} />
      ) : (
        <SeedPlantingTable
          data={data}
          loading={loading}
          setMainData={setData}
          setMainLoading={setLoading}
        />
      )}
    </div>
  );
}
