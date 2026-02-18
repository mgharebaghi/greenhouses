import { getStartSeedlingCycles, getOrdersForSelect, getGreenhousesForSelect } from "../services/read";
import StartSeedlingCycleTable from "./StartSeedlingCycleTable";

export default async function StartSeedlingCyclePage() {
    const data = await getStartSeedlingCycles();
    const orders = await getOrdersForSelect();
    const greenhouses = await getGreenhousesForSelect();

    return (
        <div>
            <StartSeedlingCycleTable
                data={data}
                orders={orders}
                greenhouses={greenhouses}
            />
        </div>
    );
}
