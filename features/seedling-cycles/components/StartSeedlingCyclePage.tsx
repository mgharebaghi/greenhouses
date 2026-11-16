import {
  getGreenhousesForSelect,
  getOrdersForSelect,
  getStartSeedlingCycles,
} from "../actions";
import StartSeedlingCycleTable from "./StartSeedlingCycleTable";

export default async function StartSeedlingCyclePage() {
  const data = await getStartSeedlingCycles();
  const orders = await getOrdersForSelect();
  const greenhouses = await getGreenhousesForSelect();

  return (
    <div className="dashboard-page">
      <StartSeedlingCycleTable
        data={data}
        orders={orders}
        greenhouses={greenhouses}
      />
    </div>
  );
}
