"use client";

import type { IrrigationEvent } from "@/app/generated/prisma";
import IrrigationTable from "./IrrigationTable";

export default function IrrigationDashboard({ initialData }: { initialData: any }) {
  return (
    <div className="w-full h-full p-4">
      <IrrigationTable initialData={initialData as IrrigationEvent[]} />
    </div>
  );
}
